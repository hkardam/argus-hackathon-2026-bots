package com.bots.hackathon.ai.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "chat_bot_message")
public class ChatbotMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sessionId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ChatAuthor author;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Boolean gotToNextQuestion;

    @Column(columnDefinition = "TEXT")
    private String nextMessage;

    private String nextField;

    @Column(columnDefinition = "TEXT")
    private String formOutput;

    private Integer processPercent;

    private boolean completed;

    @Column(nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
}
