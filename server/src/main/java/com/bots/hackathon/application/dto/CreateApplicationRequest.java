package com.bots.hackathon.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateApplicationRequest(
        @NotNull(message = "Programme ID is required") UUID programmeId,
        @NotNull(message = "Organisation ID is required") UUID organisationId,
        @NotBlank(message = "Title is required")
                @Size(max = 255, message = "Title must not exceed 255 characters")
                String title,
        @Size(max = 5000, message = "Summary must not exceed 5000 characters") String summary,
        @Positive(message = "Requested amount must be positive") BigDecimal requestedAmount) {}
