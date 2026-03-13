package com.bots.hackathon.ai.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatResponse {

    private String sessionId;

    private String reply;

    private Boolean gotToNextQuestion;

    private String nextMessage;

    private String nextField;

    private String formOutput;

    private int progressPercent;

    private boolean completed;
}
