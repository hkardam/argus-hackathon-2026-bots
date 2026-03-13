package com.bots.hackathon.ai.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LLMResponse {
    private String output;
    private Integer tokensUsed;
    private Long timespent;
}
