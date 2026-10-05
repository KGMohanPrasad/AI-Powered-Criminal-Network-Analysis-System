package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.PublicDataRecord;
import com.intelligence.criminalnetwork.repository.PublicDataRecordRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class PublicDataService {

    private final PublicDataRecordRepository repository;

    public PublicDataService(PublicDataRecordRepository repository) {
        this.repository = repository;
    }

    public Page<PublicDataRecord> search(String category, String state, String status, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.searchRecords(category, state, status, search, pageable);
    }

    public List<PublicDataRecord> getRequiresReview() {
        return repository.findByVerificationStatus("REQUIRES_REVIEW");
    }

    public Optional<PublicDataRecord> getById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public PublicDataRecord approveRecord(Long id) {
        PublicDataRecord rec = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + id));
        rec.setVerificationStatus("SOURCE_VERIFIED");
        return repository.save(rec);
    }

    @Transactional
    public PublicDataRecord rejectRecord(Long id) {
        PublicDataRecord rec = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + id));
        rec.setVerificationStatus("ARCHIVED");
        return repository.save(rec);
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        long total = repository.count();
        long verified = repository.findByVerificationStatus("SOURCE_VERIFIED").size();
        long pendingReview = repository.findByVerificationStatus("REQUIRES_REVIEW").size();

        stats.put("totalRecords", total);
        stats.put("verifiedRecords", verified);
        stats.put("pendingReviewRecords", pendingReview);
        stats.put("lastSync", LocalDate.now().toString());

        return stats;
    }

    public Map<String, Object> getTrends() {
        Map<String, Object> trends = new HashMap<>();

        // By Category
        List<Object[]> catRows = repository.countByCategory();
        List<Map<String, Object>> catList = new ArrayList<>();
        for (Object[] row : catRows) {
            Map<String, Object> m = new HashMap<>();
            m.put("category", row[0] != null ? row[0] : "OTHER");
            m.put("count", row[1]);
            catList.add(m);
        }
        trends.put("byCategory", catList);

        // By State
        List<Object[]> stateRows = repository.countByState();
        List<Map<String, Object>> stateList = new ArrayList<>();
        for (Object[] row : stateRows) {
            Map<String, Object> m = new HashMap<>();
            m.put("state", row[0] != null ? row[0] : "National");
            m.put("count", row[1]);
            stateList.add(m);
        }
        trends.put("byState", stateList);

        // By Source Badge
        List<Object[]> badgeRows = repository.countBySourceBadge();
        List<Map<String, Object>> badgeList = new ArrayList<>();
        for (Object[] row : badgeRows) {
            Map<String, Object> m = new HashMap<>();
            m.put("sourceBadge", row[0] != null ? row[0] : "OFFICIAL");
            m.put("count", row[1]);
            badgeList.add(m);
        }
        trends.put("bySourceBadge", badgeList);

        return trends;
    }
}
