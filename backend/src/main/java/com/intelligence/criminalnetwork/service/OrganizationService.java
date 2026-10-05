package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.Organization;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrganizationService {

    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public Organization getOrganizationById(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + id));
    }

    @Transactional
    public Organization createOrganization(Organization org) {
        if (org.getOrganizationId() == null || org.getOrganizationId().isBlank()) {
            long count = organizationRepository.count() + 1;
            org.setOrganizationId(String.format("ORG-%04d", count));
        }

        Organization saved = organizationRepository.save(org);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_ORGANIZATION",
                "ORGANIZATION",
                saved.getOrganizationId(),
                "Created organization entity " + saved.getName()
        ));

        return saved;
    }

    @Transactional
    public Organization updateOrganization(Long id, Organization updated) {
        Organization existing = getOrganizationById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getOrgType() != null) existing.setOrgType(updated.getOrgType());
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());

        Organization saved = organizationRepository.save(existing);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_ORGANIZATION",
                "ORGANIZATION",
                saved.getOrganizationId(),
                "Updated organization " + saved.getName()
        ));
        return saved;
    }

    @Transactional
    public void deleteOrganization(Long id) {
        Organization org = getOrganizationById(id);
        organizationRepository.delete(org);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_ORGANIZATION",
                "ORGANIZATION",
                org.getOrganizationId(),
                "Deleted organization " + org.getName()
        ));
    }
}
