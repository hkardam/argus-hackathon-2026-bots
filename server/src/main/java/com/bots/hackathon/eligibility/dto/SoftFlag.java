package com.bots.hackathon.eligibility.dto;

import com.bots.hackathon.common.enums.RiskLevel;

public record SoftFlag(String type, String description, RiskLevel severity, boolean aiSuggested) {}
