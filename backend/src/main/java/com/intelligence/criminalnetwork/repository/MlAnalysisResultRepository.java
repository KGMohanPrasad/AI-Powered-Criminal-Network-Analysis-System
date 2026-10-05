package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.MlAnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MlAnalysisResultRepository extends JpaRepository<MlAnalysisResult, Long> {
    List<MlAnalysisResult> findByCaseId(Long caseId);
    List<MlAnalysisResult> findByAnalysisType(String analysisType);
    List<MlAnalysisResult> findByReviewStatus(String reviewStatus);
    List<MlAnalysisResult> findByEntityId(String entityId);
    List<MlAnalysisResult> findTop20ByOrderByCreatedAtDesc();
}
