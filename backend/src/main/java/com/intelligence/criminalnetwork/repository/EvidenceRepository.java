package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    Optional<Evidence> findByEvidenceId(String evidenceId);
    List<Evidence> findByCaseId(Long caseId);
    List<Evidence> findByEvidenceType(String evidenceType);
    List<Evidence> findByStatus(String status);
}
