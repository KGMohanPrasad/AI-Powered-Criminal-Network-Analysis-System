package com.intelligence.criminalnetwork.dto;

import java.util.List;

public class AnomalyDto {
    private String anomalyId;
    private String title;
    private String anomalyType; // COMMUNICATION_BURST, NEW_BRIDGE_LINK, UNEXPECTED_ORG_LINK, REPEATED_LOCATION_OVERLAP
    private String description;
    private int severityScore; // 0 - 100
    private String involvedEntity;
    private List<String> evidenceSignals;
    private String explanation;

    public AnomalyDto() {}

    public AnomalyDto(String anomalyId, String title, String anomalyType, String description, int severityScore, String involvedEntity, List<String> evidenceSignals, String explanation) {
        this.anomalyId = anomalyId;
        this.title = title;
        this.anomalyType = anomalyType;
        this.description = description;
        this.severityScore = severityScore;
        this.involvedEntity = involvedEntity;
        this.evidenceSignals = evidenceSignals;
        this.explanation = explanation;
    }

    public String getAnomalyId() { return anomalyId; }
    public void setAnomalyId(String anomalyId) { this.anomalyId = anomalyId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAnomalyType() { return anomalyType; }
    public void setAnomalyType(String anomalyType) { this.anomalyType = anomalyType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getSeverityScore() { return severityScore; }
    public void setSeverityScore(int severityScore) { this.severityScore = severityScore; }

    public String getInvolvedEntity() { return involvedEntity; }
    public void setInvolvedEntity(String involvedEntity) { this.involvedEntity = involvedEntity; }

    public List<String> getEvidenceSignals() { return evidenceSignals; }
    public void setEvidenceSignals(List<String> evidenceSignals) { this.evidenceSignals = evidenceSignals; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
