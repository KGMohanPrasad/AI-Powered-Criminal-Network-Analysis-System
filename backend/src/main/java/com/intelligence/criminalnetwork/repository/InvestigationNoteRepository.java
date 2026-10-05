package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.InvestigationNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationNoteRepository extends JpaRepository<InvestigationNote, Long> {
    List<InvestigationNote> findByRelatedCaseIdOrderByCreatedAtDesc(Long caseId);
    List<InvestigationNote> findByRelatedCaseIdOrderByPinnedDescCreatedAtDesc(Long caseId);
    List<InvestigationNote> findByRelatedPersonIdOrderByCreatedAtDesc(Long personId);
    List<InvestigationNote> findAllByOrderByPinnedDescCreatedAtDesc();
}
