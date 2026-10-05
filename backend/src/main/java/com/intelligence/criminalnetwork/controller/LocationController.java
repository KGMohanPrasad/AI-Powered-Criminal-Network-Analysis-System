package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.Location;
import com.intelligence.criminalnetwork.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Location>>> getAllLocations(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(locationService.getAllLocations(query, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Location>> getLocationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(locationService.getLocationById(id)));
    }

    @GetMapping("/code/{locationId}")
    public ResponseEntity<ApiResponse<Location>> getLocationByLocationId(@PathVariable String locationId) {
        return ResponseEntity.ok(ApiResponse.ok(locationService.getLocationByLocationId(locationId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Location>> createLocation(@RequestBody Location location) {
        Location created = locationService.createLocation(location);
        return ResponseEntity.ok(ApiResponse.ok("Location created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Location>> updateLocation(
            @PathVariable Long id,
            @RequestBody Location location) {
        Location updated = locationService.updateLocation(id, location);
        return ResponseEntity.ok(ApiResponse.ok("Location updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok(ApiResponse.ok("Location deleted successfully", null));
    }
}
