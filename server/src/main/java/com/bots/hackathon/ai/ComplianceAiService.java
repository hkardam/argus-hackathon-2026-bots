package com.bots.hackathon.ai;

import com.bots.hackathon.ai.dto.ComplianceAiRequest;
import com.bots.hackathon.ai.dto.ComplianceAiResponse;

public interface ComplianceAiService {

  /**
   * AI-assisted compliance analysis. Results are advisory only — a human must confirm or override.
   * Output must be labelled "AI Suggested".
   */
  ComplianceAiResponse analyzeCompliance(ComplianceAiRequest request);
}
