package com.intelligence.criminalnetwork.dto;

import java.util.ArrayList;
import java.util.List;

public class NetworkGraphDto {
    private List<GraphNodeDto> nodes = new ArrayList<>();
    private List<GraphEdgeDto> edges = new ArrayList<>();
    private int totalNodes = 0;
    private int totalEdges = 0;
    private String networkDisclaimer = "AI-generated analytical indicators are decision-support information only. They are not proof of criminal activity and require human verification.";

    public NetworkGraphDto() {}

    public NetworkGraphDto(List<GraphNodeDto> nodes, List<GraphEdgeDto> edges) {
        this.nodes = nodes;
        this.edges = edges;
        this.totalNodes = nodes != null ? nodes.size() : 0;
        this.totalEdges = edges != null ? edges.size() : 0;
    }

    public List<GraphNodeDto> getNodes() { return nodes; }
    public void setNodes(List<GraphNodeDto> nodes) {
        this.nodes = nodes;
        this.totalNodes = nodes != null ? nodes.size() : 0;
    }

    public List<GraphEdgeDto> getEdges() { return edges; }
    public void setEdges(List<GraphEdgeDto> edges) {
        this.edges = edges;
        this.totalEdges = edges != null ? edges.size() : 0;
    }

    public int getTotalNodes() { return totalNodes; }
    public void setTotalNodes(int totalNodes) { this.totalNodes = totalNodes; }

    public int getTotalEdges() { return totalEdges; }
    public void setTotalEdges(int totalEdges) { this.totalEdges = totalEdges; }

    public String getNetworkDisclaimer() { return networkDisclaimer; }
    public void setNetworkDisclaimer(String networkDisclaimer) { this.networkDisclaimer = networkDisclaimer; }
}
