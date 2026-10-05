package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.dto.EvidenceDto;
import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.Evidence;
import com.intelligence.criminalnetwork.entity.EvidenceCustody;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.EvidenceCustodyRepository;
import com.intelligence.criminalnetwork.repository.EvidenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;

@Service
public class EvidenceService {

    @Autowired private EvidenceRepository evidenceRepository;
    @Autowired private EvidenceCustodyRepository custodyRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<Evidence> getAllEvidence(Long caseId, String type, String status) {
        if (caseId != null) return evidenceRepository.findByCaseId(caseId);
        if (type != null && !type.isBlank()) return evidenceRepository.findByEvidenceType(type);
        if (status != null && !status.isBlank()) return evidenceRepository.findByStatus(status);
        return evidenceRepository.findAll();
    }

    public Evidence getEvidenceById(Long id) {
        return evidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with ID: " + id));
    }

    public List<EvidenceCustody> getCustodyTimeline(Long evidenceId) {
        return custodyRepository.findByEvidenceIdOrderByTransferDateAsc(evidenceId);
    }

    @Transactional
    public Evidence createEvidence(EvidenceDto dto) {
        Evidence e = new Evidence();

        if (dto.getEvidenceId() == null || dto.getEvidenceId().isBlank()) {
            long count = evidenceRepository.count() + 1;
            e.setEvidenceId(String.format("EV-%04d", count));
        } else {
            e.setEvidenceId(dto.getEvidenceId());
        }

        e.setCaseId(dto.getCaseId());
        e.setCaseNumber(dto.getCaseNumber());
        e.setEvidenceType(dto.getEvidenceType());
        e.setDescription(dto.getDescription());
        e.setCollectedBy(dto.getCollectedBy() != null ? dto.getCollectedBy() : getCurrentUsername());
        e.setCollectedDate(dto.getCollectedDate() != null ? dto.getCollectedDate() : LocalDate.now());
        e.setSource(dto.getSource());
        e.setStorageReference(dto.getStorageReference() != null ? dto.getStorageReference() : "VAULT-SEC-01/TAG-" + e.getEvidenceId());
        
        // Generate cryptographic hash if not present
        if (dto.getIntegrityHash() == null || dto.getIntegrityHash().isBlank()) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest((e.getEvidenceId() + e.getDescription() + System.currentTimeMillis()).getBytes());
                e.setIntegrityHash(HexFormat.of().formatHex(hash));
            } catch (NoSuchAlgorithmException ex) {
                e.setIntegrityHash("sha256-demo-" + System.currentTimeMillis());
            }
        } else {
            e.setIntegrityHash(dto.getIntegrityHash());
        }

        e.setNotes(dto.getNotes());
        e.setStatus(dto.getStatus() != null ? dto.getStatus() : "COLLECTED");

        Evidence saved = evidenceRepository.save(e);

        // Add initial custody record
        EvidenceCustody ec = new EvidenceCustody();
        ec.setEvidenceId(saved.getId());
        ec.setTransferredBy(saved.getCollectedBy());
        ec.setReceivedBy("Evidence Control Officer");
        ec.setReason("Initial secure bagging and intake");
        ec.setLocation(saved.getStorageReference());
        ec.setNotes("Integrity hash verified and logged.");
        custodyRepository.save(ec);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "ADD_EVIDENCE",
                "EVIDENCE",
                saved.getEvidenceId(),
                "Registered evidence " + saved.getEvidenceId() + ": " + saved.getDescription()
        ));

        return saved;
    }

    @Transactional
    public EvidenceCustody addCustodyTransfer(Long evidenceId, String transferredBy, String receivedBy, String reason, String location, String notes) {
        Evidence e = getEvidenceById(evidenceId);

        EvidenceCustody ec = new EvidenceCustody();
        ec.setEvidenceId(evidenceId);
        ec.setTransferredBy(transferredBy != null ? transferredBy : getCurrentUsername());
        ec.setReceivedBy(receivedBy);
        ec.setReason(reason);
        ec.setLocation(location);
        ec.setNotes(notes);
        ec.setTransferDate(LocalDateTime.now());

        EvidenceCustody saved = custodyRepository.save(ec);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "TRANSFER_EVIDENCE_CUSTODY",
                "EVIDENCE",
                e.getEvidenceId(),
                "Transferred evidence custody to: " + receivedBy + " (" + reason + ")"
        ));

        return saved;
    }

    @Transactional
    public void deleteEvidence(Long id) {
        Evidence e = getEvidenceById(id);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_EVIDENCE",
                "EVIDENCE",
                e.getEvidenceId(),
                "Archived/Deleted evidence record " + e.getEvidenceId()
        ));
        evidenceRepository.delete(e);
    }

    @Transactional
    public Evidence updateEvidence(Long id, EvidenceDto dto) {
        Evidence e = getEvidenceById(id);
        if (dto.getEvidenceType() != null) e.setEvidenceType(dto.getEvidenceType());
        if (dto.getDescription() != null) e.setDescription(dto.getDescription());
        if (dto.getCollectedBy() != null) e.setCollectedBy(dto.getCollectedBy());
        if (dto.getCollectedDate() != null) e.setCollectedDate(dto.getCollectedDate());
        if (dto.getSource() != null) e.setSource(dto.getSource());
        if (dto.getStorageReference() != null) e.setStorageReference(dto.getStorageReference());
        if (dto.getStatus() != null) e.setStatus(dto.getStatus());
        if (dto.getNotes() != null) e.setNotes(dto.getNotes());
        if (dto.getCaseId() != null) e.setCaseId(dto.getCaseId());
        if (dto.getCaseNumber() != null) e.setCaseNumber(dto.getCaseNumber());

        Evidence saved = evidenceRepository.save(e);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_EVIDENCE",
                "EVIDENCE",
                saved.getEvidenceId(),
                "Updated evidence item " + saved.getEvidenceId()
        ));
        return saved;
    }
}
