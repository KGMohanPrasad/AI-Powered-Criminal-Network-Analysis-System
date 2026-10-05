package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.InvestigationNote;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.InvestigationNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    @Autowired private InvestigationNoteRepository noteRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<InvestigationNote> getNotes(Long caseId, Long personId, String query) {
        List<InvestigationNote> notes;
        if (caseId != null) {
            notes = noteRepository.findByRelatedCaseIdOrderByPinnedDescCreatedAtDesc(caseId);
        } else if (personId != null) {
            notes = noteRepository.findByRelatedPersonIdOrderByCreatedAtDesc(personId);
        } else {
            notes = noteRepository.findAllByOrderByPinnedDescCreatedAtDesc();
        }

        if (query != null && !query.isBlank()) {
            String q = query.trim().toLowerCase();
            notes = notes.stream()
                    .filter(n -> (n.getTitle() != null && n.getTitle().toLowerCase().contains(q)) ||
                                 (n.getContent() != null && n.getContent().toLowerCase().contains(q)) ||
                                 (n.getCreatedBy() != null && n.getCreatedBy().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }
        return notes;
    }

    public InvestigationNote getNoteById(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + id));
    }

    @Transactional
    public InvestigationNote createNote(InvestigationNote note) {
        if (note.getCreatedBy() == null || note.getCreatedBy().isBlank()) {
            note.setCreatedBy(getCurrentUsername());
        }
        InvestigationNote saved = noteRepository.save(note);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_NOTE",
                "NOTE",
                String.valueOf(saved.getId()),
                "Created investigation note: " + saved.getTitle()
        ));
        return saved;
    }

    @Transactional
    public InvestigationNote updateNote(Long id, InvestigationNote updated) {
        InvestigationNote note = getNoteById(id);
        if (updated.getTitle() != null) note.setTitle(updated.getTitle());
        if (updated.getContent() != null) note.setContent(updated.getContent());
        if (updated.getPriority() != null) note.setPriority(updated.getPriority());
        if (updated.getVisibility() != null) note.setVisibility(updated.getVisibility());
        if (updated.getRelatedCaseId() != null) note.setRelatedCaseId(updated.getRelatedCaseId());
        if (updated.getRelatedPersonId() != null) note.setRelatedPersonId(updated.getRelatedPersonId());

        InvestigationNote saved = noteRepository.save(note);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_NOTE",
                "NOTE",
                String.valueOf(saved.getId()),
                "Updated investigation note: " + saved.getTitle()
        ));
        return saved;
    }

    @Transactional
    public InvestigationNote togglePin(Long id) {
        InvestigationNote note = getNoteById(id);
        note.setPinned(!note.isPinned());
        return noteRepository.save(note);
    }

    @Transactional
    public void deleteNote(Long id) {
        InvestigationNote note = getNoteById(id);
        noteRepository.delete(note);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_NOTE",
                "NOTE",
                String.valueOf(id),
                "Deleted investigation note: " + note.getTitle()
        ));
    }
}
