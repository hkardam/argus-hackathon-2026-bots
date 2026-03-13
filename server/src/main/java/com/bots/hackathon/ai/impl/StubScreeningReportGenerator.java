package com.bots.hackathon.ai.impl;

import com.bots.hackathon.ai.ScreeningReportGenerator;
import com.bots.hackathon.ai.dto.ScreeningAiRequest;
import com.bots.hackathon.ai.dto.ScreeningAiResponse;
import com.bots.hackathon.common.enums.RiskLevel;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StubScreeningReportGenerator implements ScreeningReportGenerator {

  @Override
  public ScreeningAiResponse generateScreeningReport(ScreeningAiRequest request) {
    log.info("AI Screening report stub called for application: {}", request.applicationId());
    // TODO: Replace with actual AI integration
    return new ScreeningAiResponse(RiskLevel.LOW, List.of(), "AI Suggested: Stub response");
  }
}
