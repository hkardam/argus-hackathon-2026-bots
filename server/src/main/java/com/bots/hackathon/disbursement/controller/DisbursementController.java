package com.bots.hackathon.disbursement.controller;

import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.common.enums.DisbursementStatus;
import com.bots.hackathon.disbursement.dto.CreateTrancheRequest;
import com.bots.hackathon.disbursement.dto.DisbursementTrancheResponse;
import com.bots.hackathon.disbursement.service.DisbursementService;
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
@RequestMapping("/api/tranches")
@RequiredArgsConstructor
public class DisbursementController {

    private final DisbursementService disbursementService;
    private final AuthService authService;

    /** Finance Officer creates a new disbursement tranche for an award. */
    @PostMapping
    @PreAuthorize("hasRole('FINANCE_OFFICER') or hasRole('PROGRAM_OFFICER')")
    public ResponseEntity<ApiResponse<DisbursementTrancheResponse>> createTranche(
            @Valid @RequestBody CreateTrancheRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(disbursementService.createTranche(request)));
    }

    /** Finance Officer updates tranche status (SCHEDULED → PENDING → RELEASED). */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<DisbursementTrancheResponse>> updateStatus(
            @PathVariable UUID id, @RequestParam DisbursementStatus status, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(disbursementService.updateStatus(id, status, userId)));
    }

    /** List tranches for a given grant award. */
    @GetMapping("/award/{grantAwardId}")
    @PreAuthorize("@securityGuard.isStaff() or hasRole('FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<List<DisbursementTrancheResponse>>> getByAward(
            @PathVariable UUID grantAwardId) {
        return ResponseEntity.ok(ApiResponse.ok(disbursementService.getByAward(grantAwardId)));
    }
}
