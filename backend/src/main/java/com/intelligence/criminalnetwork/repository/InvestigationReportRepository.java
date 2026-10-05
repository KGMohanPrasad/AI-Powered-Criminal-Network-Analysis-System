package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.InvestigationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationReportRepository extends JpaRepository<InvestigationReport, Long> {
    List<InvestigationReport> findAllByOrderByCreatedAtDesc();
}
