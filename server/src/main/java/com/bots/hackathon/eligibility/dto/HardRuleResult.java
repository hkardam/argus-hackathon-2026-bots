package com.bots.hackathon.eligibility.dto;

public record HardRuleResult(
        String criterionCode, String criterionName, boolean passed, String explanation) {}
