package com.bots.hackathon.auth.controller;

import com.bots.hackathon.auth.dto.AdminUserRequest;
import com.bots.hackathon.auth.dto.UserDto;
import com.bots.hackathon.auth.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PLATFORM_ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody AdminUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminUserService.createUser(request));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        adminUserService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }
}
