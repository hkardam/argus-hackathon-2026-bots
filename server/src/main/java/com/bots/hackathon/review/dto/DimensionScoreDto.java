package com.bots.hackathon.review.dto;

public record DimensionScoreDto(
        String dimension, Integer score, Boolean override, String comment) {}
