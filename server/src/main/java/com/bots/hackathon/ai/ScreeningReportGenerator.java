package com.bots.hackathon.ai;

import com.bots.hackathon.ai.dto.ScreeningAiRequest;
import com.bots.hackathon.ai.dto.ScreeningAiResponse;

public interface ScreeningReportGenerator {

  /**
   * Generates AI screening report with risk flags. Soft flags cannot auto-reject. Results are
   * advisory only — must be reviewed by a human. Output must be labelled "AI Suggested".
   */
  ScreeningAiResponse generateScreeningReport(ScreeningAiRequest request);
}
