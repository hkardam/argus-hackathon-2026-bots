package com.bots.hackathon.ai.services;

import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;

public interface LLMService {
    void init();

    LLMResponse executeTask(LLMRequest request);
}
