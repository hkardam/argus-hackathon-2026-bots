package com.bots.hackathon.organisation.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record OrganisationResponse(
        UUID id,
        String name,
        String registrationNumber,
        String address,
        String contactEmail,
        String contactPhone,
        Long ownerUserId,
        Boolean isVerified,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}
