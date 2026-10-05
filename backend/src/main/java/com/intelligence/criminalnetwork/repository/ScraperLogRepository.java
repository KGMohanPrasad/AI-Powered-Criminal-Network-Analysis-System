package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.ScraperLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScraperLogRepository extends JpaRepository<ScraperLog, Long> {
    List<ScraperLog> findBySourceIdOrderByStartTimeDesc(Long sourceId);
    List<ScraperLog> findTop25ByOrderByStartTimeDesc();
}
