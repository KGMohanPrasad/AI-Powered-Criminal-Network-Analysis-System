package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.dto.IncidentDto;
import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.Incident;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class IncidentService {

    @Autowired private IncidentRepository incidentRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<Incident> getAllIncidents(Long caseId, String status) {
        if (caseId != null) return incidentRepository.findByCaseId(caseId);
        if (status != null && !status.isBlank()) return incidentRepository.findByStatus(status);
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + id));
    }

    @Transactional
    public Incident createIncident(IncidentDto dto) {
        Incident inc = new Incident();

        if (dto.getIncidentId() == null || dto.getIncidentId().isBlank()) {
            long count = incidentRepository.count() + 1;
            inc.setIncidentId(String.format("INC-2026-%04d", count));
        } else {
            inc.setIncidentId(dto.getIncidentId());
        }

        inc.setIncidentType(dto.getIncidentType());
        inc.setIncidentDate(dto.getIncidentDate() != null ? dto.getIncidentDate() : LocalDate.now());
        inc.setIncidentTime(dto.getIncidentTime() != null ? dto.getIncidentTime() : LocalTime.now());
        inc.setLocation(dto.getLocation());
        inc.setLatitude(dto.getLatitude());
        inc.setLongitude(dto.getLongitude());
        inc.setDescription(dto.getDescription());
        inc.setCaseId(dto.getCaseId());
        inc.setCaseNumber(dto.getCaseNumber());
        inc.setStatus(dto.getStatus() != null ? dto.getStatus() : "INVESTIGATING");

        Incident saved = incidentRepository.save(inc);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_INCIDENT",
                "INCIDENT",
                saved.getIncidentId(),
                "Logged incident " + saved.getIncidentId() + " (" + saved.getIncidentType() + ")"
        ));

        return saved;
    }

    @Transactional
    public Incident updateIncident(Long id, IncidentDto dto) {
        Incident inc = getIncidentById(id);
        if (dto.getIncidentType() != null) inc.setIncidentType(dto.getIncidentType());
        if (dto.getIncidentDate() != null) inc.setIncidentDate(dto.getIncidentDate());
        if (dto.getIncidentTime() != null) inc.setIncidentTime(dto.getIncidentTime());
        if (dto.getLocation() != null) inc.setLocation(dto.getLocation());
        if (dto.getLatitude() != null) inc.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) inc.setLongitude(dto.getLongitude());
        if (dto.getDescription() != null) inc.setDescription(dto.getDescription());
        if (dto.getCaseId() != null) inc.setCaseId(dto.getCaseId());
        if (dto.getCaseNumber() != null) inc.setCaseNumber(dto.getCaseNumber());
        if (dto.getStatus() != null) inc.setStatus(dto.getStatus());

        Incident saved = incidentRepository.save(inc);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_INCIDENT",
                "INCIDENT",
                saved.getIncidentId(),
                "Updated incident " + saved.getIncidentId()
        ));
        return saved;
    }

    @Transactional
    public void deleteIncident(Long id) {
        Incident inc = getIncidentById(id);
        incidentRepository.delete(inc);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_INCIDENT",
                "INCIDENT",
                inc.getIncidentId(),
                "Deleted incident " + inc.getIncidentId()
        ));
    }
}
