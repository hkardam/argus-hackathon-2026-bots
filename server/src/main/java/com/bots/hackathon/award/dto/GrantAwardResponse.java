package com.bots.hackathon.award.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record GrantAwardResponse(
        UUID id,
        UUID applicationId,
        UUID programmeId,
        UUID organisationId,
        BigDecimal awardedAmount,
        LocalDate startDate,
        LocalDate endDate,
        Long approvedByUserId,
        Boolean isActive,
        LocalDateTime createdAt) {}
