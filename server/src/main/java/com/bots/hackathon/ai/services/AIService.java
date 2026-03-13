package com.bots.hackathon.ai.services;

import org.springframework.stereotype.Service;

import com.bots.hackathon.ai.dto.AITaskConfigResponse;
import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIService {
    private final AITaskConfigService aiTaskConfigService;
    private final LLMService llmService;

    public LLMResponse eligibiltyScreening() {
        AITaskConfigResponse config = aiTaskConfigService.getByTaskCode("ELIGIBILITY_SCREENING");
        LLMRequest request = new LLMRequest();
        request.setSystemPrompt(config.getSystemPrompt());

        // TODO: get from params
        request.setUserContextText(null);
        request.setUserContextFiles(null);

        request.setModel(config.getModel());
        request.setMaxTokens(config.getMaxTokens());
        request.setTemperature(config.getTemperature());
        return llmService.executeTask(request);
    }

    public LLMResponse reviewPackage() {
        AITaskConfigResponse config = aiTaskConfigService.getByTaskCode("REVIEW_PACKAGE");
        LLMRequest request = new LLMRequest();
        request.setSystemPrompt(config.getSystemPrompt());

        // TODO: get from params
        request.setUserContextText(null);
        request.setUserContextFiles(null);

        request.setModel(config.getModel());
        request.setMaxTokens(config.getMaxTokens());
        request.setTemperature(config.getTemperature());
        return llmService.executeTask(request);
    }

    public LLMResponse complianceAnalysis() {
        AITaskConfigResponse config = aiTaskConfigService.getByTaskCode("COMPLIANCE_ANALYSIS");
        LLMRequest request = new LLMRequest();
        request.setSystemPrompt(config.getSystemPrompt());

        // TODO: get from params
        request.setUserContextText(null);
        request.setUserContextFiles(null);

        request.setModel(config.getModel());
        request.setMaxTokens(config.getMaxTokens());
        request.setTemperature(config.getTemperature());
        return llmService.executeTask(request);
    }
}
