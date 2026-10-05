package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.CommunicationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationRepository extends JpaRepository<CommunicationRecord, Long> {
    List<CommunicationRecord> findByCaseId(Long caseId);
    List<CommunicationRecord> findByCommunicationType(String communicationType);
}
