package com.bots.hackathon.review.dto;

import com.bots.hackathon.common.enums.ReviewOutcome;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SubmitReviewRequest(
        @NotNull(message = "Application ID is required") UUID applicationId,
        UUID assignmentId,
        Integer score,
        @NotNull(message = "Outcome is required") ReviewOutcome outcome,
        String comments) {}
