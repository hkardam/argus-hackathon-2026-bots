package com.bots.hackathon.ai.dto;

public record AITaskConfigRequest(
        String taskCode,
        String taskName,
        String systemPrompt,
        LLMProviderEnum provider,
        String model,
        Integer maxTokens,
        Double temperature
) {}
