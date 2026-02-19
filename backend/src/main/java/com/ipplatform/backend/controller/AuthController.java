package com.ipplatform.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.ipplatform.backend.dto.RegisterRequest;
import com.ipplatform.backend.model.*;
import com.ipplatform.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Map;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest request)
 {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return Map.of("error", "Email already registered");

        }

        Role role;

        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (Exception e) {
            return Map.of("error", "Invalid role selected");

        }

        if (role == Role.ADMIN) {
            return Map.of("error", "ADMIN registration not allowed");

        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        return Map.of(
        "message", "User registered successfully",
        "role", role
);

    }
}
