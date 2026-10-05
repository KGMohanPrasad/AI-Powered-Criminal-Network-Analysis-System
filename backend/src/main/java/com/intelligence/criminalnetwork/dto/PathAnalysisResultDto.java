package com.intelligence.criminalnetwork.dto;

import java.util.List;
import java.util.Map;

public class PathAnalysisResultDto {
    private String sourceId;
    private String sourceName;
    private String sourceType;
    private String targetId;
    private String targetName;
    private String targetType;
    private boolean found;
    private int hops;
    private List<String> pathNodeIds;
    private List<Map<String, Object>> pathNodes;
    private List<Map<String, Object>> pathEdges;
    private List<Map<String, Object>> associatedCases;
    private String explanation;

    public PathAnalysisResultDto() {}

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public String getTargetName() { return targetName; }
    public void setTargetName(String targetName) { this.targetName = targetName; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public boolean isFound() { return found; }
    public void setFound(boolean found) { this.found = found; }

    public int getHops() { return hops; }
    public void setHops(int hops) { this.hops = hops; }

    public List<String> getPathNodeIds() { return pathNodeIds; }
    public void setPathNodeIds(List<String> pathNodeIds) { this.pathNodeIds = pathNodeIds; }

    public List<Map<String, Object>> getPathNodes() { return pathNodes; }
    public void setPathNodes(List<Map<String, Object>> pathNodes) { this.pathNodes = pathNodes; }

    public List<Map<String, Object>> getPathEdges() { return pathEdges; }
    public void setPathEdges(List<Map<String, Object>> pathEdges) { this.pathEdges = pathEdges; }

    public List<Map<String, Object>> getAssociatedCases() { return associatedCases; }
    public void setAssociatedCases(List<Map<String, Object>> associatedCases) { this.associatedCases = associatedCases; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
