package com.bots.hackathon.ai.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LLMRequest {
    private String userPrompt;
    private String systemPrompt;
    private String userContextText;
    private List<String> userContextFiles;
    private LLMProviderEnum provider;
    private String model;
    private Integer maxTokens;
    private Double temperature;
}
