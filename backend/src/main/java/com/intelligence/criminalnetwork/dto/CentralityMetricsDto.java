package com.intelligence.criminalnetwork.dto;

public class CentralityMetricsDto {
    private String entityId;
    private String entityName;
    private String entityType;
    private int degreeCentrality;
    private double betweennessCentrality;
    private double closenessCentrality;
    private int communityCluster;
    private String structuralRole; // e.g. "Network Hub", "Cluster Bridge", "Peripheral Node"

    public CentralityMetricsDto() {}

    public CentralityMetricsDto(String entityId, String entityName, String entityType, int degreeCentrality, double betweennessCentrality, double closenessCentrality, int communityCluster, String structuralRole) {
        this.entityId = entityId;
        this.entityName = entityName;
        this.entityType = entityType;
        this.degreeCentrality = degreeCentrality;
        this.betweennessCentrality = betweennessCentrality;
        this.closenessCentrality = closenessCentrality;
        this.communityCluster = communityCluster;
        this.structuralRole = structuralRole;
    }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public int getDegreeCentrality() { return degreeCentrality; }
    public void setDegreeCentrality(int degreeCentrality) { this.degreeCentrality = degreeCentrality; }

    public double getBetweennessCentrality() { return betweennessCentrality; }
    public void setBetweennessCentrality(double betweennessCentrality) { this.betweennessCentrality = betweennessCentrality; }

    public double getClosenessCentrality() { return closenessCentrality; }
    public void setClosenessCentrality(double closenessCentrality) { this.closenessCentrality = closenessCentrality; }

    public int getCommunityCluster() { return communityCluster; }
    public void setCommunityCluster(int communityCluster) { this.communityCluster = communityCluster; }

    public String getStructuralRole() { return structuralRole; }
    public void setStructuralRole(String structuralRole) { this.structuralRole = structuralRole; }
}
