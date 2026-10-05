package com.intelligence.criminalnetwork.dto;

import java.util.ArrayList;
import java.util.List;

public class AiAnalysisResultDto {
    private String caseNumber;
    private String analysisTimestamp;
    private String disclaimer = "AI-generated analytical indicators are decision-support information only. They are not proof of criminal activity and require human verification.";
    
    // Core Explainable Findings
    private List<ExplainableFinding> findings = new ArrayList<>();
    private List<CentralityMetricsDto> centralityRankings = new ArrayList<>();
    private List<AnomalyDto> detectedAnomalies = new ArrayList<>();
    private List<CaseSimilarityDto> similarCases = new ArrayList<>();

    public static class ExplainableFinding {
        private String finding;
        private String reason;
        private int supportingRecords;
        private int analyticalScore; // 0-100
        private String limitations = "Connectivity does not establish involvement in criminal activity.";
        private String humanReviewStatus = "Required";
        private String entityId;
        private String entityName;

        public ExplainableFinding() {}

        public ExplainableFinding(String finding, String reason, int supportingRecords, int analyticalScore, String limitations, String humanReviewStatus, String entityId, String entityName) {
            this.finding = finding;
            this.reason = reason;
            this.supportingRecords = supportingRecords;
            this.analyticalScore = analyticalScore;
            this.limitations = limitations;
            this.humanReviewStatus = humanReviewStatus;
            this.entityId = entityId;
            this.entityName = entityName;
        }

        public String getFinding() { return finding; }
        public void setFinding(String finding) { this.finding = finding; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public int getSupportingRecords() { return supportingRecords; }
        public void setSupportingRecords(int supportingRecords) { this.supportingRecords = supportingRecords; }

        public int getAnalyticalScore() { return analyticalScore; }
        public void setAnalyticalScore(int analyticalScore) { this.analyticalScore = analyticalScore; }

        public String getLimitations() { return limitations; }
        public void setLimitations(String limitations) { this.limitations = limitations; }

        public String getHumanReviewStatus() { return humanReviewStatus; }
        public void setHumanReviewStatus(String humanReviewStatus) { this.humanReviewStatus = humanReviewStatus; }

        public String getEntityId() { return entityId; }
        public void setEntityId(String entityId) { this.entityId = entityId; }

        public String getEntityName() { return entityName; }
        public void setEntityName(String entityName) { this.entityName = entityName; }
    }

    public AiAnalysisResultDto() {}

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getAnalysisTimestamp() { return analysisTimestamp; }
    public void setAnalysisTimestamp(String analysisTimestamp) { this.analysisTimestamp = analysisTimestamp; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public List<ExplainableFinding> getFindings() { return findings; }
    public void setFindings(List<ExplainableFinding> findings) { this.findings = findings; }

    public List<CentralityMetricsDto> getCentralityRankings() { return centralityRankings; }
    public void setCentralityRankings(List<CentralityMetricsDto> centralityRankings) { this.centralityRankings = centralityRankings; }

    public List<AnomalyDto> getDetectedAnomalies() { return detectedAnomalies; }
    public void setDetectedAnomalies(List<AnomalyDto> detectedAnomalies) { this.detectedAnomalies = detectedAnomalies; }

    public List<CaseSimilarityDto> getSimilarCases() { return similarCases; }
    public void setSimilarCases(List<CaseSimilarityDto> similarCases) { this.similarCases = similarCases; }
}
