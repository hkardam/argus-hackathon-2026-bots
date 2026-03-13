package com.bots.hackathon.ai.dto;

import java.util.Map;
import java.util.UUID;

public record ReviewAiRequest(
    UUID applicationId, Map<String, String> applicationData, String programmeCriteria) {}
