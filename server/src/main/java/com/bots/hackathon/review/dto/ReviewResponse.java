package com.bots.hackathon.review.dto;

import com.bots.hackathon.common.enums.ReviewOutcome;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewResponse(
        UUID id,
        UUID applicationId,
        Long reviewerUserId,
        UUID assignmentId,
        Integer score,
        ReviewOutcome outcome,
        String comments,
        Boolean aiSuggested,
        LocalDateTime createdAt) {}
