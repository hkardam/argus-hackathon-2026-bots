package com.bots.hackathon.disbursement.dto;

import com.bots.hackathon.common.enums.DisbursementStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record DisbursementTrancheResponse(
        UUID id,
        UUID grantAwardId,
        Integer trancheNumber,
        BigDecimal amount,
        LocalDate scheduledDate,
        LocalDate releasedDate,
        DisbursementStatus status,
        Long releasedByUserId,
        String notes,
        LocalDateTime createdAt) {}
