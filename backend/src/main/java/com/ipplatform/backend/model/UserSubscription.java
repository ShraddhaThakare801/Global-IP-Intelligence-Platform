package com.ipplatform.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_subscriptions",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_user_lens",
        columnNames = {"user_id", "lens_id"}
    )
)
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "lens_id", nullable = false, length = 100)
    private String lensId;

    @Column(length = 500)
    private String title;

    @Column(length = 10)
    private String jurisdiction;

    @Column(name = "date_pub", length = 30)
    private String datePub;

    @Column(name = "subscribed_at", nullable = false)
    private LocalDateTime subscribedAt = LocalDateTime.now();

    public UserSubscription() {}

    public UserSubscription(Long userId, String lensId, String title,
                             String jurisdiction, String datePub) {
        this.userId       = userId;
        this.lensId       = lensId;
        this.title        = title;
        this.jurisdiction = jurisdiction;
        this.datePub      = datePub;
        this.subscribedAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId()                        { return id; }
    public Long getUserId()                    { return userId; }
    public void setUserId(Long userId)         { this.userId = userId; }
    public String getLensId()                  { return lensId; }
    public void setLensId(String lensId)       { this.lensId = lensId; }
    public String getTitle()                   { return title; }
    public void setTitle(String title)         { this.title = title; }
    public String getJurisdiction()            { return jurisdiction; }
    public void setJurisdiction(String j)      { this.jurisdiction = j; }
    public String getDatePub()                 { return datePub; }
    public void setDatePub(String datePub)     { this.datePub = datePub; }
    public LocalDateTime getSubscribedAt()     { return subscribedAt; }
    public void setSubscribedAt(LocalDateTime t){ this.subscribedAt = t; }
}
