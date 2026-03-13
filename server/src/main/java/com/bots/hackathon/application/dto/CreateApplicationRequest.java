package com.bots.hackathon.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateApplicationRequest(
    @NotNull(message = "Programme ID is required") UUID programmeId,
    @NotNull(message = "Organisation ID is required") UUID organisationId,
    @NotBlank(message = "Title is required") String title,
    String summary,
    BigDecimal requestedAmount) {}
