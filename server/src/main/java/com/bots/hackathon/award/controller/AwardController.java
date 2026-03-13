package com.bots.hackathon.award.controller;

import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.award.dto.ApproveAwardRequest;
import com.bots.hackathon.award.dto.GrantAwardResponse;
import com.bots.hackathon.award.service.AwardService;
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
@RequestMapping("/api/awards")
@RequiredArgsConstructor
public class AwardController {

    private final AwardService awardService;
    private final AuthService authService;

    /** Officer approves an award for a reviewed application. */
    @PostMapping
    @PreAuthorize("hasRole('PROGRAM_OFFICER')")
    public ResponseEntity<ApiResponse<GrantAwardResponse>> approveAward(
            @Valid @RequestBody ApproveAwardRequest request, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(awardService.approveAward(request, userId)));
    }

    /** Get award for a specific application. */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("@securityGuard.isStaff() or hasRole('FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<GrantAwardResponse>> getByApplication(
            @PathVariable UUID applicationId) {
        return ResponseEntity.ok(ApiResponse.ok(awardService.getByApplicationId(applicationId)));
    }

    /** Get award by its own ID. */
    @GetMapping("/{id}")
    @PreAuthorize("@securityGuard.isStaff() or hasRole('FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<GrantAwardResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(awardService.getById(id)));
    }

    /** List awards for an organisation (visible to staff and finance). */
    @GetMapping("/organisation/{organisationId}")
    @PreAuthorize("@securityGuard.isStaff() or hasRole('FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<List<GrantAwardResponse>>> getByOrganisation(
            @PathVariable UUID organisationId) {
        return ResponseEntity.ok(ApiResponse.ok(awardService.getByOrganisation(organisationId)));
    }
}
