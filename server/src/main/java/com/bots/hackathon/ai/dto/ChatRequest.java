package com.bots.hackathon.ai.dto;

import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {

    private String sessionId;

    private String message;

    private Map<String, Object> metadata;
}
