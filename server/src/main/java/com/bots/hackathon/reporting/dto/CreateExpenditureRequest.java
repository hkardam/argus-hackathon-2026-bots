package com.bots.hackathon.reporting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateExpenditureRequest(
        @NotNull(message = "Grant award ID is required") UUID grantAwardId,
        @NotBlank(message = "Category is required") String category,
        String description,
        @NotNull(message = "Amount is required") @Positive(message = "Amount must be positive")
                BigDecimal amount,
        @NotNull(message = "Expenditure date is required") LocalDate expenditureDate,
        UUID receiptDocumentId) {}
