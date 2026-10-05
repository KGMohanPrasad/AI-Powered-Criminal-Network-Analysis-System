package com.intelligence.criminalnetwork.dto;

import java.time.LocalDate;

public class GraphEdgeDto {
    private String id;
    private String source;
    private String target;
    private String label; // ASSOCIATED_WITH, CONTACTED, etc.
    private int strength = 50; // 0-100
    private String verificationStatus; // VERIFIED, UNDER_REVIEW, UNVERIFIED, REJECTED
    private String description;
    private LocalDate firstObserved;
    private LocalDate lastObserved;
    private Long caseId;
    private String sourceReference;
    private int evidenceReferences = 0;

    public GraphEdgeDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public int getStrength() { return strength; }
    public void setStrength(int strength) { this.strength = strength; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getFirstObserved() { return firstObserved; }
    public void setFirstObserved(LocalDate firstObserved) { this.firstObserved = firstObserved; }

    public LocalDate getLastObserved() { return lastObserved; }
    public void setLastObserved(LocalDate lastObserved) { this.lastObserved = lastObserved; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getSourceReference() { return sourceReference; }
    public void setSourceReference(String sourceReference) { this.sourceReference = sourceReference; }

    public int getEvidenceReferences() { return evidenceReferences; }
    public void setEvidenceReferences(int evidenceReferences) { this.evidenceReferences = evidenceReferences; }
}
