package com.bots.hackathon.ai.services.Providers;

import com.bots.hackathon.ai.dto.LLMProviderEnum;
import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;

public interface LLMProvider {
    LLMResponse execute(LLMRequest request);

    LLMProviderEnum getProviderType();
}
