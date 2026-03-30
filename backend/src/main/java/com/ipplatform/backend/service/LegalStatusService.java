package com.ipplatform.backend.service;

import com.ipplatform.backend.dto.LegalStatusSummaryDTO;
import com.ipplatform.backend.model.IpAsset;
import com.ipplatform.backend.repository.IpAssetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class LegalStatusService {

    private final IpAssetRepository repository;

    public LegalStatusService(IpAssetRepository repository) {
        this.repository = repository;
    }

    public LegalStatusSummaryDTO getSummary() {
        long apps = repository.countByStatus("APPLICATION");
        long granted = repository.countByStatus("GRANTED");
        long renewals = repository.countByStatus("RENEWAL");
        long discontinued = repository.countByStatus("DISCONTINUED");

        // Alternatively, expiring could be calculated by querying next 90 days
        LocalDate today = LocalDate.now();
        long dynamicExpiringSoon = repository.findByExpiryDateBetween(today, today.plusDays(90)).size();

        return new LegalStatusSummaryDTO(apps, granted, renewals, dynamicExpiringSoon, discontinued);
    }

    public Map<String, List<IpAsset>> getAlerts() {
        LocalDate today = LocalDate.now();
        List<IpAsset> upcomingExpiries = repository.findByExpiryDateBetween(today, today.plusDays(90));
        List<IpAsset> upcomingRenewals = repository.findByRenewalDateBetween(today, today.plusDays(90));

        return Map.of(
            "expiries", upcomingExpiries,
            "renewals", upcomingRenewals
        );
    }

    public Map<String, Object> getPipeline() {
        // Pipeline logic for funnel charts (could be refined further depending on frontend needs)
        long total = repository.count();
        long applications = repository.countByStatus("APPLICATION");
        long granted = repository.countByStatus("GRANTED");
        long discontinued = repository.countByStatus("DISCONTINUED");
        
        return Map.of(
            "total", total,
            "pipeline", Map.of(
                "applications", applications,
                "granted", granted,
                "discontinued", discontinued
            )
        );
    }
}
