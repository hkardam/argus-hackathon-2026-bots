package com.bots.hackathon.reporting.dto;

import com.bots.hackathon.common.enums.ReportStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReportResponse(
    UUID id,
    UUID grantAwardId,
    Long submittedByUserId,
    String reportType,
    String content,
    ReportStatus status,
    LocalDateTime submittedAt,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {}
