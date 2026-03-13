package com.bots.hackathon.ai.repo;

import com.bots.hackathon.ai.model.ChatbotMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatbotTextRepo extends JpaRepository<ChatbotMessage, Long> {
    java.util.List<ChatbotMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId);
}
