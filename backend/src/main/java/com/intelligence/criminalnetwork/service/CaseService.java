package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.dto.CaseDto;
import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.CaseEntity;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.CaseRepository;
import com.intelligence.criminalnetwork.repository.EvidenceRepository;
import com.intelligence.criminalnetwork.repository.RelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaseService {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private EvidenceRepository evidenceRepository;

    @Autowired
    private RelationshipRepository relationshipRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<CaseDto> getAllCases(String status, String priority, String keyword) {
        List<CaseEntity> list;
        if (keyword != null && !keyword.isBlank()) {
            list = caseRepository.searchByKeyword(keyword);
        } else if (status != null && !status.isBlank()) {
            list = caseRepository.findByStatus(status);
        } else if (priority != null && !priority.isBlank()) {
            list = caseRepository.findByPriority(priority);
        } else {
            list = caseRepository.findAll();
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public CaseDto getCaseById(Long id) {
        CaseEntity c = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + id));
        return toDto(c);
    }

    public CaseDto getCaseByNumber(String caseNumber) {
        CaseEntity c = caseRepository.findByCaseNumber(caseNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with number: " + caseNumber));
        return toDto(c);
    }

    @Transactional
    public CaseDto createCase(CaseDto dto) {
        CaseEntity c = new CaseEntity();
        
        // Auto-generate case number if not provided
        if (dto.getCaseNumber() == null || dto.getCaseNumber().isBlank()) {
            long count = caseRepository.count() + 1;
            c.setCaseNumber(String.format("CASE-2026-%04d", count));
        } else {
            c.setCaseNumber(dto.getCaseNumber());
        }

        c.setTitle(dto.getTitle());
        c.setCaseType(dto.getCaseType());
        c.setLeadInvestigator(dto.getLeadInvestigator());
        c.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        c.setStatus(dto.getStatus() != null ? dto.getStatus() : "NEW");
        c.setIncidentDate(dto.getIncidentDate() != null ? dto.getIncidentDate() : LocalDate.now());
        c.setIncidentLocation(dto.getIncidentLocation());
        c.setAssignedTeam(dto.getAssignedTeam());
        c.setDescription(dto.getDescription());
        c.setNotes(dto.getNotes());

        CaseEntity saved = caseRepository.save(c);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_CASE",
                "CASE",
                saved.getCaseNumber(),
                "Created new investigation case: " + saved.getTitle()
        ));

        return toDto(saved);
    }

    @Transactional
    public CaseDto updateCase(Long id, CaseDto dto) {
        CaseEntity c = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + id));

        c.setTitle(dto.getTitle());
        c.setCaseType(dto.getCaseType());
        c.setLeadInvestigator(dto.getLeadInvestigator());
        c.setPriority(dto.getPriority());
        c.setStatus(dto.getStatus());
        c.setIncidentDate(dto.getIncidentDate());
        c.setIncidentLocation(dto.getIncidentLocation());
        c.setAssignedTeam(dto.getAssignedTeam());
        c.setDescription(dto.getDescription());
        c.setNotes(dto.getNotes());

        if ("CLOSED".equalsIgnoreCase(dto.getStatus()) && c.getClosedDate() == null) {
            c.setClosedDate(LocalDate.now());
        }

        CaseEntity saved = caseRepository.save(c);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_CASE",
                "CASE",
                saved.getCaseNumber(),
                "Updated investigation case: " + saved.getTitle() + " (Status: " + saved.getStatus() + ")"
        ));

        return toDto(saved);
    }

    @Transactional
    public void deleteCase(Long id) {
        CaseEntity c = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + id));

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_CASE",
                "CASE",
                c.getCaseNumber(),
                "Archived/Deleted case record: " + c.getTitle()
        ));

        caseRepository.delete(c);
    }

    private CaseDto toDto(CaseEntity c) {
        CaseDto dto = new CaseDto();
        dto.setId(c.getId());
        dto.setCaseNumber(c.getCaseNumber());
        dto.setTitle(c.getTitle());
        dto.setCaseType(c.getCaseType());
        dto.setLeadInvestigator(c.getLeadInvestigator());
        dto.setPriority(c.getPriority());
        dto.setStatus(c.getStatus());
        dto.setIncidentDate(c.getIncidentDate());
        dto.setIncidentLocation(c.getIncidentLocation());
        dto.setAssignedTeam(c.getAssignedTeam());
        dto.setDescription(c.getDescription());
        dto.setNotes(c.getNotes());

        dto.setEvidenceCount(evidenceRepository.findByCaseId(c.getId()).size());
        dto.setAssociatedPersonsCount((int) relationshipRepository.findByCaseId(c.getId()).stream()
                .filter(r -> "Person".equalsIgnoreCase(r.getSourceEntityType()) || "Person".equalsIgnoreCase(r.getTargetEntityType()))
                .count());

        return dto;
    }
}
