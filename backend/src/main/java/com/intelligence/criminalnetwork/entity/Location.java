package com.intelligence.criminalnetwork.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_id", nullable = false, unique = true, length = 50)
    private String locationId; // e.g. LOC-0001

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String state;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Column(name = "related_cases", length = 255)
    private String relatedCases;

    @Column(name = "related_incidents", length = 255)
    private String relatedIncidents;

    @Column(name = "related_persons", length = 255)
    private String relatedPersons;

    @Column(length = 50)
    private String status = "ACTIVE"; // ACTIVE, MONITORED, INACTIVE

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Location() {}

    public Location(String locationId, String name, String address, String city, String district, String state, BigDecimal latitude, BigDecimal longitude, String relatedCases, String relatedIncidents, String relatedPersons, String status, String notes) {
        this.locationId = locationId;
        this.name = name;
        this.address = address;
        this.city = city;
        this.district = district;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.relatedCases = relatedCases;
        this.relatedIncidents = relatedIncidents;
        this.relatedPersons = relatedPersons;
        this.status = status != null ? status : "ACTIVE";
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getRelatedCases() { return relatedCases; }
    public void setRelatedCases(String relatedCases) { this.relatedCases = relatedCases; }

    public String getRelatedIncidents() { return relatedIncidents; }
    public void setRelatedIncidents(String relatedIncidents) { this.relatedIncidents = relatedIncidents; }

    public String getRelatedPersons() { return relatedPersons; }
    public void setRelatedPersons(String relatedPersons) { this.relatedPersons = relatedPersons; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
