package com.bots.hackathon.application.dto;

import com.bots.hackathon.common.enums.ApplicationStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ApplicationResponse(
        UUID id,
        UUID programmeId,
        UUID organisationId,
        Long applicantUserId,
        String title,
        String summary,
        BigDecimal requestedAmount,
        ApplicationStatus status,
        LocalDateTime submittedAt,
        LocalDateTime slaDeadline,
        boolean overdue,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}