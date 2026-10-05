package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.entity.Organization;
import com.intelligence.criminalnetwork.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "*")
public class OrganizationController {

    @Autowired private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Organization>>> getAllOrganizations() {
        return ResponseEntity.ok(ApiResponse.ok(organizationService.getAllOrganizations()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Organization>> getOrganizationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(organizationService.getOrganizationById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Organization>> createOrganization(@RequestBody Organization org) {
        return ResponseEntity.ok(ApiResponse.ok("Organization registered successfully", organizationService.createOrganization(org)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Organization>> updateOrganization(@PathVariable Long id, @RequestBody Organization org) {
        return ResponseEntity.ok(ApiResponse.ok("Organization updated successfully", organizationService.updateOrganization(id, org)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok(ApiResponse.ok("Organization deleted successfully", null));
    }
}
