package com.intelligence.criminalnetwork.service;

import com.intelligence.criminalnetwork.entity.Notification;
import com.intelligence.criminalnetwork.exception.ResourceNotFoundException;
import com.intelligence.criminalnetwork.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Map<String, Object> getNotifications() {
        List<Notification> list = notificationRepository.findAllByOrderByCreatedAtDesc();
        long unreadCount = notificationRepository.countByReadFalse();
        Map<String, Object> res = new HashMap<>();
        res.put("notifications", list);
        res.put("unreadCount", unreadCount);
        return res;
    }

    @Transactional
    public Notification createNotification(String title, String message, String type, String entityType, String entityId) {
        Notification n = new Notification("ALL", title, message, type, entityType, entityId);
        return notificationRepository.save(n);
    }

    @Transactional
    public Notification markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        n.setRead(true);
        return notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findByReadFalseOrderByCreatedAtDesc();
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + id));
        notificationRepository.delete(n);
    }
}
