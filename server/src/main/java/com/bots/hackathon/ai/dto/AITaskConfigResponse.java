package com.bots.hackathon.ai.dto;

public record AITaskConfigResponse(
        Long id,
        String taskCode,
        String taskName,
        String systemPrompt,
        LLMProviderEnum provider,
        String model,
        Integer maxTokens,
        Double temperature
) {}
