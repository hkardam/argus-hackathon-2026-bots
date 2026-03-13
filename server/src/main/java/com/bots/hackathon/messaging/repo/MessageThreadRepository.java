package com.bots.hackathon.messaging.repo;

import com.bots.hackathon.messaging.model.MessageThread;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageThreadRepository extends JpaRepository<MessageThread, UUID> {

  List<MessageThread> findByApplicationId(UUID applicationId);

  List<MessageThread> findByCreatedByUserId(Long createdByUserId);
}
