package com.bots.hackathon.eligibility.dto;

import jakarta.validation.constraints.NotBlank;

public record OverrideIneligibleRequest(@NotBlank String reason) {}
