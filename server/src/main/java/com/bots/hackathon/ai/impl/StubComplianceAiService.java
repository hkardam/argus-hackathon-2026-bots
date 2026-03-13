package com.bots.hackathon.ai.impl;

import com.bots.hackathon.ai.ComplianceAiService;
import com.bots.hackathon.ai.dto.ComplianceAiRequest;
import com.bots.hackathon.ai.dto.ComplianceAiResponse;
import com.bots.hackathon.common.enums.ComplianceStatus;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StubComplianceAiService implements ComplianceAiService {

    @Override
    public ComplianceAiResponse analyzeCompliance(ComplianceAiRequest request) {
        log.info("AI Compliance analysis stub called for grant: {}", request.grantAwardId());
        // TODO: Replace with actual AI integration
        return new ComplianceAiResponse(
                ComplianceStatus.UNDER_REVIEW, List.of(), "AI Suggested: Stub response");
    }
}
