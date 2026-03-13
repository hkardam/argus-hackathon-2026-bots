package com.bots.hackathon.reporting.dto;

import com.bots.hackathon.common.enums.VerificationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateVerificationRequest(
        @NotNull(message = "Verification status is required")
                VerificationStatus verificationStatus) {}
