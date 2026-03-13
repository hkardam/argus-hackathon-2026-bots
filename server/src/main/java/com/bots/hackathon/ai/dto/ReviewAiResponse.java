package com.bots.hackathon.ai.dto;

import com.bots.hackathon.common.enums.ReviewOutcome;

public record ReviewAiResponse(
    int suggestedScore,
    ReviewOutcome suggestedOutcome,
    String strengths,
    String weaknesses,
    String overallComments) {}
