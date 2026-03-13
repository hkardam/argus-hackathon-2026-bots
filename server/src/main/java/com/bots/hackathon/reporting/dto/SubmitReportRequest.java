package com.bots.hackathon.reporting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record SubmitReportRequest(
        @NotNull(message = "Grant award ID is required") UUID grantAwardId,
        @NotBlank(message = "Report type is required")
                @Size(max = 100, message = "Report type must not exceed 100 characters")
                String reportType,
        @NotBlank(message = "Report content is required") String content) {}
