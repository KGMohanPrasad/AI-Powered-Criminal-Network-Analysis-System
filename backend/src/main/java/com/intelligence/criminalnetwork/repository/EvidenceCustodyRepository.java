package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.EvidenceCustody;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceCustodyRepository extends JpaRepository<EvidenceCustody, Long> {
    List<EvidenceCustody> findByEvidenceIdOrderByTransferDateAsc(Long evidenceId);
}
