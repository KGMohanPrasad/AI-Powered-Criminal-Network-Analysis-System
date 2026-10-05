package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, Long> {
    List<Relationship> findByCaseId(Long caseId);
    List<Relationship> findByVerificationStatus(String verificationStatus);
    List<Relationship> findByRelationshipType(String relationshipType);

    @Query("SELECT r FROM Relationship r WHERE (r.sourceEntityId = :entityId OR r.targetEntityId = :entityId)")
    List<Relationship> findConnectedToEntity(String entityId);

    @Query("SELECT r FROM Relationship r WHERE r.strength >= :minStrength")
    List<Relationship> findByMinimumStrength(Integer minStrength);
}
