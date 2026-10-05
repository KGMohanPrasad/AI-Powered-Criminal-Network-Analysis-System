package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.Vehicle;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {

    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<Vehicle> getAllVehicles(Long caseId) {
        if (caseId != null) return vehicleRepository.findByCaseId(caseId);
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
    }

    @Transactional
    public Vehicle createVehicle(Vehicle v) {
        if (v.getVehicleId() == null || v.getVehicleId().isBlank()) {
            long count = vehicleRepository.count() + 1;
            v.setVehicleId(String.format("VEH-%04d", count));
        }

        Vehicle saved = vehicleRepository.save(v);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_VEHICLE",
                "VEHICLE",
                saved.getVehicleId(),
                "Logged vehicle " + saved.getRegistrationNumber() + " (" + saved.getBrand() + " " + saved.getModel() + ")"
        ));

        return saved;
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle updated) {
        Vehicle existing = getVehicleById(id);
        if (updated.getRegistrationNumber() != null) existing.setRegistrationNumber(updated.getRegistrationNumber());
        if (updated.getVehicleType() != null) existing.setVehicleType(updated.getVehicleType());
        if (updated.getBrand() != null) existing.setBrand(updated.getBrand());
        if (updated.getModel() != null) existing.setModel(updated.getModel());
        if (updated.getColor() != null) existing.setColor(updated.getColor());
        if (updated.getOwnerName() != null) existing.setOwnerName(updated.getOwnerName());
        if (updated.getOwnerPersonId() != null) existing.setOwnerPersonId(updated.getOwnerPersonId());
        if (updated.getCaseId() != null) existing.setCaseId(updated.getCaseId());
        if (updated.getLastKnownLocation() != null) existing.setLastKnownLocation(updated.getLastKnownLocation());

        Vehicle saved = vehicleRepository.save(existing);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_VEHICLE",
                "VEHICLE",
                saved.getVehicleId(),
                "Updated vehicle " + saved.getRegistrationNumber()
        ));
        return saved;
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle v = getVehicleById(id);
        vehicleRepository.delete(v);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_VEHICLE",
                "VEHICLE",
                v.getVehicleId(),
                "Deleted vehicle " + v.getRegistrationNumber()
        ));
    }
}
