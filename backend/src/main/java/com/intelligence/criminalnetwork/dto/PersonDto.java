package com.intelligence.criminalnetwork.dto;

import jakarta.validation.constraints.NotBlank;

public class PersonDto {
    private Long id;
    private String personId; // DEMO-P001
    
    @NotBlank(message = "Name is required")
    private String name;

    private String alias;
    private Integer age;
    private String gender;
    private String primaryLocation;
    private String status = "PERSON_OF_INTEREST"; // SUSPECT, PERSON_OF_INTEREST, WITNESS, ASSOCIATE, CLEARED
    private String occupation;
    private String riskLevel = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL
    private String photoUrl;
    private String notes;
    private int connectionCount = 0;
    private int associatedCasesCount = 0;

    public PersonDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPersonId() { return personId; }
    public void setPersonId(String personId) { this.personId = personId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPrimaryLocation() { return primaryLocation; }
    public void setPrimaryLocation(String primaryLocation) { this.primaryLocation = primaryLocation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public int getConnectionCount() { return connectionCount; }
    public void setConnectionCount(int connectionCount) { this.connectionCount = connectionCount; }

    public int getAssociatedCasesCount() { return associatedCasesCount; }
    public void setAssociatedCasesCount(int associatedCasesCount) { this.associatedCasesCount = associatedCasesCount; }
}
