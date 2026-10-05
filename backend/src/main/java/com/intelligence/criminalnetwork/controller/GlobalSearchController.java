package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.*;
import com.intelligence.criminalnetwork.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class GlobalSearchController {

    @Autowired private PersonRepository personRepository;
    @Autowired private CaseRepository caseRepository;
    @Autowired private EvidenceRepository evidenceRepository;
    @Autowired private IncidentRepository incidentRepository;
    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private LocationRepository locationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, List<Map<String, Object>>>>> searchAll(@RequestParam(name = "q", defaultValue = "") String query) {
        String q = query.trim().toLowerCase();
        Map<String, List<Map<String, Object>>> grouped = new LinkedHashMap<>();

        if (q.isBlank()) {
            return ResponseEntity.ok(ApiResponse.ok(grouped));
        }

        // 1. Persons
        List<Map<String, Object>> persons = personRepository.searchPersons(q).stream().limit(5).map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", p.getPersonId());
            m.put("title", p.getName());
            m.put("subtitle", (p.getAlias() != null ? "Alias: " + p.getAlias() + " | " : "") + p.getPrimaryLocation());
            m.put("type", "PERSON");
            m.put("badge", p.getStatus());
            return m;
        }).collect(Collectors.toList());
        if (!persons.isEmpty()) grouped.put("PERSONS", persons);

        // 2. Cases
        List<Map<String, Object>> cases = caseRepository.searchByKeyword(q).stream().limit(5).map(c -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", c.getCaseNumber());
            m.put("title", c.getTitle());
            m.put("subtitle", c.getCaseNumber() + " • " + c.getCaseType() + " • " + c.getLeadInvestigator());
            m.put("type", "CASE");
            m.put("badge", c.getStatus());
            return m;
        }).collect(Collectors.toList());
        if (!cases.isEmpty()) grouped.put("CASES", cases);

        // 3. Evidence
        List<Map<String, Object>> evids = evidenceRepository.findAll().stream()
                .filter(e -> e.getEvidenceId().toLowerCase().contains(q) ||
                             e.getDescription().toLowerCase().contains(q) ||
                             (e.getCaseNumber() != null && e.getCaseNumber().toLowerCase().contains(q)))
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", e.getEvidenceId());
                    m.put("title", e.getEvidenceId() + " — " + e.getEvidenceType());
                    m.put("subtitle", e.getDescription());
                    m.put("type", "EVIDENCE");
                    m.put("badge", e.getStatus());
                    return m;
                }).collect(Collectors.toList());
        if (!evids.isEmpty()) grouped.put("EVIDENCE", evids);

        // 4. Incidents
        List<Map<String, Object>> incs = incidentRepository.findAll().stream()
                .filter(i -> i.getIncidentId().toLowerCase().contains(q) ||
                             i.getIncidentType().toLowerCase().contains(q) ||
                             i.getLocation().toLowerCase().contains(q))
                .limit(5)
                .map(i -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", i.getIncidentId());
                    m.put("title", i.getIncidentId() + " — " + i.getIncidentType());
                    m.put("subtitle", i.getLocation() + " (" + i.getIncidentDate() + ")");
                    m.put("type", "INCIDENT");
                    m.put("badge", i.getStatus());
                    return m;
                }).collect(Collectors.toList());
        if (!incs.isEmpty()) grouped.put("INCIDENTS", incs);

        // 5. Organizations
        List<Map<String, Object>> orgs = organizationRepository.findAll().stream()
                .filter(o -> o.getName().toLowerCase().contains(q) ||
                             o.getOrganizationId().toLowerCase().contains(q) ||
                             (o.getOrgType() != null && o.getOrgType().toLowerCase().contains(q)))
                .limit(5)
                .map(o -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", o.getOrganizationId());
                    m.put("title", o.getName());
                    m.put("subtitle", o.getOrgType() + " • " + o.getLocation());
                    m.put("type", "ORGANIZATION");
                    m.put("badge", o.getStatus());
                    return m;
                }).collect(Collectors.toList());
        if (!orgs.isEmpty()) grouped.put("ORGANIZATIONS", orgs);

        // 6. Vehicles
        List<Map<String, Object>> vehs = vehicleRepository.findAll().stream()
                .filter(v -> v.getRegistrationNumber().toLowerCase().contains(q) ||
                             (v.getBrand() != null && v.getBrand().toLowerCase().contains(q)) ||
                             (v.getModel() != null && v.getModel().toLowerCase().contains(q)))
                .limit(5)
                .map(v -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", v.getVehicleId());
                    m.put("title", v.getRegistrationNumber());
                    m.put("subtitle", v.getBrand() + " " + v.getModel() + " • " + v.getColor() + " • Owner: " + v.getOwnerName());
                    m.put("type", "VEHICLE");
                    m.put("badge", v.getVehicleType());
                    return m;
                }).collect(Collectors.toList());
        if (!vehs.isEmpty()) grouped.put("VEHICLES", vehs);

        // 7. Locations
        List<Map<String, Object>> locs = locationRepository.findAll().stream()
                .filter(l -> l.getName().toLowerCase().contains(q) ||
                             l.getLocationId().toLowerCase().contains(q) ||
                             (l.getCity() != null && l.getCity().toLowerCase().contains(q)) ||
                             (l.getAddress() != null && l.getAddress().toLowerCase().contains(q)))
                .limit(5)
                .map(l -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", l.getLocationId());
                    m.put("title", l.getName());
                    m.put("subtitle", (l.getAddress() != null ? l.getAddress() + ", " : "") + l.getCity());
                    m.put("type", "LOCATION");
                    m.put("badge", l.getStatus());
                    return m;
                }).collect(Collectors.toList());
        if (!locs.isEmpty()) grouped.put("LOCATIONS", locs);

        return ResponseEntity.ok(ApiResponse.ok(grouped));
    }
}
