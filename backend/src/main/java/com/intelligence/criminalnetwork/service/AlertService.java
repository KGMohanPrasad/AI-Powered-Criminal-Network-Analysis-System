package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.*;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired private IntelligenceAlertRepository alertRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private CaseRepository caseRepository;
    @Autowired private EvidenceRepository evidenceRepository;
    @Autowired private EvidenceCustodyRepository custodyRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private PersonRepository personRepository;
    @Autowired private RelationshipRepository relationshipRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<IntelligenceAlert> getAllAlerts(String status, String level) {
        if (status != null && !status.isBlank()) {
            return alertRepository.findByStatus(status.trim().toUpperCase());
        }
        if (level != null && !level.isBlank()) {
            return alertRepository.findByAlertLevel(level.trim().toUpperCase());
        }
        return alertRepository.findAll();
    }

    @Transactional
    public IntelligenceAlert updateAlertStatus(Long id, String status) {
        IntelligenceAlert a = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with ID: " + id));

        a.setStatus(status);
        IntelligenceAlert saved = alertRepository.save(a);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_ALERT",
                "ALERT",
                saved.getAlertId(),
                "Updated alert " + saved.getAlertId() + " status to " + status
        ));

        return saved;
    }

    @Transactional
    public Map<String, Object> evaluateDatabaseRules() {
        int newAlertsCount = 0;
        List<IntelligenceAlert> existingAlerts = alertRepository.findAll();
        Set<String> existingReasons = existingAlerts.stream()
                .map(IntelligenceAlert::getReason)
                .collect(Collectors.toSet());

        long currentAlertCount = alertRepository.count();

        // Rule 1: Evidence pending review for more than 7 days
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        List<Evidence> pendingEvidence = evidenceRepository.findAll().stream()
                .filter(e -> ("UNDER_REVIEW".equalsIgnoreCase(e.getStatus()) || "COLLECTED".equalsIgnoreCase(e.getStatus())) &&
                             e.getCollectedDate() != null && e.getCollectedDate().isBefore(sevenDaysAgo))
                .collect(Collectors.toList());

        for (Evidence ev : pendingEvidence) {
            String reason = "Database Rule Trigger: Evidence " + ev.getEvidenceId() + " (" + ev.getEvidenceType() + ") has been pending review for over 7 days in case " + ev.getCaseNumber();
            if (!existingReasons.contains(reason)) {
                createRuleAlert(String.format("ALT-RULE-%04d", ++currentAlertCount), "HIGH", ev.getCaseId(), ev.getCaseNumber(),
                        reason, 1, "Rule: Evidence Pending Review > 7d", ev.getCollectedBy() != null ? ev.getCollectedBy() : "Lead Investigator");
                existingReasons.add(reason);
                newAlertsCount++;
            }
        }

        // Rule 2: High priority case not updated recently
        LocalDateTime fiveDaysAgo = LocalDateTime.now().minusDays(5);
        List<CaseEntity> staleHighPriorityCases = caseRepository.findAll().stream()
                .filter(c -> ("HIGH".equalsIgnoreCase(c.getPriority()) || "CRITICAL".equalsIgnoreCase(c.getPriority())) &&
                             !"CLOSED".equalsIgnoreCase(c.getStatus()) && !"ARCHIVED".equalsIgnoreCase(c.getStatus()) &&
                             c.getUpdatedAt() != null && c.getUpdatedAt().isBefore(fiveDaysAgo))
                .collect(Collectors.toList());

        for (CaseEntity c : staleHighPriorityCases) {
            String reason = "Database Rule Trigger: High-priority investigation " + c.getCaseNumber() + " (" + c.getTitle() + ") has no logged updates in over 5 days.";
            if (!existingReasons.contains(reason)) {
                createRuleAlert(String.format("ALT-RULE-%04d", ++currentAlertCount), "CRITICAL", c.getId(), c.getCaseNumber(),
                        reason, 1, "Rule: Stale High-Priority Case", c.getLeadInvestigator());
                existingReasons.add(reason);
                newAlertsCount++;
            }
        }

        // Rule 3: Vehicle linked to multiple active cases
        Map<String, Set<Long>> vehicleCaseLinks = new HashMap<>();
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle v : vehicles) {
            if (v.getCaseId() != null) {
                vehicleCaseLinks.computeIfAbsent(v.getRegistrationNumber(), k -> new HashSet<>()).add(v.getCaseId());
            }
        }
        for (Relationship r : relationshipRepository.findAll()) {
            if ("Vehicle".equalsIgnoreCase(r.getSourceEntityType()) && r.getCaseId() != null) {
                vehicleCaseLinks.computeIfAbsent(r.getSourceEntityId(), k -> new HashSet<>()).add(r.getCaseId());
            }
            if ("Vehicle".equalsIgnoreCase(r.getTargetEntityType()) && r.getCaseId() != null) {
                vehicleCaseLinks.computeIfAbsent(r.getTargetEntityId(), k -> new HashSet<>()).add(r.getCaseId());
            }
        }

        for (Map.Entry<String, Set<Long>> entry : vehicleCaseLinks.entrySet()) {
            if (entry.getValue().size() > 1) {
                String reason = "Database Rule Trigger: Vehicle " + entry.getKey() + " is linked across " + entry.getValue().size() + " separate criminal cases.";
                if (!existingReasons.contains(reason)) {
                    createRuleAlert(String.format("ALT-RULE-%04d", ++currentAlertCount), "HIGH", entry.getValue().iterator().next(), "MULTI-CASE",
                            reason, entry.getValue().size(), "Rule: Multi-Case Vehicle Cross-Link", "Fleet Taskforce");
                    existingReasons.add(reason);
                    newAlertsCount++;
                }
            }
        }

        // Rule 4: Person linked to multiple cases
        Map<String, Set<Long>> personCaseLinks = new HashMap<>();
        for (Relationship r : relationshipRepository.findAll()) {
            if ("Person".equalsIgnoreCase(r.getSourceEntityType()) && r.getCaseId() != null) {
                personCaseLinks.computeIfAbsent(r.getSourceEntityId(), k -> new HashSet<>()).add(r.getCaseId());
            }
            if ("Person".equalsIgnoreCase(r.getTargetEntityType()) && r.getCaseId() != null) {
                personCaseLinks.computeIfAbsent(r.getTargetEntityId(), k -> new HashSet<>()).add(r.getCaseId());
            }
        }
        for (Map.Entry<String, Set<Long>> entry : personCaseLinks.entrySet()) {
            if (entry.getValue().size() >= 3) {
                String reason = "Database Rule Trigger: Subject " + entry.getKey() + " appears in " + entry.getValue().size() + " distinct active case dossiers.";
                if (!existingReasons.contains(reason)) {
                    createRuleAlert(String.format("ALT-RULE-%04d", ++currentAlertCount), "CRITICAL", entry.getValue().iterator().next(), "MULTI-CASE",
                            reason, entry.getValue().size(), "Rule: Multi-Case Cross-Subject Link", "Special Investigations Directorate");
                    existingReasons.add(reason);
                    newAlertsCount++;
                }
            }
        }

        // Rule 5: New unverified relationship added
        List<Relationship> unverifiedRels = relationshipRepository.findAll().stream()
                .filter(r -> "UNDER_REVIEW".equalsIgnoreCase(r.getVerificationStatus()) || "UNVERIFIED".equalsIgnoreCase(r.getVerificationStatus()))
                .limit(5)
                .collect(Collectors.toList());

        for (Relationship r : unverifiedRels) {
            String reason = "Database Rule Trigger: Pending verification for relationship between " + r.getSourceEntityId() + " and " + r.getTargetEntityId() + " (" + r.getRelationshipType() + ").";
            if (!existingReasons.contains(reason)) {
                createRuleAlert(String.format("ALT-RULE-%04d", ++currentAlertCount), "LOW", r.getCaseId(), r.getCaseId() != null ? "CASE-" + r.getCaseId() : "GENERAL",
                        reason, 1, "Rule: Unverified Relational Link", r.getCreatedBy());
                existingReasons.add(reason);
                newAlertsCount++;
            }
        }

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "EVALUATE_DATABASE_RULES",
                "ALERTS",
                "SYSTEM",
                "Evaluated database business rules. Generated " + newAlertsCount + " new alerts."
        ));

        Map<String, Object> response = new HashMap<>();
        response.put("newAlertsCount", newAlertsCount);
        response.put("totalAlerts", alertRepository.count());
        response.put("evaluatedRules", List.of(
                "Evidence Pending Review > 7 Days",
                "High-Priority Case Stagnation > 5 Days",
                "Vehicle Multi-Case Linkage",
                "Subject Multi-Case Linkage (≥3 cases)",
                "Unverified Network Relationships"
        ));
        return response;
    }

    private void createRuleAlert(String alertId, String level, Long caseId, String caseNumber, String reason, int count, String analyticalLevel, String investigator) {
        IntelligenceAlert a = new IntelligenceAlert();
        a.setAlertId(alertId);
        a.setAlertLevel(level);
        a.setCaseId(caseId);
        a.setCaseNumber(caseNumber);
        a.setReason(reason);
        a.setSupportingRecordsCount(count);
        a.setAnalyticalLevel(analyticalLevel);
        a.setStatus("NEW");
        a.setAssignedInvestigator(investigator != null ? investigator : "Unassigned");
        alertRepository.save(a);
    }
}
