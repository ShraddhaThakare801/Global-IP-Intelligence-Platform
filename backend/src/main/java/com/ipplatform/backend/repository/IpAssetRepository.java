package com.ipplatform.backend.repository;

import com.ipplatform.backend.model.IpAsset;
import com.ipplatform.backend.dto.IpAssetSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IpAssetRepository extends JpaRepository<IpAsset, Long> {

    @Query("""
        SELECT new com.ipplatform.backend.dto.IpAssetSummaryDTO(
            i.id, i.title, i.inventor, i.jurisdiction, i.status
        )
        FROM IpAsset i
        WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(i.inventor) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<IpAssetSummaryDTO> searchAssets(
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(String status);

    List<IpAsset> findByExpiryDateBetween(LocalDate start, LocalDate end);

    List<IpAsset> findByRenewalDateBetween(LocalDate start, LocalDate end);
}