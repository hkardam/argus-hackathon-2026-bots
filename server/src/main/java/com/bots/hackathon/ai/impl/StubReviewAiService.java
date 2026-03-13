package com.bots.hackathon.ai.impl;

import com.bots.hackathon.ai.ReviewAiService;
import com.bots.hackathon.ai.dto.ReviewAiRequest;
import com.bots.hackathon.ai.dto.ReviewAiResponse;
import com.bots.hackathon.common.enums.ReviewOutcome;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StubReviewAiService implements ReviewAiService {

    @Override
    public ReviewAiResponse generateReviewSuggestion(ReviewAiRequest request) {
        log.info("AI Review suggestion stub called for application: {}", request.applicationId());
        // TODO: Replace with actual AI integration
        return new ReviewAiResponse(
                0,
                ReviewOutcome.NEEDS_REVISION,
                "AI Suggested: Stub strengths",
                "AI Suggested: Stub weaknesses",
                "AI Suggested: Stub comments");
    }
}
