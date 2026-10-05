package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.dto.PersonDto;
import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.entity.Person;
import com.intelligence.criminalnetwork.entity.Relationship;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import com.intelligence.criminalnetwork.repository.PersonRepository;
import com.intelligence.criminalnetwork.repository.RelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private RelationshipRepository relationshipRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    private String getCurrentUsername() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return "system";
    }

    public List<PersonDto> getAllPersons(String query, String status, String riskLevel) {
        List<Person> list;
        if (query != null && !query.isBlank()) {
            list = personRepository.searchPersons(query);
        } else if (status != null && !status.isBlank()) {
            list = personRepository.findByStatus(status);
        } else if (riskLevel != null && !riskLevel.isBlank()) {
            list = personRepository.findByRiskLevel(riskLevel);
        } else {
            list = personRepository.findAll();
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public PersonDto getPersonById(Long id) {
        Person p = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with ID: " + id));
        return toDto(p);
    }

    public PersonDto getPersonByPersonId(String personId) {
        Person p = personRepository.findByPersonId(personId)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with personId: " + personId));
        return toDto(p);
    }

    @Transactional
    public PersonDto createPerson(PersonDto dto) {
        Person p = new Person();

        if (dto.getPersonId() == null || dto.getPersonId().isBlank()) {
            long count = personRepository.count() + 1;
            p.setPersonId(String.format("DEMO-P%03d", count));
        } else {
            p.setPersonId(dto.getPersonId());
        }

        p.setName(dto.getName());
        p.setAlias(dto.getAlias());
        p.setAge(dto.getAge());
        p.setGender(dto.getGender());
        p.setPrimaryLocation(dto.getPrimaryLocation());
        p.setStatus(dto.getStatus() != null ? dto.getStatus() : "PERSON_OF_INTEREST");
        p.setOccupation(dto.getOccupation());
        p.setRiskLevel(dto.getRiskLevel() != null ? dto.getRiskLevel() : "MEDIUM");
        p.setPhotoUrl(dto.getPhotoUrl());
        p.setNotes(dto.getNotes());

        Person saved = personRepository.save(p);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "CREATE_PERSON",
                "PERSON",
                saved.getPersonId(),
                "Created person record: " + saved.getName() + " (" + saved.getPersonId() + ")"
        ));

        return toDto(saved);
    }

    @Transactional
    public PersonDto updatePerson(Long id, PersonDto dto) {
        Person p = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with ID: " + id));

        p.setName(dto.getName());
        p.setAlias(dto.getAlias());
        p.setAge(dto.getAge());
        p.setGender(dto.getGender());
        p.setPrimaryLocation(dto.getPrimaryLocation());
        p.setStatus(dto.getStatus());
        p.setOccupation(dto.getOccupation());
        p.setRiskLevel(dto.getRiskLevel());
        p.setPhotoUrl(dto.getPhotoUrl());
        p.setNotes(dto.getNotes());

        Person saved = personRepository.save(p);

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "EDIT_PERSON",
                "PERSON",
                saved.getPersonId(),
                "Updated person record: " + saved.getName()
        ));

        return toDto(saved);
    }

    @Transactional
    public void deletePerson(Long id) {
        Person p = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with ID: " + id));

        auditLogRepository.save(new AuditLog(
                getCurrentUsername(),
                "DELETE_PERSON",
                "PERSON",
                p.getPersonId(),
                "Removed person record: " + p.getName()
        ));

        personRepository.delete(p);
    }

    private PersonDto toDto(Person p) {
        PersonDto dto = new PersonDto();
        dto.setId(p.getId());
        dto.setPersonId(p.getPersonId());
        dto.setName(p.getName());
        dto.setAlias(p.getAlias());
        dto.setAge(p.getAge());
        dto.setGender(p.getGender());
        dto.setPrimaryLocation(p.getPrimaryLocation());
        dto.setStatus(p.getStatus());
        dto.setOccupation(p.getOccupation());
        dto.setRiskLevel(p.getRiskLevel());
        dto.setPhotoUrl(p.getPhotoUrl());
        dto.setNotes(p.getNotes());

        List<Relationship> rels = relationshipRepository.findConnectedToEntity(p.getPersonId());
        dto.setConnectionCount(rels.size());

        Set<Long> cases = new HashSet<>();
        for (Relationship r : rels) {
            if (r.getCaseId() != null) cases.add(r.getCaseId());
        }
        dto.setAssociatedCasesCount(cases.size());

        return dto;
    }
}
