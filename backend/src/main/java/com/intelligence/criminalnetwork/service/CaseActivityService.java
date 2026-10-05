package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.CaseActivity;
import com.intelligence.criminalnetwork.repository.CaseActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CaseActivityService {

    @Autowired
    private CaseActivityRepository caseActivityRepository;

    public List<CaseActivity> getActivityByCaseId(Long caseId) {
        return caseActivityRepository.findByCaseIdOrderByTimestampDesc(caseId);
    }

    public List<CaseActivity> getActivityByCaseNumber(String caseNumber) {
        return caseActivityRepository.findByCaseNumberOrderByTimestampDesc(caseNumber);
    }

    public List<CaseActivity> getRecentActivities() {
        return caseActivityRepository.findTop20ByOrderByTimestampDesc();
    }

    @Transactional
    public CaseActivity logActivity(Long caseId, String caseNumber, String actionType, String title, String description, String performedBy) {
        CaseActivity activity = new CaseActivity(caseId, caseNumber, actionType, title, description, performedBy);
        return caseActivityRepository.save(activity);
    }
}
