package com.bots.hackathon.reporting.controller;

import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.reporting.dto.ReportResponse;
import com.bots.hackathon.reporting.dto.SubmitReportRequest;
import com.bots.hackathon.reporting.service.ReportService;
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
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<ReportResponse>> submitReport(
            @Valid @RequestBody SubmitReportRequest request, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(reportService.submitReport(request, userId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ReportResponse>> getById(
            @PathVariable UUID id, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(ApiResponse.ok(reportService.getById(id, userId)));
    }

    @GetMapping("/grant/{grantAwardId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getByGrant(
            @PathVariable UUID grantAwardId, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(reportService.getByGrantAwardId(grantAwardId, userId)));
    }
}