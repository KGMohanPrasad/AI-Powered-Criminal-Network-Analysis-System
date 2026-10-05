package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.SyncJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SyncJobRepository extends JpaRepository<SyncJob, String> {
}
