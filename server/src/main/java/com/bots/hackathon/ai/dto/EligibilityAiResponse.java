package com.bots.hackathon.ai.dto;

import java.util.List;

public record EligibilityAiResponse(
    boolean suggestedEligible,
    List<CriterionResult> criteriaResults,
    String summary,
    double confidenceScore) {

  public record CriterionResult(String criterion, boolean met, String explanation) {}
}
