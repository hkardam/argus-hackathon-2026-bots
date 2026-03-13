package com.bots.hackathon.auth.controller;

import com.bots.hackathon.auth.dto.UserDto;
import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        return authService
                .findCurrentUser()
                .map(user -> ResponseEntity.ok(ApiResponse.ok(authService.toDto(user))))
                .orElse(ResponseEntity.status(401).body(ApiResponse.error("Not authenticated")));
    }
}
