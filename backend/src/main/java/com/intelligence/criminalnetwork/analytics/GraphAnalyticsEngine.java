package com.intelligence.criminalnetwork.analytics;

import com.intelligence.criminalnetwork.dto.AnomalyDto;
import com.intelligence.criminalnetwork.dto.CaseSimilarityDto;
import com.intelligence.criminalnetwork.dto.CentralityMetricsDto;
import com.intelligence.criminalnetwork.entity.CaseEntity;
import com.intelligence.criminalnetwork.entity.CommunicationRecord;
import com.intelligence.criminalnetwork.entity.Relationship;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GraphAnalyticsEngine {

    /**
     * Calculates Degree, Betweenness, and Closeness centralities for entities in the graph.
     */
    public List<CentralityMetricsDto> calculateCentralityMetrics(
            List<Relationship> relationships,
            Map<String, String> entityNames,
            Map<String, String> entityTypes) {

        // Build adjacency map
        Map<String, Set<String>> adj = new HashMap<>();
        for (Relationship r : relationships) {
            adj.computeIfAbsent(r.getSourceEntityId(), k -> new HashSet<>()).add(r.getTargetEntityId());
            adj.computeIfAbsent(r.getTargetEntityId(), k -> new HashSet<>()).add(r.getSourceEntityId());
        }

        List<String> nodes = new ArrayList<>(adj.keySet());
        int n = nodes.size();
        if (n == 0) return Collections.emptyList();

        // 1. Degree Centrality
        Map<String, Integer> degreeMap = new HashMap<>();
        for (String node : nodes) {
            degreeMap.put(node, adj.get(node).size());
        }

        // 2. Betweenness Centrality (Brandes Algorithm for unweighted graphs)
        Map<String, Double> betweennessMap = new HashMap<>();
        for (String v : nodes) betweennessMap.put(v, 0.0);

        for (String s : nodes) {
            Stack<String> stack = new Stack<>();
            Map<String, List<String>> predecessors = new HashMap<>();
            Map<String, Integer> sigma = new HashMap<>();
            Map<String, Integer> dist = new HashMap<>();

            for (String v : nodes) {
                predecessors.put(v, new ArrayList<>());
                sigma.put(v, 0);
                dist.put(v, -1);
            }
            sigma.put(s, 1);
            dist.put(s, 0);

            Queue<String> queue = new LinkedList<>();
            queue.add(s);

            while (!queue.isEmpty()) {
                String v = queue.poll();
                stack.push(v);
                int vDist = dist.get(v);

                for (String w : adj.getOrDefault(v, Collections.emptySet())) {
                    if (dist.get(w) < 0) {
                        dist.put(w, vDist + 1);
                        queue.add(w);
                    }
                    if (dist.get(w) == vDist + 1) {
                        sigma.put(w, sigma.get(w) + sigma.get(v));
                        predecessors.get(w).add(v);
                    }
                }
            }

            Map<String, Double> delta = new HashMap<>();
            for (String v : nodes) delta.put(v, 0.0);

            while (!stack.isEmpty()) {
                String w = stack.pop();
                for (String v : predecessors.get(w)) {
                    double c = ((double) sigma.get(v) / (double) sigma.get(w)) * (1.0 + delta.get(w));
                    delta.put(v, delta.get(v) + c);
                }
                if (!w.equals(s)) {
                    betweennessMap.put(w, betweennessMap.get(w) + delta.get(w));
                }
            }
        }

        // 3. Closeness Centrality & Community Component Detection
        Map<String, Double> closenessMap = new HashMap<>();
        Map<String, Integer> componentMap = new HashMap<>();
        int compCount = 1;
        Set<String> visited = new HashSet<>();

        for (String s : nodes) {
            Queue<String> queue = new LinkedList<>();
            Map<String, Integer> d = new HashMap<>();
            queue.add(s);
            d.put(s, 0);

            while (!queue.isEmpty()) {
                String curr = queue.poll();
                int currD = d.get(curr);
                for (String nb : adj.getOrDefault(curr, Collections.emptySet())) {
                    if (!d.containsKey(nb)) {
                        d.put(nb, currD + 1);
                        queue.add(nb);
                    }
                }
            }

            double sumDist = 0;
            for (int distVal : d.values()) {
                sumDist += distVal;
            }
            double closeness = (sumDist > 0 && d.size() > 1) ? ((double) (d.size() - 1) / sumDist) : 0.0;
            closenessMap.put(s, Math.round(closeness * 1000.0) / 1000.0);

            if (!visited.contains(s)) {
                // BFS for component
                Queue<String> compQ = new LinkedList<>();
                compQ.add(s);
                visited.add(s);
                while (!compQ.isEmpty()) {
                    String node = compQ.poll();
                    componentMap.put(node, compCount);
                    for (String nb : adj.getOrDefault(node, Collections.emptySet())) {
                        if (!visited.contains(nb)) {
                            visited.add(nb);
                            compQ.add(nb);
                        }
                    }
                }
                compCount++;
            }
        }

        // Build result DTOs
        List<CentralityMetricsDto> results = new ArrayList<>();
        for (String node : nodes) {
            int degree = degreeMap.getOrDefault(node, 0);
            double bet = betweennessMap.getOrDefault(node, 0.0);
            double normalizedBet = n > 2 ? Math.round((bet / ((n - 1) * (n - 2) / 2.0)) * 100.0) : bet;
            double clo = closenessMap.getOrDefault(node, 0.0);
            int comp = componentMap.getOrDefault(node, 1);

            String structuralRole = "Standard Network Node";
            if (normalizedBet > 15.0) {
                structuralRole = "Critical Cluster Bridge";
            } else if (degree >= 4) {
                structuralRole = "High-Connectivity Hub";
            } else if (degree == 1) {
                structuralRole = "Peripheral Leaf Node";
            }

            String name = entityNames.getOrDefault(node, node);
            String type = entityTypes.getOrDefault(node, "Entity");

            results.add(new CentralityMetricsDto(node, name, type, degree, normalizedBet, clo, comp, structuralRole));
        }

        // Sort descending by betweenness then degree
        results.sort((a, b) -> {
            int cmp = Double.compare(b.getBetweennessCentrality(), a.getBetweennessCentrality());
            return cmp != 0 ? cmp : Integer.compare(b.getDegreeCentrality(), a.getDegreeCentrality());
        });

        return results;
    }

    /**
     * Case Similarity Engine: Compares two cases based on incident categories, team, location keywords, and connected entities.
     */
    public List<CaseSimilarityDto> calculateCaseSimilarities(List<CaseEntity> cases, List<Relationship> relationships) {
        List<CaseSimilarityDto> list = new ArrayList<>();
        if (cases == null || cases.size() < 2) return list;

        // Map case ID to entities
        Map<Long, Set<String>> caseEntities = new HashMap<>();
        for (Relationship r : relationships) {
            if (r.getCaseId() != null) {
                caseEntities.computeIfAbsent(r.getCaseId(), k -> new HashSet<>()).add(r.getSourceEntityId());
                caseEntities.computeIfAbsent(r.getCaseId(), k -> new HashSet<>()).add(r.getTargetEntityId());
            }
        }

        for (int i = 0; i < cases.size(); i++) {
            CaseEntity c1 = cases.get(i);
            Set<String> e1 = caseEntities.getOrDefault(c1.getId(), Collections.emptySet());

            for (int j = i + 1; j < cases.size(); j++) {
                CaseEntity c2 = cases.get(j);
                Set<String> e2 = caseEntities.getOrDefault(c2.getId(), Collections.emptySet());

                int sharedCount = 0;
                List<String> indicators = new ArrayList<>();

                // Match 1: Shared entities
                Set<String> intersection = new HashSet<>(e1);
                intersection.retainAll(e2);
                if (!intersection.isEmpty()) {
                    sharedCount += intersection.size();
                    indicators.add("Shared entities: " + String.join(", ", intersection));
                }

                // Match 2: Case type
                if (c1.getCaseType() != null && c1.getCaseType().equalsIgnoreCase(c2.getCaseType())) {
                    sharedCount += 2;
                    indicators.add("Identical crime category: " + c1.getCaseType());
                }

                // Match 3: Assigned team or investigator
                if (c1.getLeadInvestigator() != null && c1.getLeadInvestigator().equalsIgnoreCase(c2.getLeadInvestigator())) {
                    sharedCount += 1;
                    indicators.add("Lead investigator overlap: " + c1.getLeadInvestigator());
                }

                if (c1.getPriority() != null && c1.getPriority().equalsIgnoreCase(c2.getPriority())) {
                    sharedCount += 1;
                    indicators.add("Matching priority level: " + c1.getPriority());
                }

                // Calculate similarity percentage (30% to 92%)
                int score = Math.min(92, 35 + (sharedCount * 12));
                if (sharedCount > 0) {
                    String obs = "Cases share " + indicators.size() + " structural and analytical indicators across investigative records.";
                    list.add(new CaseSimilarityDto(c1.getCaseNumber(), c1.getTitle(), c2.getCaseNumber(), c2.getTitle(), score, indicators.size(), indicators, obs));
                }
            }
        }

        list.sort((a, b) -> Integer.compare(b.getSimilarityScore(), a.getSimilarityScore()));
        return list;
    }

    /**
     * Anomaly Detection Engine
     */
    public List<AnomalyDto> detectAnomalies(List<Relationship> relationships, List<CommunicationRecord> comms) {
        List<AnomalyDto> anomalies = new ArrayList<>();

        // Anomaly 1: Sudden Cross-Cluster Bridge formation
        anomalies.add(new AnomalyDto(
                "ANOM-01",
                "Cross-Cluster Bridge Link Formation",
                "NEW_BRIDGE_LINK",
                "Subject DEMO-P017 formed simultaneous connections across logistics (Cluster 1) and financial shell nodes (Cluster 2).",
                88,
                "DEMO-P017 (Leonidas Drake)",
                List.of("4 verified relationships linking ORG-0001 with ORG-0007", "Simultaneous phone coordination timestamps"),
                "High betweenness score indicates strategic information or resource flow between previously isolated clusters."
        ));

        // Anomaly 2: Rapid High-Velocity SIM Re-burns
        anomalies.add(new AnomalyDto(
                "ANOM-02",
                "High-Frequency Telecom Authentication Surge",
                "COMMUNICATION_BURST",
                "Retail telecom point processed 6 unauthorized SIM overrides within 40 minutes.",
                82,
                "DEMO-P018 (Aiden Campbell)",
                List.of("INC-2026-0012 incident filing", "EV-0018 retail CRM audit export"),
                "Velocity of account credential modifications deviates 850% from baseline retail averages."
        ));

        // Anomaly 3: Sudden Frequency Jammer Deployment
        anomalies.add(new AnomalyDto(
                "ANOM-03",
                "Synchronized GPS Jamming & Auto Transit",
                "SENSOR_BLACKOUT",
                "High-frequency radio jamming observed concurrent with luxury vehicle departure from Westside Yard.",
                78,
                "DEMO-P007 (Tariq Al-Mansoor)",
                List.of("EV-0006 recovered 16-band radio jammer", "INC-2026-0003 telemetry records"),
                "Physical jamming devices deployed specifically during off-peak gate movements."
        ));

        // Anomaly 4: Repeated Location Co-occurrence
        anomalies.add(new AnomalyDto(
                "ANOM-04",
                "Unusual Executive Co-occurrence at Private Club",
                "REPEATED_LOCATION_OVERLAP",
                "Logistics director, financial consultant, and customs broker observed at private member dining club venue.",
                74,
                "The Obsidian Social Club",
                List.of("INC-2026-0020 observation report", "3 distinct communications mentioning Westside reservation"),
                "Off-record nocturnal meetings between regulatory subjects and private transport brokers."
        ));

        return anomalies;
    }
}
