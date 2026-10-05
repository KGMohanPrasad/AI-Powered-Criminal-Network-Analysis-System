package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    Optional<Incident> findByIncidentId(String incidentId);
    List<Incident> findByCaseId(Long caseId);
    List<Incident> findByIncidentType(String incidentType);
    List<Incident> findByStatus(String status);
}
