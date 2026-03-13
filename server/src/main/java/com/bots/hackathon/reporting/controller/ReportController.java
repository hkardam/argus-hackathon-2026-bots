package com.bots.hackathon.reporting.controller;

import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
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
  private final UserRepository userRepository;

  @PostMapping
  @PreAuthorize("hasRole('APPLICANT')")
  public ResponseEntity<ApiResponse<ReportResponse>> submitReport(
      @Valid @RequestBody SubmitReportRequest request, Principal principal) {
    Long userId = resolveUserId(principal);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(reportService.submitReport(request, userId)));
  }

  @GetMapping("/{id}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<ReportResponse>> getById(@PathVariable UUID id) {
    // TODO: Verify user has access to this report's grant
    return ResponseEntity.ok(ApiResponse.ok(reportService.getById(id)));
  }

  @GetMapping("/grant/{grantAwardId}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<List<ReportResponse>>> getByGrant(
      @PathVariable UUID grantAwardId) {
    // TODO: Verify user has access to this grant
    return ResponseEntity.ok(ApiResponse.ok(reportService.getByGrantAwardId(grantAwardId)));
  }

  private Long resolveUserId(Principal principal) {
    return userRepository
        .findByEmail(principal.getName())
        .map(UserEntity::getId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
  }
}
