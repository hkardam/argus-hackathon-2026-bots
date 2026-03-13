package com.bots.hackathon.review.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssignReviewerRequest(
    @NotNull(message = "Application ID is required") UUID applicationId,
    @NotNull(message = "Reviewer user ID is required") Long reviewerUserId,
    LocalDateTime deadline) {}
