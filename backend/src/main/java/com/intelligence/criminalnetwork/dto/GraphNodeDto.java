package com.intelligence.criminalnetwork.dto;

import java.util.HashMap;
import java.util.Map;

public class GraphNodeDto {
    private String id;
    private String label;
    private String entityType; // Person, Organization, Vehicle, Phone, Location, Case, Incident, Evidence
    private String subLabel;
    private String riskLevel;
    private String status;
    private int degree = 0;
    private double centrality = 0.0;
    private int community = 0;
    private Map<String, Object> details = new HashMap<>();

    public GraphNodeDto() {}

    public GraphNodeDto(String id, String label, String entityType, String subLabel, String riskLevel, String status) {
        this.id = id;
        this.label = label;
        this.entityType = entityType;
        this.subLabel = subLabel;
        this.riskLevel = riskLevel;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getSubLabel() { return subLabel; }
    public void setSubLabel(String subLabel) { this.subLabel = subLabel; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getDegree() { return degree; }
    public void setDegree(int degree) { this.degree = degree; }

    public double getCentrality() { return centrality; }
    public void setCentrality(double centrality) { this.centrality = centrality; }

    public int getCommunity() { return community; }
    public void setCommunity(int community) { this.community = community; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}
