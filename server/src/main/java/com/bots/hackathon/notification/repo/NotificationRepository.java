package com.bots.hackathon.notification.repo;

import com.bots.hackathon.notification.model.Notification;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

  List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long recipientUserId);

  List<Notification> findByRecipientUserIdAndIsReadFalse(Long recipientUserId);
}
