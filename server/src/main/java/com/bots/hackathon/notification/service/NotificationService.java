package com.bots.hackathon.notification.service;

import com.bots.hackathon.common.enums.NotificationType;
import com.bots.hackathon.notification.model.Notification;
import com.bots.hackathon.notification.repo.NotificationRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification createNotification(
            Long recipientUserId,
            NotificationType type,
            String title,
            String message,
            String referenceType,
            String referenceId) {
        Notification notification =
                Notification.builder()
                        .recipientUserId(recipientUserId)
                        .type(type)
                        .title(title)
                        .message(message)
                        .referenceType(referenceType)
                        .referenceId(referenceId)
                        .build();
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByRecipientUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        notificationRepository
                .findById(notificationId)
                .ifPresent(
                        n -> {
                            n.setIsRead(true);
                            n.setReadAt(LocalDateTime.now());
                            notificationRepository.save(n);
                        });
    }
}
