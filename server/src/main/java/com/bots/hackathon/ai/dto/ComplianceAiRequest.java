package com.bots.hackathon.ai.dto;

import java.util.List;
import java.util.UUID;

public record ComplianceAiRequest(
        UUID grantAwardId, String reportContent, List<ExpenditureSummary> expenditures) {

    public record ExpenditureSummary(String category, String amount, String date) {}
}
