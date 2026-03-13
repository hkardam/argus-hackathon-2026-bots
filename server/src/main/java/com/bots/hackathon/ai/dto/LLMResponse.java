package com.bots.hackathon.ai.dto;

public class LLMResponse {

    private String output;
    private Integer tokensUsed;
    private Long timespent;

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public Integer getTokensUsed() {
        return tokensUsed;
    }

    public void setTokensUsed(Integer tokensUsed) {
        this.tokensUsed = tokensUsed;
    }

    public Long getTimespent() {
        return timespent;
    }

    public void setTimespent(Long timespent) {
        this.timespent = timespent;
    }
}
