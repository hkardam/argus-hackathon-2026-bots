package com.bots.hackathon.messaging.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record CreateThreadRequest(@NotBlank String subject, UUID applicationId) {}
