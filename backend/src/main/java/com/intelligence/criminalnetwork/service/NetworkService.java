package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.analytics.GraphAnalyticsEngine;
import com.intelligence.criminalnetwork.dto.CentralityMetricsDto;
import com.intelligence.criminalnetwork.dto.GraphEdgeDto;
import com.intelligence.criminalnetwork.dto.GraphNodeDto;
import com.intelligence.criminalnetwork.dto.NetworkGraphDto;
import com.intelligence.criminalnetwork.dto.PathAnalysisResultDto;
import com.intelligence.criminalnetwork.dto.RelationshipDto;
import com.intelligence.criminalnetwork.entity.*;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NetworkService {

    @Autowired private RelationshipRepository relationshipRepository;
    @Autowired private PersonRepository personRepository;
    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private CaseRepository caseRepository;
    @Autowired private IncidentRepository incidentRepository;
    @Autowired private EvidenceRepository evidenceRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private GraphAnalyticsEngine analyticsEngine;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public NetworkGraphDto getCompleteNetwork() {
        List<Relationship> relationships = relationshipRepository.findAll();
        return buildGraph(relationships);
    }

    public NetworkGraphDto getNetworkByCase(Long caseId) {
        List<Relationship> relationships = relationshipRepository.findByCaseId(caseId);
        return buildGraph(relationships);
    }

    public NetworkGraphDto getNetworkByPerson(String personId) {
        List<Relationship> relationships = relationshipRepository.findConnectedToEntity(personId);
        
        // Also expand 1 hop to get neighbors' relationships
        Set<String> neighborIds = new HashSet<>();
        neighborIds.add(personId);
        for (Relationship r : relationships) {
            neighborIds.add(r.getSourceEntityId());
            neighborIds.add(r.getTargetEntityId());
        }

        Set<Relationship> expanded = new HashSet<>(relationships);
        for (String nid : neighborIds) {
            expanded.addAll(relationshipRepository.findConnectedToEntity(nid));
        }

        return buildGraph(new ArrayList<>(expanded));
    }

    private NetworkGraphDto buildGraph(List<Relationship> relationships) {
        Map<String, GraphNodeDto> nodeMap = new HashMap<>();
        List<GraphEdgeDto> edges = new ArrayList<>();

        // Lookup maps for entities
        Map<String, Person> persons = personRepository.findAll().stream()
                .collect(Collectors.toMap(Person::getPersonId, p -> p, (a, b) -> a));

        Map<String, Organization> orgs = organizationRepository.findAll().stream()
                .collect(Collectors.toMap(Organization::getOrganizationId, o -> o, (a, b) -> a));

        Map<String, Vehicle> vehs = vehicleRepository.findAll().stream()
                .collect(Collectors.toMap(Vehicle::getVehicleId, v -> v, (a, b) -> a));

        Map<String, CaseEntity> cases = caseRepository.findAll().stream()
                .collect(Collectors.toMap(CaseEntity::getCaseNumber, c -> c, (a, b) -> a));

        Map<String, Incident> incs = incidentRepository.findAll().stream()
                .collect(Collectors.toMap(Incident::getIncidentId, i -> i, (a, b) -> a));

        Map<String, Evidence> evids = evidenceRepository.findAll().stream()
                .collect(Collectors.toMap(Evidence::getEvidenceId, e -> e, (a, b) -> a));

        // Create Nodes from entities present in relationships
        for (Relationship r : relationships) {
            ensureNodeExists(nodeMap, r.getSourceEntityType(), r.getSourceEntityId(), persons, orgs, vehs, cases, incs, evids);
            ensureNodeExists(nodeMap, r.getTargetEntityType(), r.getTargetEntityId(), persons, orgs, vehs, cases, incs, evids);

            GraphEdgeDto edge = new GraphEdgeDto();
            edge.setId("rel-" + r.getId());
            edge.setSource(r.getSourceEntityId());
            edge.setTarget(r.getTargetEntityId());
            edge.setLabel(r.getRelationshipType());
            edge.setStrength(r.getStrength());
            edge.setVerificationStatus(r.getVerificationStatus());
            edge.setDescription(r.getDescription());
            edge.setFirstObserved(r.getFirstObserved());
            edge.setLastObserved(r.getLastObserved());
            edge.setCaseId(r.getCaseId());
            edge.setSourceReference(r.getSourceReference());
            edge.setEvidenceReferences(r.getSourceReference() != null ? 3 : 1);
            edges.add(edge);
        }

        // Calculate and apply Centrality metrics
        Map<String, String> entityNames = new HashMap<>();
        Map<String, String> entityTypes = new HashMap<>();
        nodeMap.values().forEach(n -> {
            entityNames.put(n.getId(), n.getLabel());
            entityTypes.put(n.getId(), n.getEntityType());
        });

        List<CentralityMetricsDto> centralities = analyticsEngine.calculateCentralityMetrics(relationships, entityNames, entityTypes);
        for (CentralityMetricsDto cm : centralities) {
            GraphNodeDto gn = nodeMap.get(cm.getEntityId());
            if (gn != null) {
                gn.setDegree(cm.getDegreeCentrality());
                gn.setCentrality(cm.getBetweennessCentrality());
                gn.setCommunity(cm.getCommunityCluster());
            }
        }

        return new NetworkGraphDto(new ArrayList<>(nodeMap.values()), edges);
    }

    private void ensureNodeExists(
            Map<String, GraphNodeDto> nodeMap,
            String type,
            String id,
            Map<String, Person> persons,
            Map<String, Organization> orgs,
            Map<String, Vehicle> vehs,
            Map<String, CaseEntity> cases,
            Map<String, Incident> incs,
            Map<String, Evidence> evids) {

        if (nodeMap.containsKey(id)) return;

        GraphNodeDto node = new GraphNodeDto();
        node.setId(id);
        node.setEntityType(type != null ? type : "Entity");

        if ("Person".equalsIgnoreCase(type) && persons.containsKey(id)) {
            Person p = persons.get(id);
            node.setLabel(p.getName());
            node.setSubLabel(p.getAlias() != null ? p.getAlias() : p.getOccupation());
            node.setRiskLevel(p.getRiskLevel());
            node.setStatus(p.getStatus());
            node.getDetails().put("age", p.getAge());
            node.getDetails().put("gender", p.getGender());
            node.getDetails().put("location", p.getPrimaryLocation());
            node.getDetails().put("notes", p.getNotes());
        } else if ("Organization".equalsIgnoreCase(type) && orgs.containsKey(id)) {
            Organization o = orgs.get(id);
            node.setLabel(o.getName());
            node.setSubLabel(o.getOrgType());
            node.setStatus(o.getStatus());
            node.setRiskLevel("MEDIUM");
            node.getDetails().put("location", o.getLocation());
            node.getDetails().put("description", o.getDescription());
        } else if ("Vehicle".equalsIgnoreCase(type) && vehs.containsKey(id)) {
            Vehicle v = vehs.get(id);
            node.setLabel(v.getRegistrationNumber());
            node.setSubLabel(v.getBrand() + " " + v.getModel());
            node.setStatus("REGISTERED");
            node.setRiskLevel("MEDIUM");
            node.getDetails().put("owner", v.getOwnerName());
            node.getDetails().put("location", v.getLastKnownLocation());
        } else if ("Case".equalsIgnoreCase(type) && cases.containsKey(id)) {
            CaseEntity c = cases.get(id);
            node.setLabel(c.getCaseNumber());
            node.setSubLabel(c.getTitle());
            node.setStatus(c.getStatus());
            node.setRiskLevel(c.getPriority());
            node.getDetails().put("lead", c.getLeadInvestigator());
        } else if ("Incident".equalsIgnoreCase(type) && incs.containsKey(id)) {
            Incident inc = incs.get(id);
            node.setLabel(inc.getIncidentId());
            node.setSubLabel(inc.getIncidentType());
            node.setStatus(inc.getStatus());
            node.setRiskLevel("HIGH");
            node.getDetails().put("location", inc.getLocation());
        } else if ("Evidence".equalsIgnoreCase(type) && evids.containsKey(id)) {
            Evidence ev = evids.get(id);
            node.setLabel(ev.getEvidenceId());
            node.setSubLabel(ev.getEvidenceType());
            node.setStatus(ev.getStatus());
            node.setRiskLevel("INFO");
        } else {
            // Location, Phone, or fallback
            node.setLabel(id);
            node.setSubLabel(type);
            node.setStatus("ACTIVE");
            node.setRiskLevel("MEDIUM");
        }

        nodeMap.put(id, node);
    }

    @Transactional
    public Relationship createRelationship(RelationshipDto dto) {
        Relationship r = new Relationship();
        r.setSourceEntityType(dto.getSourceEntityType());
        r.setSourceEntityId(dto.getSourceEntityId());
        r.setTargetEntityType(dto.getTargetEntityType());
        r.setTargetEntityId(dto.getTargetEntityId());
        r.setRelationshipType(dto.getRelationshipType());
        r.setStrength(dto.getStrength() != null ? dto.getStrength() : 50);
        r.setDescription(dto.getDescription());
        r.setFirstObserved(dto.getFirstObserved());
        r.setLastObserved(dto.getLastObserved());
        r.setCaseId(dto.getCaseId());
        r.setSourceReference(dto.getSourceReference());
        r.setVerificationStatus(dto.getVerificationStatus() != null ? dto.getVerificationStatus() : "UNDER_REVIEW");
        r.setCreatedBy(getCurrentUsername());

        Relationship saved = relationshipRepository.save(r);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_RELATIONSHIP",
                "RELATIONSHIP",
                "rel-" + saved.getId(),
                "Created relationship " + saved.getSourceEntityId() + " -> " + saved.getTargetEntityId() + " (" + saved.getRelationshipType() + ")"
        ));

        return saved;
    }

    @Transactional
    public Relationship updateRelationship(Long id, RelationshipDto dto) {
        Relationship r = relationshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found with ID: " + id));

        r.setRelationshipType(dto.getRelationshipType());
        r.setStrength(dto.getStrength());
        r.setDescription(dto.getDescription());
        r.setVerificationStatus(dto.getVerificationStatus());
        r.setSourceReference(dto.getSourceReference());

        Relationship saved = relationshipRepository.save(r);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_RELATIONSHIP",
                "RELATIONSHIP",
                "rel-" + saved.getId(),
                "Updated relationship status to " + saved.getVerificationStatus() + ", strength: " + saved.getStrength()
        ));

        return saved;
    }

    @Transactional
    public void deleteRelationship(Long id) {
        Relationship r = relationshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found with ID: " + id));

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_RELATIONSHIP",
                "RELATIONSHIP",
                "rel-" + r.getId(),
                "Removed relationship link between " + r.getSourceEntityId() + " and " + r.getTargetEntityId()
        ));

        relationshipRepository.delete(r);
    }

    public List<Relationship> getAllRelationships(String query, String status, String type) {
        List<Relationship> list = relationshipRepository.findAll();
        if (status != null && !status.isBlank()) {
            list = list.stream().filter(r -> status.equalsIgnoreCase(r.getVerificationStatus())).collect(Collectors.toList());
        }
        if (type != null && !type.isBlank()) {
            list = list.stream().filter(r -> type.equalsIgnoreCase(r.getRelationshipType())).collect(Collectors.toList());
        }
        if (query != null && !query.isBlank()) {
            String q = query.trim().toLowerCase();
            list = list.stream().filter(r -> 
                r.getSourceEntityId().toLowerCase().contains(q) ||
                r.getTargetEntityId().toLowerCase().contains(q) ||
                r.getRelationshipType().toLowerCase().contains(q) ||
                (r.getDescription() != null && r.getDescription().toLowerCase().contains(q))
            ).collect(Collectors.toList());
        }
        return list;
    }

    public PathAnalysisResultDto findShortestPath(String sourceId, String targetId) {
        PathAnalysisResultDto res = new PathAnalysisResultDto();
        res.setSourceId(sourceId);
        res.setTargetId(targetId);

        if (sourceId == null || targetId == null || sourceId.trim().equalsIgnoreCase(targetId.trim())) {
            res.setFound(false);
            res.setExplanation("Source and target must be distinct valid entities.");
            return res;
        }

        List<Relationship> relationships = relationshipRepository.findAll();

        // Adjacency representation: node -> map of neighbor to relationship
        Map<String, List<Relationship>> adj = new HashMap<>();
        for (Relationship r : relationships) {
            adj.computeIfAbsent(r.getSourceEntityId(), k -> new ArrayList<>()).add(r);
            adj.computeIfAbsent(r.getTargetEntityId(), k -> new ArrayList<>()).add(r);
        }

        if (!adj.containsKey(sourceId) || !adj.containsKey(targetId)) {
            res.setFound(false);
            res.setExplanation("One or both entities have no known network links.");
            return res;
        }

        // BFS to find shortest unweighted path
        Queue<String> queue = new LinkedList<>();
        Map<String, String> parentNode = new HashMap<>();
        Map<String, Relationship> parentEdge = new HashMap<>();
        Set<String> visited = new HashSet<>();

        queue.add(sourceId);
        visited.add(sourceId);
        boolean pathFound = false;

        while (!queue.isEmpty()) {
            String curr = queue.poll();
            if (curr.equalsIgnoreCase(targetId)) {
                pathFound = true;
                break;
            }

            for (Relationship edge : adj.getOrDefault(curr, Collections.emptyList())) {
                String neighbor = edge.getSourceEntityId().equalsIgnoreCase(curr) 
                        ? edge.getTargetEntityId() 
                        : edge.getSourceEntityId();

                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    parentNode.put(neighbor, curr);
                    parentEdge.put(neighbor, edge);
                    queue.add(neighbor);
                }
            }
        }

        if (!pathFound) {
            res.setFound(false);
            res.setHops(0);
            res.setExplanation("No relational path found between " + sourceId + " and " + targetId + " in current network graph.");
            return res;
        }

        // Reconstruct path
        List<String> nodePath = new ArrayList<>();
        List<Relationship> edgePath = new ArrayList<>();
        String curr = targetId;

        while (!curr.equalsIgnoreCase(sourceId)) {
            nodePath.add(0, curr);
            Relationship edge = parentEdge.get(curr);
            if (edge != null) edgePath.add(0, edge);
            curr = parentNode.get(curr);
        }
        nodePath.add(0, sourceId);

        // Fetch entity metadata for detailed display
        Map<String, Person> persons = personRepository.findAll().stream()
                .collect(Collectors.toMap(Person::getPersonId, p -> p, (a, b) -> a));
        Map<String, Organization> orgs = organizationRepository.findAll().stream()
                .collect(Collectors.toMap(Organization::getOrganizationId, o -> o, (a, b) -> a));
        Map<String, Vehicle> vehs = vehicleRepository.findAll().stream()
                .collect(Collectors.toMap(Vehicle::getVehicleId, v -> v, (a, b) -> a));
        Map<String, CaseEntity> cases = caseRepository.findAll().stream()
                .collect(Collectors.toMap(c -> String.valueOf(c.getId()), c -> c, (a, b) -> a));

        List<Map<String, Object>> pathNodes = new ArrayList<>();
        for (String nid : nodePath) {
            Map<String, Object> nodeInfo = new HashMap<>();
            nodeInfo.put("id", nid);
            if (persons.containsKey(nid)) {
                Person p = persons.get(nid);
                nodeInfo.put("name", p.getName());
                nodeInfo.put("type", "Person");
                nodeInfo.put("subLabel", p.getAlias() != null ? p.getAlias() : p.getOccupation());
                nodeInfo.put("status", p.getStatus());
            } else if (orgs.containsKey(nid)) {
                Organization o = orgs.get(nid);
                nodeInfo.put("name", o.getName());
                nodeInfo.put("type", "Organization");
                nodeInfo.put("subLabel", o.getOrgType());
                nodeInfo.put("status", o.getStatus());
            } else if (vehs.containsKey(nid)) {
                Vehicle v = vehs.get(nid);
                nodeInfo.put("name", v.getRegistrationNumber());
                nodeInfo.put("type", "Vehicle");
                nodeInfo.put("subLabel", v.getBrand() + " " + v.getModel());
                nodeInfo.put("status", "ACTIVE");
            } else {
                nodeInfo.put("name", nid);
                nodeInfo.put("type", "Entity");
                nodeInfo.put("subLabel", "Network Node");
                nodeInfo.put("status", "ACTIVE");
            }
            pathNodes.add(nodeInfo);
        }

        List<Map<String, Object>> pathEdges = new ArrayList<>();
        Set<String> caseNumbers = new HashSet<>();
        List<Map<String, Object>> associatedCases = new ArrayList<>();

        for (Relationship edge : edgePath) {
            Map<String, Object> edgeInfo = new HashMap<>();
            edgeInfo.put("source", edge.getSourceEntityId());
            edgeInfo.put("target", edge.getTargetEntityId());
            edgeInfo.put("relationshipType", edge.getRelationshipType());
            edgeInfo.put("strength", edge.getStrength());
            edgeInfo.put("strengthLevel", edge.getStrengthLevel());
            edgeInfo.put("description", edge.getDescription());
            edgeInfo.put("caseId", edge.getCaseId());
            if (edge.getCaseId() != null && cases.containsKey(String.valueOf(edge.getCaseId()))) {
                CaseEntity c = cases.get(String.valueOf(edge.getCaseId()));
                if (caseNumbers.add(c.getCaseNumber())) {
                    Map<String, Object> caseInfo = new HashMap<>();
                    caseInfo.put("id", c.getId());
                    caseInfo.put("caseNumber", c.getCaseNumber());
                    caseInfo.put("title", c.getTitle());
                    caseInfo.put("status", c.getStatus());
                    caseInfo.put("priority", c.getPriority());
                    associatedCases.add(caseInfo);
                }
            }
            pathEdges.add(edgeInfo);
        }

        res.setFound(true);
        res.setHops(edgePath.size());
        res.setPathNodeIds(nodePath);
        res.setPathNodes(pathNodes);
        res.setPathEdges(pathEdges);
        res.setAssociatedCases(associatedCases);

        String srcName = pathNodes.isEmpty() ? sourceId : (String) pathNodes.get(0).get("name");
        String tgtName = pathNodes.isEmpty() ? targetId : (String) pathNodes.get(pathNodes.size() - 1).get("name");
        res.setSourceName(srcName);
        res.setTargetName(tgtName);
        res.setExplanation("Path discovered between " + srcName + " and " + tgtName + " across " + edgePath.size() + " connection hop(s).");

        return res;
    }
}
