package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.DataSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DataSourceRepository extends JpaRepository<DataSource, Long> {
    List<DataSource> findByStatus(String status);
    List<DataSource> findBySourceType(String sourceType);
    Optional<DataSource> findBySourceName(String sourceName);
    Optional<DataSource> findByBaseUrl(String baseUrl);
}
