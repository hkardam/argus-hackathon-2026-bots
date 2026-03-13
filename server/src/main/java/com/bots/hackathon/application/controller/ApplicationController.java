package com.bots.hackathon.application.controller;

import com.bots.hackathon.application.dto.ApplicationResponse;
import com.bots.hackathon.application.dto.CreateApplicationRequest;
import com.bots.hackathon.application.dto.UpdateSectionRequest;
import com.bots.hackathon.application.service.ApplicationService;
import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.common.dto.ApiResponse;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> createDraft(
            @Valid @RequestBody CreateApplicationRequest request, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        ApplicationResponse response = applicationService.createDraft(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/sections")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<Void>> updateSection(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSectionRequest request,
            Principal principal) {
        Long userId = authService.resolveUserId(principal);
        applicationService.updateSection(id, request, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submit(
            @PathVariable UUID id, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(ApiResponse.ok(applicationService.submit(id, userId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@securityGuard.canAccessApplication(#id)")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getById(id)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> listMyApplications(
            Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(ApiResponse.ok(applicationService.listByApplicant(userId)));
    }

    @GetMapping("/programme/{programmeId}")
    @PreAuthorize("@securityGuard.isStaff()")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> listByProgramme(
            @PathVariable UUID programmeId) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.listByProgramme(programmeId)));
    }
}