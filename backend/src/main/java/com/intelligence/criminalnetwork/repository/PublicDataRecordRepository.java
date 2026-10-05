package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.PublicDataRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PublicDataRecordRepository extends JpaRepository<PublicDataRecord, Long> {
    Optional<PublicDataRecord> findByFingerprint(String fingerprint);
    List<PublicDataRecord> findByVerificationStatus(String status);
    List<PublicDataRecord> findByCategory(String category);
    List<PublicDataRecord> findByState(String state);
    List<PublicDataRecord> findBySourceId(Long sourceId);

    @Query("SELECT r FROM PublicDataRecord r WHERE " +
           "(:category IS NULL OR :category = 'ALL' OR r.category = :category) AND " +
           "(:state IS NULL OR :state = 'ALL' OR r.state = :state) AND " +
           "(:status IS NULL OR :status = 'ALL' OR r.verificationStatus = :status) AND " +
           "(:search IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.sourceName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.district) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY r.eventDate DESC, r.retrievedAt DESC")
    Page<PublicDataRecord> searchRecords(
        @Param("category") String category,
        @Param("state") String state,
        @Param("status") String status,
        @Param("search") String search,
        Pageable pageable
    );

    @Query("SELECT r.category, COUNT(r) FROM PublicDataRecord r GROUP BY r.category")
    List<Object[]> countByCategory();

    @Query("SELECT r.state, COUNT(r) FROM PublicDataRecord r WHERE r.state IS NOT NULL GROUP BY r.state")
    List<Object[]> countByState();

    @Query("SELECT r.sourceBadge, COUNT(r) FROM PublicDataRecord r GROUP BY r.sourceBadge")
    List<Object[]> countBySourceBadge();
}
