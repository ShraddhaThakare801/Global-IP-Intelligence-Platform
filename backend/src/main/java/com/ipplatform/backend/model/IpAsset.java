package com.ipplatform.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ip_assets", indexes = {
        @Index(name = "idx_title", columnList = "title"),
        @Index(name = "idx_inventor", columnList = "inventor"),
        @Index(name = "idx_jurisdiction", columnList = "jurisdiction"),
        @Index(name = "idx_status", columnList = "status")
})
public class IpAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR(255)")
    private String title;

    @Column(columnDefinition = "VARCHAR(255)")
    private String inventor;

    @Column(columnDefinition = "VARCHAR(255)")
    private String jurisdiction;

    @Column(columnDefinition = "VARCHAR(255)")
    private String status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "filing_date")
    private LocalDate filingDate;

    @Column(name = "grant_date")
    private LocalDate grantDate;

    @Column(name = "renewal_date")
    private LocalDate renewalDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(columnDefinition = "VARCHAR(255)")
    private String legalStatusCode;

    public IpAsset() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInventor() {
        return inventor;
    }

    public void setInventor(String inventor) {
        this.inventor = inventor;
    }

    public String getJurisdiction() {
        return jurisdiction;
    }

    public void setJurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getFilingDate() {
        return filingDate;
    }

    public void setFilingDate(LocalDate filingDate) {
        this.filingDate = filingDate;
    }

    public LocalDate getGrantDate() {
        return grantDate;
    }

    public void setGrantDate(LocalDate grantDate) {
        this.grantDate = grantDate;
    }

    public LocalDate getRenewalDate() {
        return renewalDate;
    }

    public void setRenewalDate(LocalDate renewalDate) {
        this.renewalDate = renewalDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getLegalStatusCode() {
        return legalStatusCode;
    }

    public void setLegalStatusCode(String legalStatusCode) {
        this.legalStatusCode = legalStatusCode;
    }
}