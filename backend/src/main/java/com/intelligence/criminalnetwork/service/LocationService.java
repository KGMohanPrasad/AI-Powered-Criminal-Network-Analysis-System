package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.Location;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LocationService {

    @Autowired private LocationRepository locationRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<Location> getAllLocations(String query, String status) {
        if (query != null && !query.isBlank()) {
            return locationRepository.searchLocations(query.trim());
        }
        if (status != null && !status.isBlank()) {
            return locationRepository.findByStatus(status.trim().toUpperCase());
        }
        return locationRepository.findAll();
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with ID: " + id));
    }

    public Location getLocationByLocationId(String locationId) {
        return locationRepository.findByLocationId(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with location ID: " + locationId));
    }

    @Transactional
    public Location createLocation(Location location) {
        if (location.getLocationId() == null || location.getLocationId().isBlank()) {
            long count = locationRepository.count() + 1;
            location.setLocationId(String.format("LOC-2026-%04d", count));
        }
        Location saved = locationRepository.save(location);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_LOCATION",
                "LOCATION",
                saved.getLocationId(),
                "Registered investigation location: " + saved.getName() + " in " + saved.getCity()
        ));
        return saved;
    }

    @Transactional
    public Location updateLocation(Long id, Location updated) {
        Location existing = getLocationById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getCity() != null) existing.setCity(updated.getCity());
        if (updated.getDistrict() != null) existing.setDistrict(updated.getDistrict());
        if (updated.getState() != null) existing.setState(updated.getState());
        if (updated.getLatitude() != null) existing.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) existing.setLongitude(updated.getLongitude());
        if (updated.getRelatedCases() != null) existing.setRelatedCases(updated.getRelatedCases());
        if (updated.getRelatedIncidents() != null) existing.setRelatedIncidents(updated.getRelatedIncidents());
        if (updated.getRelatedPersons() != null) existing.setRelatedPersons(updated.getRelatedPersons());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getNotes() != null) existing.setNotes(updated.getNotes());

        Location saved = locationRepository.save(existing);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "UPDATE_LOCATION",
                "LOCATION",
                saved.getLocationId(),
                "Updated details for location: " + saved.getName()
        ));
        return saved;
    }

    @Transactional
    public void deleteLocation(Long id) {
        Location loc = getLocationById(id);
        locationRepository.delete(loc);
        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_LOCATION",
                "LOCATION",
                loc.getLocationId(),
                "Deleted location record: " + loc.getName()
        ));
    }
}
