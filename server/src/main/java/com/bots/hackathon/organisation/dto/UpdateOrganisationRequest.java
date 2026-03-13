package com.bots.hackathon.organisation.dto;

import com.bots.hackathon.organisation.model.OrganisationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record UpdateOrganisationRequest(
    String name,
    String registrationNumber,
    OrganisationType organisationType,
    Integer yearEstablished,
    String state,
    String contactPerson,
    @Email(message = "Invalid email format") String contactEmail,
    String contactPhone,
    @Positive(message = "Annual budget must be a positive number") BigDecimal annualBudget,
    String address) {}
