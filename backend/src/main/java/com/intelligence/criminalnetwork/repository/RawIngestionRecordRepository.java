package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.RawIngestionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RawIngestionRecordRepository extends JpaRepository<RawIngestionRecord, Long> {
    List<RawIngestionRecord> findBySourceId(Long sourceId);
    List<RawIngestionRecord> findByProcessingStatus(String processingStatus);
}
