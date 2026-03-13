package com.bots.hackathon.ai.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bots.hackathon.ai.model.ChatbotMessage;

@Repository
public interface ChatbotTextRepo extends JpaRepository<ChatbotMessage, Long> {
    java.util.List<ChatbotMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId);
}
