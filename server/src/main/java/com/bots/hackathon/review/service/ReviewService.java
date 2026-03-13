package com.bots.hackathon.review.service;

import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.review.dto.*;
import com.bots.hackathon.review.model.Review;
import com.bots.hackathon.review.model.ReviewAssignment;
import com.bots.hackathon.review.repo.ReviewAssignmentRepository;
import com.bots.hackathon.review.repo.ReviewRepository;
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

  @Transactional
  @LoggableAction(actionType = "ASSIGN_REVIEWER", objectType = "REVIEW_ASSIGNMENT")
  public ReviewAssignmentResponse assignReviewer(
      AssignReviewerRequest request, Long assignedByUserId) {
    // TODO: Check conflict of interest via AuthorizationGuard
    ReviewAssignment assignment =
        ReviewAssignment.builder()
            .applicationId(request.applicationId())
            .reviewerUserId(request.reviewerUserId())
            .assignedByUserId(assignedByUserId)
            .deadline(request.deadline())
            .build();
    return toAssignmentResponse(assignmentRepository.save(assignment));
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

    // Mark assignment as completed if linked
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
