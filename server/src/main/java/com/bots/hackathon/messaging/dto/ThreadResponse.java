package com.bots.hackathon.messaging.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ThreadResponse(
        UUID id,
        String subject,
        UUID applicationId,
        Long createdByUserId,
        Boolean isClosed,
        LocalDateTime createdAt) {}
