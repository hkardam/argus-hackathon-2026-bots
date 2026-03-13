package com.bots.hackathon.ai.dto;

import com.bots.hackathon.common.enums.RiskLevel;
import java.util.List;

public record ScreeningAiResponse(RiskLevel overallRiskLevel, List<Flag> flags, String summary) {

    public record Flag(String type, String description, RiskLevel severity) {}
}
