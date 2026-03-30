package com.ipplatform.backend.repository;

import com.ipplatform.backend.model.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    /** All subscriptions for a given user */
    List<UserSubscription> findByUserId(Long userId);

    /** Check if already subscribed */
    boolean existsByUserIdAndLensId(Long userId, String lensId);

    /** Unsubscribe */
    void deleteByUserIdAndLensId(Long userId, String lensId);
}
