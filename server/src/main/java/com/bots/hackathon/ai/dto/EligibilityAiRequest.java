package com.bots.hackathon.ai.dto;

import java.util.Map;
import java.util.UUID;

public record EligibilityAiRequest(UUID programmeId, UUID applicantId, Map<String, Object> data) {}
