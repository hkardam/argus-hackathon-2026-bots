package com.bots.hackathon.messaging.repo;

import com.bots.hackathon.messaging.model.Message;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByThreadIdOrderByCreatedAtAsc(UUID threadId);
}
