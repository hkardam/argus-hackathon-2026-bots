package com.bots.hackathon.eligibility.dto;

import jakarta.validation.constraints.NotBlank;

public record ClarificationRequest(@NotBlank String question, String flagReference) {}
