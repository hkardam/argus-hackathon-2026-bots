package com.bots.hackathon.reporting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateExpenditureRequest(
        @NotNull(message = "Grant award ID is required") UUID grantAwardId,
        @NotBlank(message = "Category is required") String category,
        String description,
        @NotNull(message = "Amount is required") BigDecimal amount,
        @NotNull(message = "Expenditure date is required") LocalDate expenditureDate,
        UUID receiptDocumentId) {}
