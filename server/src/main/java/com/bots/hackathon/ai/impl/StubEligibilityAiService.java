package com.bots.hackathon.ai.impl;

import com.bots.hackathon.ai.EligibilityAiService;
import com.bots.hackathon.ai.dto.EligibilityAiRequest;
import com.bots.hackathon.ai.dto.EligibilityAiResponse;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StubEligibilityAiService implements EligibilityAiService {

    @Override
    public EligibilityAiResponse checkEligibility(EligibilityAiRequest request) {
        log.info("AI Eligibility check stub called for application: {}", request.applicationId());
        // TODO: Replace with actual AI integration
        return new EligibilityAiResponse(true, List.of(), "AI Suggested: Stub response", 0.0);
    }
}
