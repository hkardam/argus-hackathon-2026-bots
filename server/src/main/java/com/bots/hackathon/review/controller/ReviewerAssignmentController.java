package com.bots.hackathon.review.controller;

import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.review.dto.AssignReviewersRequest;
import com.bots.hackathon.review.dto.ReviewerDto;
import com.bots.hackathon.review.service.ReviewerAssignmentService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewerAssignmentController {

    private final ReviewerAssignmentService reviewerAssignmentService;

    @GetMapping("/reviewers/available")
    public ResponseEntity<List<ReviewerDto>> getAvailableReviewers(
            @RequestAttribute("userId") Long userId, @RequestAttribute("role") String role) {

        // Implicitly assuming Role.PROGRAM_OFFICER based check via guard/middleware
        // Or enforce here
        if (!Role.PROGRAM_OFFICER.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(reviewerAssignmentService.getAvailableReviewers());
    }

    @PostMapping("/applications/{id}/assign-reviewers")
    public ResponseEntity<Void> assignReviewers(
            @PathVariable UUID id,
            @RequestBody AssignReviewersRequest request,
            @RequestAttribute("userId") Long userId,
            @RequestAttribute("role") String role) {

        if (!Role.PROGRAM_OFFICER.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        reviewerAssignmentService.assignReviewers(id, request, userId);
        return ResponseEntity.ok().build();
    }
}
