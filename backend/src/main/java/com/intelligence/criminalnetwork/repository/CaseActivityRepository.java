package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.CaseActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseActivityRepository extends JpaRepository<CaseActivity, Long> {
    List<CaseActivity> findByCaseIdOrderByTimestampDesc(Long caseId);

    List<CaseActivity> findByCaseNumberOrderByTimestampDesc(String caseNumber);

    List<CaseActivity> findTop20ByOrderByTimestampDesc();
}
