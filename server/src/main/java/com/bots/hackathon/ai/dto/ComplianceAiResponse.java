package com.bots.hackathon.ai.dto;

import com.bots.hackathon.common.enums.ComplianceStatus;
import java.util.List;

public record ComplianceAiResponse(
        ComplianceStatus suggestedStatus, List<Finding> findings, String summary) {

    public record Finding(String area, String issue, String recommendation) {}
}
