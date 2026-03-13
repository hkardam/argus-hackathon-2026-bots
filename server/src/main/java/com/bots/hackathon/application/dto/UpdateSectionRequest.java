package com.bots.hackathon.application.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateSectionRequest(
        @NotBlank(message = "Section key is required") String sectionKey,
        @NotBlank(message = "Section data is required") String sectionData,
        Boolean isComplete) {}
