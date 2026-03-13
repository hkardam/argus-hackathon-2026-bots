package com.bots.hackathon.ai.services;

import com.bots.hackathon.ai.dto.LLMProviderEnum;
import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;
import com.bots.hackathon.ai.services.Providers.LLMProvider;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LLMServiceImpl implements LLMService {

    private final List<LLMProvider> providers;
    private Map<LLMProviderEnum, LLMProvider> providerMap;

    @PostConstruct
    @Override
    public void init() {
        providerMap =
                providers.stream()
                        .collect(
                                Collectors.toMap(
                                        LLMProvider::getProviderType, Function.identity()));
    }

    @Override
    public LLMResponse executeTask(LLMRequest request) {
        LLMProviderEnum providerType = request.getProvider();
        if (providerType == null) {
            providerType = LLMProviderEnum.CLAUDE;
        }

        LLMProvider provider = providerMap.get(providerType);
        if (provider == null && !providers.isEmpty()) {
            provider = providers.get(0);
        }

        if (provider == null) {
            throw new IllegalStateException("No LLM Providers found.");
        }

        return provider.execute(request);
    }
}
