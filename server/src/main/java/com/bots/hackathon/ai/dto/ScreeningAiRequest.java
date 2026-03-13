package com.bots.hackathon.ai.dto;

import java.util.Map;
import java.util.UUID;

public record ScreeningAiRequest(
        UUID applicationId, String organisationName, Map<String, String> applicationData) {}
