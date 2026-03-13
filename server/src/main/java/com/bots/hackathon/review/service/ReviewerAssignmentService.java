package com.bots.hackathon.review.service;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.bots.hackathon.common.enums.ApplicationStatus;
import com.bots.hackathon.common.enums.GrantType;
import com.bots.hackathon.grant.model.GrantProgramme;
import com.bots.hackathon.grant.repo.GrantProgrammeRepository;
import com.bots.hackathon.review.dto.AssignReviewersRequest;
import com.bots.hackathon.review.dto.ReviewerDto;
import com.bots.hackathon.review.model.ReviewAssignment;
import com.bots.hackathon.review.repo.ReviewAssignmentRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewerAssignmentService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final GrantProgrammeRepository grantProgrammeRepository;
    private final ReviewAssignmentRepository reviewAssignmentRepository;
    private final ReviewPackageService reviewPackageService;

    public List<ReviewerDto> getAvailableReviewers() {
        return userRepository.findAll().stream()
                .filter(
                        user ->
                                Role.REVIEWER.equals(user.getRole())
                                        && Boolean.TRUE.equals(user.getIsActive()))
                .map(user -> new ReviewerDto(user.getId(), user.getName(), user.getEmail()))
                .toList();
    }

    @Transactional
    public void assignReviewers(
            UUID applicationId, AssignReviewersRequest request, Long assignedByUserId) {
        Application application =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (!ApplicationStatus.ELIGIBLE.equals(application.getStatus())) {
            throw new IllegalStateException("Application must be in ELIGIBLE state");
        }

        GrantProgramme programme =
                grantProgrammeRepository
                        .findById(application.getProgrammeId())
                        .orElseThrow(() -> new IllegalArgumentException("Programme not found"));

        if (!validateReviewerCount(programme.getGrantType(), request.reviewerIds().size())) {
            throw new IllegalArgumentException("Invalid reviewer count for grant type");
        }

        UserEntity applicant =
                userRepository
                        .findById(application.getApplicantUserId())
                        .orElseThrow(() -> new IllegalArgumentException("Applicant not found"));

        String applicantDomain = extractDomain(applicant.getEmail());

        for (Long reviewerId : request.reviewerIds()) {
            if (reviewAssignmentRepository.existsByApplicationIdAndReviewerUserId(
                    applicationId, reviewerId)) {
                throw new IllegalArgumentException("Reviewer already assigned");
            }

            UserEntity reviewer =
                    userRepository
                            .findById(reviewerId)
                            .orElseThrow(
                                    () ->
                                            new IllegalArgumentException(
                                                    "Reviewer not found: " + reviewerId));

            if (!Role.REVIEWER.equals(reviewer.getRole())) {
                throw new IllegalArgumentException("User " + reviewerId + " is not a reviewer");
            }

            String reviewerDomain = extractDomain(reviewer.getEmail());
            if (applicantDomain.equalsIgnoreCase(reviewerDomain)) {
                throw new IllegalStateException(
                        "Conflict of Interest: Reviewer domain matches applicant domain");
            }

            ReviewAssignment assignment =
                    ReviewAssignment.builder()
                            .applicationId(applicationId)
                            .reviewerUserId(reviewerId)
                            .assignedByUserId(assignedByUserId)
                            .deadline(calculateSlaDeadline(programme.getGrantType()))
                            .build();
            reviewAssignmentRepository.save(assignment);
        }

        application.setStatus(ApplicationStatus.UNDER_REVIEW);
        application.setSlaDeadline(calculateSlaDeadline(programme.getGrantType()));
        applicationRepository.save(application);

        // Generate AI Review Package
        reviewPackageService.generate(applicationId);
    }

    private boolean validateReviewerCount(GrantType grantType, int count) {
        if ("CDG".equals(grantType.name()) || "ECAG".equals(grantType.name())) {
            return count == 1;
        } else if ("EIG".equals(grantType.name())) {
            return count == 2;
        }
        // Fallback for default
        return count > 0;
    }

    private String extractDomain(String email) {
        if (email == null || !email.contains("@")) return "";
        return email.substring(email.indexOf("@") + 1);
    }

    private LocalDateTime calculateSlaDeadline(GrantType grantType) {
        return LocalDateTime.now().plusDays(14); // Example default SLA
    }
}
