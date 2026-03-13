package com.bots.hackathon.eligibility.dto;

import com.bots.hackathon.common.enums.RiskLevel;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ScreeningReportResponse(
        UUID reportId,
        UUID applicationId,
        String applicationTitle,
        String programmeName,
        boolean hardRulesPassed,
        List<HardRuleResult> hardRuleResults,
        List<SoftFlag> softFlags,
        RiskLevel overallRiskLevel,
        String aiSummary,
        boolean aiSuggested,
        boolean isReviewed,
        LocalDateTime createdAt) {}
