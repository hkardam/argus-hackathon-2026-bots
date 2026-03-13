package com.bots.hackathon.reporting.dto;

import com.bots.hackathon.common.enums.VerificationStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ExpenditureRecordResponse(
    UUID id,
    UUID grantAwardId,
    String category,
    String description,
    BigDecimal amount,
    LocalDate expenditureDate,
    UUID receiptDocumentId,
    VerificationStatus verificationStatus,
    Long verifiedByUserId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {}
