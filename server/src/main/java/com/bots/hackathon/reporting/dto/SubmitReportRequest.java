package com.bots.hackathon.reporting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SubmitReportRequest(
        @NotNull(message = "Grant award ID is required") UUID grantAwardId,
        @NotBlank(message = "Report type is required") String reportType,
        String content) {}
