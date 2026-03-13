package com.bots.hackathon.auth.dto;

import com.bots.hackathon.auth.model.Role;
import java.time.LocalDateTime;

public record UserDto(
        Long id,
        String name,
        String email,
        String oauth2ProviderId,
        Role role,
        LocalDateTime createdAt) {}
