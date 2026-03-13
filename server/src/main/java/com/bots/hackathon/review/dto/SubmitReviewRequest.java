package com.bots.hackathon.review.dto;

import com.bots.hackathon.common.enums.ReviewOutcome;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record SubmitReviewRequest(
        @NotNull(message = "Application ID is required") UUID applicationId,
        UUID assignmentId,
        @Min(value = 0, message = "Score must be at least 0")
                @Max(value = 100, message = "Score must not exceed 100")
                Integer score,
        @NotNull(message = "Outcome is required") ReviewOutcome outcome,
        @Size(max = 10000, message = "Comments must not exceed 10000 characters")
                String comments) {}
