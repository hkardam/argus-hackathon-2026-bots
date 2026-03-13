package com.bots.hackathon.organisation.dto;

import jakarta.validation.constraints.Email;

public record UpdateOrganisationRequest(
    String name,
    String registrationNumber,
    String address,
    @Email(message = "Invalid email") String contactEmail,
    String contactPhone) {}
