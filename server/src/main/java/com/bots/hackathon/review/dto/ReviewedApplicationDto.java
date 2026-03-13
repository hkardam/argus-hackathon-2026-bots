package com.bots.hackathon.review.dto;

import com.bots.hackathon.review.model.Review;
import com.bots.hackathon.review.model.RiskFlag;
import java.util.List;
import java.util.UUID;

public record ReviewedApplicationDto(
        UUID applicationId,
        String grantType,
        Double compositeScore,
        List<Review> reviews,
        List<RiskFlag> riskFlags) {}
