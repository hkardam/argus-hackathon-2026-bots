package com.bots.hackathon.ai.dto;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

public record EligibilityAiRequest(
    UUID applicationId,
    UUID programmeId,
    Map<String, String> sectionData,
    BigDecimal requestedAmount,
    Map<String, Object> programmeCriteria) {}
