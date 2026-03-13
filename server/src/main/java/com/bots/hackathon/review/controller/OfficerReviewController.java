package com.bots.hackathon.review.controller;

import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.review.dto.FinalDecisionRequest;
import com.bots.hackathon.review.dto.ReviewedApplicationDto;
import com.bots.hackathon.review.service.OfficerReviewService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OfficerReviewController {

    private final OfficerReviewService officerReviewService;

    @GetMapping("/applications/reviewed")
    public ResponseEntity<List<ReviewedApplicationDto>> getReviewedApplications(
            @RequestAttribute("role") String role) {

        if (!Role.PROGRAM_OFFICER.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(officerReviewService.getReviewedApplications());
    }

    @PatchMapping("/applications/{id}/final-decision")
    public ResponseEntity<Void> submitFinalDecision(
            @PathVariable UUID id,
            @RequestBody FinalDecisionRequest request,
            @RequestAttribute("userId") Long userId,
            @RequestAttribute("role") String role) {

        if (!Role.PROGRAM_OFFICER.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        officerReviewService.submitFinalDecision(id, request, userId);
        return ResponseEntity.ok().build();
    }
}
