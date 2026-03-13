package com.bots.hackathon.review.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewAssignmentResponse(
    UUID id,
    UUID applicationId,
    Long reviewerUserId,
    Long assignedByUserId,
    Boolean isCompleted,
    LocalDateTime deadline,
    LocalDateTime createdAt) {}
