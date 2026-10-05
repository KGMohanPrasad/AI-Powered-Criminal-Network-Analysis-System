package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.AuditLog;
import com.intelligence.criminalnetwork.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    @Autowired private AuditLogRepository auditLogRepository;

    public List<AuditLog> getAuditLogs(String username) {
        if (username != null && !username.isBlank()) {
            return auditLogRepository.findByUsernameOrderByTimestampDesc(username);
        }
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
