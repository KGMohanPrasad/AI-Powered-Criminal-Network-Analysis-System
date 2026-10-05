package com.intelligence.criminalnetwork.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    // 10 Key KPI Metrics (Section 2)
    private long activeCases;
    private long openInvestigations;
    private long personsOfInterest;
    private long evidenceRecords;
    private long networkConnections;
    private long recentIncidents;
    private long highPriorityCases;
    private long pendingEvidenceReview;
    private long closedCases;
    private long investigators;

    // Backward-compatible trends & metrics
    private String activeCasesTrend = "+8 this month";
    private String personsTrend = "+17 recently added";
    private long highConnectivityEntities;
    private long aiAlerts;
    private long aiAlertsRequireReview;
    private long casesClosedThisMonth;
    private String avgResolutionTime = "24.5 Days";

    // 10 Analytics Charts (Section 3) - strictly REAL database values
    private List<Map<String, Object>> casesByStatus;
    private List<Map<String, Object>> casesByPriority;
    private List<Map<String, Object>> crimeCategories;
    private List<Map<String, Object>> casesCreatedByMonth;
    private List<Map<String, Object>> casesClosedByMonth;
    private List<Map<String, Object>> evidenceDistribution;
    private List<Map<String, Object>> incidentTrends;
    private List<Map<String, Object>> organizationConnections;
    private List<Map<String, Object>> vehicleInvolvement;
    private List<Map<String, Object>> investigationWorkload;

    // Additional database analytical metrics
    private List<Map<String, Object>> topConnectedEntities;
    private List<Map<String, Object>> incidentsByMonth;
    private List<Map<String, Object>> crimeCategoryDistribution;
    private List<Map<String, Object>> evidenceTypes;
    private List<Map<String, Object>> organizationActivity;

    public DashboardSummaryDto() {}

    // Getters and Setters for 10 KPIs
    public long getActiveCases() { return activeCases; }
    public void setActiveCases(long activeCases) { this.activeCases = activeCases; }

    public long getOpenInvestigations() { return openInvestigations; }
    public void setOpenInvestigations(long openInvestigations) { this.openInvestigations = openInvestigations; }

    public long getPersonsOfInterest() { return personsOfInterest; }
    public void setPersonsOfInterest(long personsOfInterest) { this.personsOfInterest = personsOfInterest; }

    public long getEvidenceRecords() { return evidenceRecords; }
    public void setEvidenceRecords(long evidenceRecords) { this.evidenceRecords = evidenceRecords; }

    public long getNetworkConnections() { return networkConnections; }
    public void setNetworkConnections(long networkConnections) { this.networkConnections = networkConnections; }

    public long getRecentIncidents() { return recentIncidents; }
    public void setRecentIncidents(long recentIncidents) { this.recentIncidents = recentIncidents; }

    public long getHighPriorityCases() { return highPriorityCases; }
    public void setHighPriorityCases(long highPriorityCases) { this.highPriorityCases = highPriorityCases; }

    public long getPendingEvidenceReview() { return pendingEvidenceReview; }
    public void setPendingEvidenceReview(long pendingEvidenceReview) { this.pendingEvidenceReview = pendingEvidenceReview; }

    public long getClosedCases() { return closedCases; }
    public void setClosedCases(long closedCases) { this.closedCases = closedCases; }

    public long getInvestigators() { return investigators; }
    public void setInvestigators(long investigators) { this.investigators = investigators; }

    // Backward compatibility
    public String getActiveCasesTrend() { return activeCasesTrend; }
    public void setActiveCasesTrend(String activeCasesTrend) { this.activeCasesTrend = activeCasesTrend; }

    public String getPersonsTrend() { return personsTrend; }
    public void setPersonsTrend(String personsTrend) { this.personsTrend = personsTrend; }

    public long getHighConnectivityEntities() { return highConnectivityEntities; }
    public void setHighConnectivityEntities(long highConnectivityEntities) { this.highConnectivityEntities = highConnectivityEntities; }

    public long getAiAlerts() { return aiAlerts; }
    public void setAiAlerts(long aiAlerts) { this.aiAlerts = aiAlerts; }

    public long getAiAlertsRequireReview() { return aiAlertsRequireReview; }
    public void setAiAlertsRequireReview(long aiAlertsRequireReview) { this.aiAlertsRequireReview = aiAlertsRequireReview; }

    public long getCasesClosedThisMonth() { return casesClosedThisMonth; }
    public void setCasesClosedThisMonth(long casesClosedThisMonth) { this.casesClosedThisMonth = casesClosedThisMonth; }

    public String getAvgResolutionTime() { return avgResolutionTime; }
    public void setAvgResolutionTime(String avgResolutionTime) { this.avgResolutionTime = avgResolutionTime; }

    // 10 Chart Getters & Setters
    public List<Map<String, Object>> getCasesByStatus() { return casesByStatus; }
    public void setCasesByStatus(List<Map<String, Object>> casesByStatus) { this.casesByStatus = casesByStatus; }

    public List<Map<String, Object>> getCasesByPriority() { return casesByPriority; }
    public void setCasesByPriority(List<Map<String, Object>> casesByPriority) { this.casesByPriority = casesByPriority; }

    public List<Map<String, Object>> getCrimeCategories() { return crimeCategories; }
    public void setCrimeCategories(List<Map<String, Object>> crimeCategories) { this.crimeCategories = crimeCategories; }

    public List<Map<String, Object>> getCasesCreatedByMonth() { return casesCreatedByMonth; }
    public void setCasesCreatedByMonth(List<Map<String, Object>> casesCreatedByMonth) { this.casesCreatedByMonth = casesCreatedByMonth; }

    public List<Map<String, Object>> getCasesClosedByMonth() { return casesClosedByMonth; }
    public void setCasesClosedByMonth(List<Map<String, Object>> casesClosedByMonth) { this.casesClosedByMonth = casesClosedByMonth; }

    public List<Map<String, Object>> getEvidenceDistribution() { return evidenceDistribution; }
    public void setEvidenceDistribution(List<Map<String, Object>> evidenceDistribution) { this.evidenceDistribution = evidenceDistribution; }

    public List<Map<String, Object>> getIncidentTrends() { return incidentTrends; }
    public void setIncidentTrends(List<Map<String, Object>> incidentTrends) { this.incidentTrends = incidentTrends; }

    public List<Map<String, Object>> getOrganizationConnections() { return organizationConnections; }
    public void setOrganizationConnections(List<Map<String, Object>> organizationConnections) { this.organizationConnections = organizationConnections; }

    public List<Map<String, Object>> getVehicleInvolvement() { return vehicleInvolvement; }
    public void setVehicleInvolvement(List<Map<String, Object>> vehicleInvolvement) { this.vehicleInvolvement = vehicleInvolvement; }

    public List<Map<String, Object>> getInvestigationWorkload() { return investigationWorkload; }
    public void setInvestigationWorkload(List<Map<String, Object>> investigationWorkload) { this.investigationWorkload = investigationWorkload; }

    public List<Map<String, Object>> getTopConnectedEntities() { return topConnectedEntities; }
    public void setTopConnectedEntities(List<Map<String, Object>> topConnectedEntities) { this.topConnectedEntities = topConnectedEntities; }

    public List<Map<String, Object>> getIncidentsByMonth() { return incidentsByMonth; }
    public void setIncidentsByMonth(List<Map<String, Object>> incidentsByMonth) { this.incidentsByMonth = incidentsByMonth; }

    public List<Map<String, Object>> getCrimeCategoryDistribution() { return crimeCategoryDistribution; }
    public void setCrimeCategoryDistribution(List<Map<String, Object>> crimeCategoryDistribution) { this.crimeCategoryDistribution = crimeCategoryDistribution; }

    public List<Map<String, Object>> getEvidenceTypes() { return evidenceTypes; }
    public void setEvidenceTypes(List<Map<String, Object>> evidenceTypes) { this.evidenceTypes = evidenceTypes; }

    public List<Map<String, Object>> getOrganizationActivity() { return organizationActivity; }
    public void setOrganizationActivity(List<Map<String, Object>> organizationActivity) { this.organizationActivity = organizationActivity; }
}
