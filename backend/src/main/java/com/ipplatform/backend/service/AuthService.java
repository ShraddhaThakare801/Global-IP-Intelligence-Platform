package com.ipplatform.backend.service;

import com.ipplatform.backend.exception.AuthException;
import com.ipplatform.backend.model.PasswordResetToken;
import com.ipplatform.backend.model.RefreshToken;
import com.ipplatform.backend.model.Role;
import com.ipplatform.backend.model.User;
import com.ipplatform.backend.repository.PasswordResetTokenRepository;
import com.ipplatform.backend.repository.RefreshTokenRepository;
import com.ipplatform.backend.repository.UserRepository;
import com.ipplatform.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    @Value("${auth.refresh-token-expiry-days:7}")
    private int normalRefreshDays;

    @Value("${auth.remember-me-expiry-days:30}")
    private int rememberMeDays;

    @Value("${auth.password-reset-expiry-minutes:60}")
    private int passwordResetMinutes;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordResetTokenRepository resetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    // ─────────────────────────────────────────
    // REGISTER (UPDATED FOR ROLE + APPROVAL)
    // ─────────────────────────────────────────

    public void register(String username, String email,
                         String password, String name, String roleInput) {

        if (userRepository.findByUsername(username).isPresent()) {
            throw new AuthException("Username already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new AuthException("Email already registered");
        }

        validatePasswordStrength(password);

        Role selectedRole;
        try {
            selectedRole = Role.valueOf("ROLE_" + roleInput.toUpperCase());
        } catch (Exception e) {
            throw new AuthException("Invalid role selected");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setName(name != null ? name : username);
        user.setProvider("local");
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(List.of(selectedRole.value()));

        // Analyst requires admin approval
        if (selectedRole == Role.ROLE_ANALYST) {
            user.setApproved(false);
        } else {
            user.setApproved(true);
        }

        userRepository.save(user);

        try { emailService.sendWelcomeEmail(email, user.getName()); }
        catch (Exception ignored) {}
    }

    // ─────────────────────────────────────────
    // LOGIN (BLOCK UNAPPROVED ANALYSTS)
    // ─────────────────────────────────────────

    public TokenPair login(String username, String password, boolean rememberMe) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("Invalid credentials"));

        if (user.getPassword() == null) {
            throw new AuthException("This account uses Google login. Please sign in with Google.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthException("Invalid credentials");
        }

        // 🚨 Block unapproved analysts
        if (!user.isApproved()) {
            throw new AuthException("Your analyst account is pending admin approval.");
        }

        return issueTokenPair(user, rememberMe);
    }

    // ─────────────────────────────────────────
    // REFRESH
    // ─────────────────────────────────────────

    public TokenPair refresh(String rawRefreshToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(rawRefreshToken)
                .orElseThrow(() -> new AuthException("Invalid refresh token"));

        if (!stored.isValid()) {
            refreshTokenRepository.revokeAllByUser(stored.getUser());
            throw new AuthException("Refresh token expired or revoked. Please log in again.");
        }

        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        return issueTokenPair(stored.getUser(), stored.isRememberMe());
    }

    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByToken(rawRefreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    public void logoutAll(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("User not found"));
        refreshTokenRepository.revokeAllByUser(user);
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            if (!"local".equals(user.getProvider())) return;

            resetTokenRepository.deleteAllByUser(user);

            String token = UUID.randomUUID().toString();
            Instant expiry = Instant.now().plus(passwordResetMinutes, ChronoUnit.MINUTES);

            resetTokenRepository.save(new PasswordResetToken(token, user, expiry));
            emailService.sendPasswordResetEmail(email, token);
        });
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthException("Invalid or expired reset link"));

        if (!resetToken.isValid()) {
            throw new AuthException("Reset link has expired. Please request a new one.");
        }

        validatePasswordStrength(newPassword);

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);

        refreshTokenRepository.revokeAllByUser(user);
    }

    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("User not found"));

        if (user.getPassword() == null ||
                !passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new AuthException("Current password is incorrect");
        }

        validatePasswordStrength(newPassword);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        refreshTokenRepository.revokeAllByUser(user);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthException("User not found"));
    }

    // ─────────────────────────────────────────
    // OAUTH
    // ─────────────────────────────────────────

    public TokenPair provisionOAuthUser(String email, String name,
                                        String googleId, String pictureUrl) {

        User user = userRepository
                .findByProviderAndProviderId("google", googleId)
                .orElseGet(() ->
                        userRepository.findByEmail(email)
                                .orElseGet(() -> {
                                    User newUser = new User();
                                    newUser.setUsername(generateOAuthUsername(email));
                                    newUser.setEmail(email);
                                    newUser.setName(name);
                                    newUser.setProvider("google");
                                    newUser.setProviderId(googleId);
                                    newUser.setRoles(List.of(Role.ROLE_USER.value()));
                                    newUser.setApproved(true);
                                    return newUser;
                                })
                );

        user.setName(name);
        user.setProvider("google");
        user.setProviderId(googleId);
        userRepository.save(user);

        return issueTokenPair(user, false);
    }

    // ─────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────

    private TokenPair issueTokenPair(User user, boolean rememberMe) {
        String accessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getRoles());

        int expiryDays = rememberMe ? rememberMeDays : normalRefreshDays;
        String rawRefreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        Instant expiresAt = Instant.now().plus(expiryDays, ChronoUnit.DAYS);

        RefreshToken dbToken = new RefreshToken(rawRefreshToken, user, expiresAt, rememberMe);
        refreshTokenRepository.save(dbToken);

        return new TokenPair(accessToken, rawRefreshToken, user);
    }

    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8)
            throw new AuthException("Password must be at least 8 characters");
        if (!password.matches(".*[A-Z].*"))
            throw new AuthException("Password must contain at least one uppercase letter");
        if (!password.matches(".*[0-9].*"))
            throw new AuthException("Password must contain at least one number");
    }

    private String generateOAuthUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        String candidate = base;
        int suffix = 1;
        while (userRepository.findByUsername(candidate).isPresent()) {
            candidate = base + suffix++;
        }
        return candidate;
    }

    public record TokenPair(String accessToken, String refreshToken, User user) {}
}