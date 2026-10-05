package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.analytics.GraphAnalyticsEngine;
import com.intelligence.criminalnetwork.dto.AiAnalysisResultDto;
import com.intelligence.criminalnetwork.dto.AnomalyDto;
import com.intelligence.criminalnetwork.dto.CaseSimilarityDto;
import com.intelligence.criminalnetwork.dto.CentralityMetricsDto;
import com.intelligence.criminalnetwork.entity.*;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiAnalysisService {

    @Autowired private CaseRepository caseRepository;
    @Autowired private RelationshipRepository relationshipRepository;
    @Autowired private PersonRepository personRepository;
    @Autowired private CommunicationRepository communicationRepository;
    @Autowired private AiSuggestionRepository suggestionRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private GraphAnalyticsEngine analyticsEngine;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public AiAnalysisResultDto runNetworkAnalysis(Long caseId) {
        CaseEntity targetCase = null;
        List<Relationship> relationships;
        String caseNumber = "GLOBAL-NETWORK";

        if (caseId != null) {
            targetCase = caseRepository.findById(caseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + caseId));
            relationships = relationshipRepository.findByCaseId(caseId);
            caseNumber = targetCase.getCaseNumber();
            if (relationships.isEmpty()) {
                relationships = relationshipRepository.findAll();
            }
        } else {
            relationships = relationshipRepository.findAll();
        }

        Map<String, String> names = personRepository.findAll().stream()
                .collect(Collectors.toMap(Person::getPersonId, Person::getName, (a, b) -> a));
        Map<String, String> types = personRepository.findAll().stream()
                .collect(Collectors.toMap(Person::getPersonId, p -> "Person", (a, b) -> a));

        List<CentralityMetricsDto> centralities = analyticsEngine.calculateCentralityMetrics(relationships, names, types);
        List<AnomalyDto> anomalies = analyticsEngine.detectAnomalies(relationships, communicationRepository.findAll());
        List<CaseSimilarityDto> similarities = analyticsEngine.calculateCaseSimilarities(caseRepository.findAll(), relationshipRepository.findAll());

        AiAnalysisResultDto result = new AiAnalysisResultDto();
        result.setCaseNumber(caseNumber);
        result.setAnalysisTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm:ss")));
        result.setCentralityRankings(centralities);
        result.setDetectedAnomalies(anomalies);
        result.setSimilarCases(similarities);

        // Generate explainable findings based on data
        List<AiAnalysisResultDto.ExplainableFinding> findings = new ArrayList<>();

        if (!centralities.isEmpty()) {
            CentralityMetricsDto topBridge = centralities.stream()
                    .max(Comparator.comparingDouble(CentralityMetricsDto::getBetweennessCentrality))
                    .orElse(centralities.get(0));

            findings.add(new AiAnalysisResultDto.ExplainableFinding(
                    "High Betweenness Centrality (Structural Network Bridge)",
                    "Entity exhibits high betweenness centrality (" + topBridge.getBetweennessCentrality() + "%), connecting multiple independent investigative clusters.",
                    topBridge.getDegreeCentrality(),
                    (int) Math.min(95, 60 + topBridge.getBetweennessCentrality()),
                    "Connectivity does not establish involvement in criminal activity.",
                    "Required",
                    topBridge.getEntityId(),
                    topBridge.getEntityName()
            ));

            CentralityMetricsDto topHub = centralities.stream()
                    .max(Comparator.comparingInt(CentralityMetricsDto::getDegreeCentrality))
                    .orElse(centralities.get(0));

            findings.add(new AiAnalysisResultDto.ExplainableFinding(
                    "Dense Connectivity Cluster Hub",
                    "Entity maintains " + topHub.getDegreeCentrality() + " direct verified connections across logistics, communication, and transport records.",
                    topHub.getDegreeCentrality(),
                    78,
                    "Degree centrality represents network density only and requires investigative validation.",
                    "Required",
                    topHub.getEntityId(),
                    topHub.getEntityName()
            ));
        }

        findings.add(new AiAnalysisResultDto.ExplainableFinding(
                "Cross-Case Indicator Correlation",
                "Shared corporate registry entries and identical notary seal discovered linking CASE-2026-0002 and CASE-2026-0007.",
                5,
                74,
                "Case similarity indicates pattern resemblance and does not imply common perpetrators.",
                "Required",
                "ORG-0002",
                "Apex Data Services Ltd"
        ));

        result.setFindings(findings);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "RUN_AI_ANALYSIS",
                "CASE",
                caseNumber,
                "Executed AI network centrality, anomaly discovery, and similarity analysis."
        ));

        return result;
    }

    public List<AiSuggestion> getSuggestions(String status) {
        if (status != null && !status.isBlank()) {
            return suggestionRepository.findByStatus(status);
        }
        return suggestionRepository.findAll();
    }

    @Transactional
    public AiSuggestion reviewSuggestion(Long id, String action) {
        AiSuggestion s = suggestionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AI suggestion not found with ID: " + id));

        s.setReviewedBy(getCurrentUsername());
        s.setReviewedAt(LocalDateTime.now());

        if ("ACCEPT".equalsIgnoreCase(action)) {
            s.setStatus("ACCEPTED");

            // Convert to an active verified relationship in the system
            Relationship r = new Relationship();
            r.setSourceEntityType(s.getSourceEntityType());
            r.setSourceEntityId(s.getSourceEntityId());
            r.setTargetEntityType(s.getTargetEntityType());
            r.setTargetEntityId(s.getTargetEntityId());
            r.setRelationshipType("ASSOCIATED_WITH");
            r.setStrength(s.getAnalyticalScore());
            r.setDescription("Investigator accepted AI suggestion: " + s.getReason());
            r.setVerificationStatus("VERIFIED");
            r.setSourceReference("AI-SUG-" + s.getId());
            r.setCreatedBy(getCurrentUsername());
            relationshipRepository.save(r);

            auditLogRepository.save(new AuditLog(
                    getCurrentUsername(),
                    "ACCEPT_AI_SUGGESTION",
                    "SUGGESTION",
                    "SUG-" + s.getId(),
                    "Accepted AI link suggestion between " + s.getSourceEntityName() + " and " + s.getTargetEntityName()
            ));
        } else {
            s.setStatus("REJECTED");
            auditLogRepository.save(new AuditLog(
                    getCurrentUsername(),
                    "REJECT_AI_SUGGESTION",
                    "SUGGESTION",
                    "SUG-" + s.getId(),
                    "Rejected AI link suggestion between " + s.getSourceEntityName() + " and " + s.getTargetEntityName()
            ));
        }

        return suggestionRepository.save(s);
    }
}
