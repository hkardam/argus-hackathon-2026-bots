package com.bots.hackathon.ai.services;

import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;
import com.bots.hackathon.ai.services.Providers.ClaudeProvider;
import com.bots.hackathon.ai.services.Providers.GeminiProvider;
import com.bots.hackathon.ai.services.Providers.OpenAIProvider;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LLMService {
    private final GeminiProvider geminiProvider;
    private final ClaudeProvider claudeProvider;
    private final OpenAIProvider openAIProvider;

    @PostConstruct
    void init() {
    }

    public LLMResponse executeTask(LLMRequest request) {
        return switch (request.getProvider()) {
            case GEMINI -> geminiProvider.execute(request);
            case CLAUDE -> claudeProvider.execute(request);
            case OPEN_AI -> openAIProvider.execute(request);
        };
    }
}
