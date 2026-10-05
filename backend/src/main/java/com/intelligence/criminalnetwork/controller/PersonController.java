package com.intelligence.criminalnetwork.controller;

import com.intelligence.criminalnetwork.dto.ApiResponse;
import com.intelligence.criminalnetwork.dto.PersonDto;
import com.intelligence.criminalnetwork.service.PersonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
@CrossOrigin(origins = "*")
public class PersonController {

    @Autowired
    private PersonService personService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PersonDto>>> getAllPersons(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String riskLevel) {
        List<PersonDto> persons = personService.getAllPersons(query, status, riskLevel);
        return ResponseEntity.ok(ApiResponse.ok(persons));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PersonDto>> getPersonById(@PathVariable Long id) {
        PersonDto p = personService.getPersonById(id);
        return ResponseEntity.ok(ApiResponse.ok(p));
    }

    @GetMapping("/demo-id/{personId}")
    public ResponseEntity<ApiResponse<PersonDto>> getPersonByPersonId(@PathVariable String personId) {
        PersonDto p = personService.getPersonByPersonId(personId);
        return ResponseEntity.ok(ApiResponse.ok(p));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PersonDto>> createPerson(@Valid @RequestBody PersonDto personDto) {
        PersonDto created = personService.createPerson(personDto);
        return ResponseEntity.ok(ApiResponse.ok("Person created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PersonDto>> updatePerson(@PathVariable Long id, @Valid @RequestBody PersonDto personDto) {
        PersonDto updated = personService.updatePerson(id, personDto);
        return ResponseEntity.ok(ApiResponse.ok("Person updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePerson(@PathVariable Long id) {
        personService.deletePerson(id);
        return ResponseEntity.ok(ApiResponse.ok("Person deleted successfully", null));
    }
}
