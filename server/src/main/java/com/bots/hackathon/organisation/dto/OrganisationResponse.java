package com.bots.hackathon.organisation.dto;

import com.bots.hackathon.organisation.model.OrganisationType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record OrganisationResponse(
    UUID id,
    String name,
    String registrationNumber,
    OrganisationType organisationType,
    Integer yearEstablished,
    String state,
    String contactPerson,
    String contactEmail,
    String contactPhone,
    BigDecimal annualBudget,
    String address,
    Long ownerUserId,
    Boolean isVerified,
    int completionPercentage,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {}
