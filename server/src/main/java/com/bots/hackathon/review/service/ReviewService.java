package com.bots.hackathon.review.service;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.bots.hackathon.common.exception.BusinessException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.notification.event.NotificationEventPublisher;
import com.bots.hackathon.review.dto.*;
import com.bots.hackathon.review.model.Review;
import com.bots.hackathon.review.model.ReviewAssignment;
import com.bots.hackathon.review.repo.ReviewAssignmentRepository;
import com.bots.hackathon.review.repo.ReviewRepository;
import com.bots.hackathon.security.guard.AuthorizationGuard;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewAssignmentRepository assignmentRepository;
    private final ReviewRepository reviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final AuthorizationGuard authorizationGuard;
    private final NotificationEventPublisher notificationEventPublisher;

    @Transactional
    @LoggableAction(actionType = "ASSIGN_REVIEWER", objectType = "REVIEW_ASSIGNMENT")
    public ReviewAssignmentResponse assignReviewer(
            AssignReviewerRequest request, Long assignedByUserId) {
        Application application =
                applicationRepository
                        .findByIdAndDeletedFalse(request.applicationId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Application", request.applicationId()));

        UserEntity reviewer =
                userRepository
                        .findById(request.reviewerUserId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User", request.reviewerUserId()));

        UserEntity applicant =
                userRepository
                        .findById(application.getApplicantUserId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User", application.getApplicantUserId()));

        if (!authorizationGuard.passesConflictOfInterestCheck(
                reviewer.getEmail(), applicant.getEmail())) {
            throw new BusinessException(
                    "Reviewer has a conflict of interest with the applicant "
                            + "(matching email domain)");
        }

        ReviewAssignment assignment =
                ReviewAssignment.builder()
                        .applicationId(request.applicationId())
                        .reviewerUserId(request.reviewerUserId())
                        .assignedByUserId(assignedByUserId)
                        .deadline(request.deadline())
                        .build();
        ReviewAssignment saved = assignmentRepository.save(assignment);

        notificationEventPublisher.onReviewAssigned(
                request.reviewerUserId(),
                request.applicationId().toString());

        return toAssignmentResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewAssignmentResponse> getAssignedApplications(Long reviewerUserId) {
        return assignmentRepository.findByReviewerUserIdAndIsCompletedFalse(reviewerUserId).stream()
                .map(this::toAssignmentResponse)
                .toList();
    }

    @Transactional
    @LoggableAction(
            actionType = "SUBMIT_REVIEW",
            objectType = "REVIEW",
            objectIdExpression = "#request.applicationId().toString()")
    public ReviewResponse submitReview(SubmitReviewRequest request, Long reviewerUserId) {
        Review review =
                Review.builder()
                        .applicationId(request.applicationId())
                        .reviewerUserId(reviewerUserId)
                        .assignmentId(request.assignmentId())
                        .score(request.score())
                        .outcome(request.outcome())
                        .comments(request.comments())
                        .build();

        Review saved = reviewRepository.save(review);

        if (request.assignmentId() != null) {
            assignmentRepository
                    .findById(request.assignmentId())
                    .ifPresent(
                            a -> {
                                a.setIsCompleted(true);
                                assignmentRepository.save(a);
                            });
        }

        return toReviewResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByApplication(UUID applicationId) {
        return reviewRepository.findByApplicationId(applicationId).stream()
                .map(this::toReviewResponse)
                .toList();
    }

    private ReviewAssignmentResponse toAssignmentResponse(ReviewAssignment a) {
        return new ReviewAssignmentResponse(
                a.getId(),
                a.getApplicationId(),
                a.getReviewerUserId(),
                a.getAssignedByUserId(),
                a.getIsCompleted(),
                a.getDeadline(),
                a.getCreatedAt());
    }

    private ReviewResponse toReviewResponse(Review r) {
        return new ReviewResponse(
                r.getId(),
                r.getApplicationId(),
                r.getReviewerUserId(),
                r.getAssignmentId(),
                r.getScore(),
                r.getOutcome(),
                r.getComments(),
                r.getAiSuggested(),
                r.getCreatedAt());
    }
}