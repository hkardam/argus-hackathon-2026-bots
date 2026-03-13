package com.bots.hackathon.award.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ApproveAwardRequest(
        @NotNull UUID applicationId,
        @NotNull @Positive BigDecimal awardedAmount,
        LocalDate startDate,
        LocalDate endDate) {}
