package com.bots.hackathon.notification.event;

import com.bots.hackathon.common.enums.NotificationType;
import com.bots.hackathon.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventPublisher {

    private final NotificationService notificationService;

    /**
     * Hook point for application status change events. Called from workflow transitions.
     */
    public void onApplicationStatusChanged(
            Long recipientUserId, String applicationId, String oldStatus, String newStatus) {
        log.info(
                "Notification hook: Application {} transitioned from {} to {}",
                applicationId,
                oldStatus,
                newStatus);
        notificationService.createNotification(
                recipientUserId,
                NotificationType.INFO,
                "Application Status Updated",
                "Your application status changed from " + oldStatus + " to " + newStatus,
                "APPLICATION",
                applicationId);
    }

    /** Hook point for review assignment events. */
    public void onReviewAssigned(Long reviewerUserId, String applicationId) {
        log.info("Notification hook: Review assigned for application {}", applicationId);
        notificationService.createNotification(
                reviewerUserId,
                NotificationType.ACTION_REQUIRED,
                "New Review Assignment",
                "You have been assigned to review an application",
                "APPLICATION",
                applicationId);
    }

    /** Hook point for SLA deadline approaching events. */
    public void onSlaDeadlineApproaching(Long userId, String objectType, String objectId) {
        log.info("Notification hook: SLA deadline approaching for {} {}", objectType, objectId);
        notificationService.createNotification(
                userId,
                NotificationType.DEADLINE,
                "Deadline Approaching",
                "Action required before SLA deadline",
                objectType,
                objectId);
    }
}