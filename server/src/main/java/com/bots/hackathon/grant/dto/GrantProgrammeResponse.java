package com.bots.hackathon.grant.dto;

import com.bots.hackathon.common.enums.GrantType;
import com.bots.hackathon.common.enums.WorkflowStage;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record GrantProgrammeResponse(
        UUID id,
        String name,
        String description,
        GrantType grantType,
        BigDecimal totalBudget,
        BigDecimal maxAwardAmount,
        LocalDate applicationOpenDate,
        LocalDate applicationCloseDate,
        WorkflowStage currentStage,
        Boolean isActive) {}
