package com.bots.hackathon.ai;

import com.bots.hackathon.ai.dto.ReviewAiRequest;
import com.bots.hackathon.ai.dto.ReviewAiResponse;

public interface ReviewAiService {

  /**
   * AI-assisted review suggestions. AI cannot approve or reject — only provide advisory
   * recommendations. Output must be labelled "AI Suggested".
   */
  ReviewAiResponse generateReviewSuggestion(ReviewAiRequest request);
}
