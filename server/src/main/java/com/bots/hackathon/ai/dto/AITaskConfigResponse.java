package com.bots.hackathon.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AITaskConfigResponse {
    private Long id;
    private String taskCode;
    private String taskName;
    private String systemPrompt;
    private LLMProviderEnum provider;
    private String model;
    private Integer maxTokens;
    private Double temperature;
}
