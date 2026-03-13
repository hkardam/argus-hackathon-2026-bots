package com.bots.hackathon.messaging.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageResponse(
        UUID id, UUID threadId, Long senderUserId, String content, LocalDateTime createdAt) {}
