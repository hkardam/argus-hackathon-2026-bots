package com.bots.hackathon.review.dto;

import java.util.List;

public record SaveReviewRequest(
        List<DimensionScoreDto> dimensionScores, List<HighlightDto> highlights) {}
