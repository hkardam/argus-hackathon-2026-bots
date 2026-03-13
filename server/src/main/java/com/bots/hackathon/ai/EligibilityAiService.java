package com.bots.hackathon.ai;

import com.bots.hackathon.ai.dto.EligibilityAiRequest;
import com.bots.hackathon.ai.dto.EligibilityAiResponse;

public interface EligibilityAiService {

    /**
     * AI-suggested eligibility check. Results are advisory only — a human must confirm or override.
     * Output must be labelled "AI Suggested".
     */
    EligibilityAiResponse checkEligibility(EligibilityAiRequest request);
}
