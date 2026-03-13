package com.bots.hackathon.review.controller;

import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.review.dto.ReviewPackageResponse;
import com.bots.hackathon.review.dto.SaveReviewRequest;
import com.bots.hackathon.review.service.ReviewWorkspaceService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewWorkspaceController {

    private final ReviewWorkspaceService reviewWorkspaceService;

    @GetMapping("/applications/{id}/review-package")
    public ResponseEntity<ReviewPackageResponse> getReviewPackage(
            @PathVariable UUID id,
            @RequestAttribute("userId") Long userId,
            @RequestAttribute("role") String role) {

        if (!Role.REVIEWER.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(reviewWorkspaceService.getReviewPackage(id, userId));
    }

    @PostMapping("/reviews/{applicationId}/save")
    public ResponseEntity<Void> saveReview(
            @PathVariable UUID applicationId,
            @RequestBody SaveReviewRequest request,
            @RequestAttribute("userId") Long userId,
            @RequestAttribute("role") String role) {

        if (!Role.REVIEWER.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        reviewWorkspaceService.saveReview(applicationId, userId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reviews/{applicationId}/submit")
    public ResponseEntity<Void> submitReview(
            @PathVariable UUID applicationId,
            @RequestAttribute("userId") Long userId,
            @RequestAttribute("role") String role) {

        if (!Role.REVIEWER.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        reviewWorkspaceService.submitReview(applicationId, userId);
        return ResponseEntity.ok().build();
    }
}
