package com.bots.hackathon.disbursement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateTrancheRequest(
        @NotNull UUID grantAwardId,
        @NotNull Integer trancheNumber,
        @NotNull @Positive BigDecimal amount,
        @NotNull LocalDate scheduledDate,
        String notes) {}
