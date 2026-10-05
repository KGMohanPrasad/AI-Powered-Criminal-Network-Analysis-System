package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByPersonId(String personId);
    List<Person> findByStatus(String status);
    List<Person> findByRiskLevel(String riskLevel);

    @Query("SELECT p FROM Person p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.alias) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.personId) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.primaryLocation) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Person> searchPersons(String query);
}
