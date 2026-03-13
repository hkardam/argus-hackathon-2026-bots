package com.bots.hackathon.reporting.controller;

import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.reporting.dto.CreateExpenditureRequest;
import com.bots.hackathon.reporting.dto.ExpenditureRecordResponse;
import com.bots.hackathon.reporting.dto.UpdateVerificationRequest;
import com.bots.hackathon.reporting.service.ExpenditureService;
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
@RequestMapping("/api/expenditures")
@RequiredArgsConstructor
public class ExpenditureController {

    private final ExpenditureService expenditureService;
    private final AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<ExpenditureRecordResponse>> create(
            @Valid @RequestBody CreateExpenditureRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(expenditureService.create(request)));
    }

    @PatchMapping("/{id}/verification")
    @PreAuthorize("hasRole('FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<ExpenditureRecordResponse>> updateVerification(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVerificationRequest request,
            Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(expenditureService.updateVerificationStatus(id, request, userId)));
    }

    @GetMapping("/grant/{grantAwardId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ExpenditureRecordResponse>>> listByGrant(
            @PathVariable UUID grantAwardId, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(expenditureService.listByGrantAwardId(grantAwardId, userId)));
    }
}