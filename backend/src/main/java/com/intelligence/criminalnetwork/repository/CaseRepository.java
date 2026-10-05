package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.CaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends JpaRepository<CaseEntity, Long> {
    Optional<CaseEntity> findByCaseNumber(String caseNumber);
    List<CaseEntity> findByStatus(String status);
    List<CaseEntity> findByPriority(String priority);
    
    @Query("SELECT c FROM CaseEntity c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<CaseEntity> searchByKeyword(String keyword);

    long countByStatus(String status);
}
