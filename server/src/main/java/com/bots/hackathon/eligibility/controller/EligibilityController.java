package com.bots.hackathon.eligibility.controller;

import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.eligibility.dto.ClarificationRequest;
import com.bots.hackathon.eligibility.dto.OverrideIneligibleRequest;
import com.bots.hackathon.eligibility.dto.ScreeningReportResponse;
import com.bots.hackathon.eligibility.service.EligibilityService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eligibility")
@RequiredArgsConstructor
public class EligibilityController {

    private final EligibilityService eligibilityService;
    private final AuthService authService;

    /** List all applications in the screening queue (SUBMITTED or UNDER_SCREENING). */
    @GetMapping("/queue")
    @PreAuthorize("hasRole('PROGRAM_OFFICER')")
    public ResponseEntity<ApiResponse<List<ScreeningReportResponse>>> listQueue() {
        return ResponseEntity.ok(ApiResponse.ok(eligibilityService.listScreeningQueue()));
    }

    /** Trigger eligibility screening for a specific application. */
    @PostMapping("/{applicationId}/run")
    @PreAuthorize("hasRole('PROGRAM_OFFICER')")
    public ResponseEntity<ApiResponse<ScreeningReportResponse>> runScreening(
            @PathVariable UUID applicationId, Principal principal) {
        Long officerId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(eligibilityService.runScreening(applicationId, officerId)));
    }

    /** Get the full screening report for an application. */
    @GetMapping("/{applicationId}/report")
    @PreAuthorize("hasRole('PROGRAM_OFFICER')")
    public ResponseEntity<ApiResponse<ScreeningReportResponse>> getReport(
            @PathVariable UUID applicationId) {
        return ResponseEntity.ok(ApiResponse.ok(eligibilityService.getReport(applicationId)));
    }

    /**
     * Program Officer confirms the application as eligible — advances to review queue. PRD 3.4:
     * Confirm Eligible action.
     */
    @PostMapping("/{applicationId}/confirm-eligible")
    @PreAuthorize("hasRole('PROGRAM_OFFICER')")
    public ResponseEntity<ApiResponse<ScreeningReportResponse>> confirmEligible(
            @PathVariable UUID applicationId, Principal principal) {
        Long officerId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(eligibilityService.confirmEligible(applicationId, officerId)));
    }

    /**
     * Program Officer overrides to ineligible — written reason mandatory. PRD 3.4: Override to
     * Ineligible action.
     */
    @PostMapping("/{applicationId}/override-ineligible")
    @PreAuthorize("hasRole('PROGRAM_OFFICER')")
    public ResponseEntity<ApiResponse<ScreeningReportResponse>> overrideIneligible(
            @PathVariable UUID applicationId,
            @Valid @RequestBody OverrideIneligibleRequest request,
            Principal principal) {
        Long officerId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(
                        eligibilityService.overrideIneligible(applicationId, request, officerId)));
    }

    /**
     * Program Officer sends a clarification request to the applicant. PRD 3.4: Send Clarification
     * Request action.
     */
    @PostMapping("/{applicationId}/clarification")
    @PreAuthorize("hasRole('PROGRAM_OFFICER')")
    public ResponseEntity<ApiResponse<Void>> sendClarification(
            @PathVariable UUID applicationId,
            @Valid @RequestBody ClarificationRequest request,
            Principal principal) {
        Long officerId = authService.resolveUserId(principal);
        eligibilityService.sendClarification(applicationId, request, officerId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
