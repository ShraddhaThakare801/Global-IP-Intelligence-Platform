package com.ipplatform.backend.dto;

public class LegalStatusSummaryDTO {
    private long totalApplications;
    private long totalGranted;
    private long totalRenewals;
    private long totalExpiringSoon;
    private long totalDiscontinued;

    public LegalStatusSummaryDTO() {}

    public LegalStatusSummaryDTO(long applications, long granted, long renewals, long expiringSoon, long totalDiscontinued) {
        this.totalApplications = applications;
        this.totalGranted = granted;
        this.totalRenewals = renewals;
        this.totalExpiringSoon = expiringSoon;
        this.totalDiscontinued = totalDiscontinued;
    }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getTotalGranted() { return totalGranted; }
    public void setTotalGranted(long totalGranted) { this.totalGranted = totalGranted; }

    public long getTotalRenewals() { return totalRenewals; }
    public void setTotalRenewals(long totalRenewals) { this.totalRenewals = totalRenewals; }

    public long getTotalExpiringSoon() { return totalExpiringSoon; }
    public void setTotalExpiringSoon(long totalExpiringSoon) { this.totalExpiringSoon = totalExpiringSoon; }
    
    public long getTotalDiscontinued() { return totalDiscontinued; }
    public void setTotalDiscontinued(long totalDiscontinued) { this.totalDiscontinued = totalDiscontinued; }
}
