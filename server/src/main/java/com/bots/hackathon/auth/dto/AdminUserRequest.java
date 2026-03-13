package com.bots.hackathon.auth.dto;

import com.bots.hackathon.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminUserRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 8) String password,
        @NotNull Role role) {}
