package com.bots.hackathon.organisation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateOrganisationRequest(
    @NotBlank(message = "Name is required") String name,
    String registrationNumber,
    String address,
    @Email(message = "Invalid email") String contactEmail,
    String contactPhone) {}
