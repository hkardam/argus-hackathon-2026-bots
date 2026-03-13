package com.bots.hackathon.review.controller;

import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.review.dto.*;
import com.bots.hackathon.review.service.ReviewService;
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
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

  private final ReviewService reviewService;
  private final UserRepository userRepository;

  @PostMapping("/assignments")
  @PreAuthorize("hasRole('PROGRAM_OFFICER') or @securityGuard.isPlatformAdmin()")
  public ResponseEntity<ApiResponse<ReviewAssignmentResponse>> assignReviewer(
      @Valid @RequestBody AssignReviewerRequest request, Principal principal) {
    Long assignedBy = resolveUserId(principal);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(reviewService.assignReviewer(request, assignedBy)));
  }

  @GetMapping("/assignments/me")
  @PreAuthorize("hasRole('REVIEWER')")
  public ResponseEntity<ApiResponse<List<ReviewAssignmentResponse>>> getMyAssignments(
      Principal principal) {
    Long userId = resolveUserId(principal);
    return ResponseEntity.ok(ApiResponse.ok(reviewService.getAssignedApplications(userId)));
  }

  @PostMapping
  @PreAuthorize("hasRole('REVIEWER')")
  public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
      @Valid @RequestBody SubmitReviewRequest request, Principal principal) {
    Long reviewerUserId = resolveUserId(principal);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(reviewService.submitReview(request, reviewerUserId)));
  }

  @GetMapping("/application/{applicationId}")
  @PreAuthorize("@securityGuard.isStaff() or hasRole('REVIEWER')")
  public ResponseEntity<ApiResponse<List<ReviewResponse>>> getByApplication(
      @PathVariable UUID applicationId) {
    return ResponseEntity.ok(ApiResponse.ok(reviewService.getReviewsByApplication(applicationId)));
  }

  private Long resolveUserId(Principal principal) {
    return userRepository
        .findByEmail(principal.getName())
        .map(UserEntity::getId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
  }
}
