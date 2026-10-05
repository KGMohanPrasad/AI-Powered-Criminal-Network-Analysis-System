package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.IntelligenceAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IntelligenceAlertRepository extends JpaRepository<IntelligenceAlert, Long> {
    Optional<IntelligenceAlert> findByAlertId(String alertId);
    List<IntelligenceAlert> findByStatus(String status);
    List<IntelligenceAlert> findByAlertLevel(String alertLevel);
    List<IntelligenceAlert> findByCaseId(Long caseId);
    long countByStatus(String status);
}
