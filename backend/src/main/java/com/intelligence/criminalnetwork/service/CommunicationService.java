package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.CommunicationRecord;
import com.intelligence.criminalnetwork.repository.CommunicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunicationService {

    @Autowired private CommunicationRepository communicationRepository;

    public List<CommunicationRecord> getAllCommunications(Long caseId, String type) {
        if (caseId != null) return communicationRepository.findByCaseId(caseId);
        if (type != null && !type.isBlank()) return communicationRepository.findByCommunicationType(type);
        return communicationRepository.findAll();
    }

    public CommunicationRecord createCommunication(CommunicationRecord comm) {
        return communicationRepository.save(comm);
    }

    public CommunicationRecord updateCommunication(Long id, CommunicationRecord updated) {
        CommunicationRecord existing = communicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Communication not found with ID: " + id));
        if (updated.getSourceEntity() != null) existing.setSourceEntity(updated.getSourceEntity());
        if (updated.getTargetEntity() != null) existing.setTargetEntity(updated.getTargetEntity());
        if (updated.getCommunicationType() != null) existing.setCommunicationType(updated.getCommunicationType());
        if (updated.getDurationMinutes() != null) existing.setDurationMinutes(updated.getDurationMinutes());
        if (updated.getCaseId() != null) existing.setCaseId(updated.getCaseId());
        if (updated.getContextNotes() != null) existing.setContextNotes(updated.getContextNotes());
        return communicationRepository.save(existing);
    }

    public void deleteCommunication(Long id) {
        communicationRepository.deleteById(id);
    }
}
