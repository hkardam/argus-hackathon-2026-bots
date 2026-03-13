package com.bots.hackathon.review.dto;

public record FinalDecisionRequest(
        String decision, // "APPROVE", "REJECT", "WAITLIST"
        String reason) {}
