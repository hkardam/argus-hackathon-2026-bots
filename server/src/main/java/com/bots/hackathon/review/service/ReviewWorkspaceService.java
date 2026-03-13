package com.bots.hackathon.review.service;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.model.Document;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.application.repo.DocumentRepository;
import com.bots.hackathon.common.enums.ApplicationStatus;
import com.bots.hackathon.review.dto.DimensionScoreDto;
import com.bots.hackathon.review.dto.ReviewPackageResponse;
import com.bots.hackathon.review.dto.SaveReviewRequest;
import com.bots.hackathon.review.model.Review;
import com.bots.hackathon.review.model.ReviewAssignment;
import com.bots.hackathon.review.model.ReviewPackage;
import com.bots.hackathon.review.repo.ReviewAssignmentRepository;
import com.bots.hackathon.review.repo.ReviewPackageRepository;
import com.bots.hackathon.review.repo.ReviewRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewWorkspaceService {

    private final ApplicationRepository applicationRepository;
    private final DocumentRepository documentRepository;
    private final ReviewPackageRepository reviewPackageRepository;
    private final ReviewAssignmentRepository reviewAssignmentRepository;
    private final ReviewRepository reviewRepository;
    private final ObjectMapper objectMapper;

    public ReviewPackageResponse getReviewPackage(UUID applicationId, Long reviewerUserId) {
        // Validate assignment
        validateReviewerAssignment(applicationId, reviewerUserId);

        Application application =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        List<Document> documents =
                documentRepository.findByApplicationIdAndDeletedFalse(applicationId);

        ReviewPackage aiPackage =
                reviewPackageRepository.findByApplicationId(applicationId).orElse(null);

        return new ReviewPackageResponse(application, documents, aiPackage);
    }

    @Transactional
    public void saveReview(UUID applicationId, Long reviewerUserId, SaveReviewRequest request) {
        ReviewAssignment assignment = validateReviewerAssignment(applicationId, reviewerUserId);
        if (Boolean.TRUE.equals(assignment.getIsCompleted())) {
            throw new IllegalStateException("Review is already submitted");
        }

        validateOverrides(request);

        Review review =
                reviewRepository
                        .findByApplicationIdAndReviewerUserId(applicationId, reviewerUserId)
                        .orElseGet(
                                () ->
                                        Review.builder()
                                                .applicationId(applicationId)
                                                .reviewerUserId(reviewerUserId)
                                                .assignmentId(assignment.getId())
                                                .build());

        try {
            review.setDimensionScoresJson(
                    objectMapper.writeValueAsString(request.dimensionScores()));
            review.setHighlightsJson(objectMapper.writeValueAsString(request.highlights()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing review data", e);
        }

        reviewRepository.save(review);
    }

    @Transactional
    public void submitReview(UUID applicationId, Long reviewerUserId) {
        ReviewAssignment assignment = validateReviewerAssignment(applicationId, reviewerUserId);

        Review review =
                reviewRepository
                        .findByApplicationIdAndReviewerUserId(applicationId, reviewerUserId)
                        .orElseThrow(
                                () -> new IllegalStateException("No draft review found to submit"));

        // Validate complete
        if (review.getDimensionScoresJson() == null || review.getDimensionScoresJson().isBlank()) {
            throw new IllegalStateException("Cannot submit empty review");
        }

        // In reality, we would parse JSON and ensure all dimensions are scored
        // For hackathon, empty/null JSON check logic applies above

        assignment.setIsCompleted(true);
        reviewAssignmentRepository.save(assignment);

        checkAndCompleteApplicationReview(applicationId);
    }

    private void validateOverrides(SaveReviewRequest request) {
        if (request.dimensionScores() != null) {
            for (DimensionScoreDto ds : request.dimensionScores()) {
                if (Boolean.TRUE.equals(ds.override())
                        && (ds.comment() == null || ds.comment().isBlank())) {
                    throw new IllegalArgumentException(
                            "Comment is mandatory if override is true for dimension: "
                                    + ds.dimension());
                }
            }
        }
    }

    private ReviewAssignment validateReviewerAssignment(UUID applicationId, Long reviewerUserId) {
        return reviewAssignmentRepository
                .findByApplicationIdAndReviewerUserId(applicationId, reviewerUserId)
                .orElseThrow(
                        () ->
                                new IllegalStateException(
                                        "Reviewer is not assigned to this application"));
    }

    private void checkAndCompleteApplicationReview(UUID applicationId) {
        List<ReviewAssignment> assignments =
                reviewAssignmentRepository.findByApplicationId(applicationId);
        boolean allComplete =
                assignments.stream().allMatch(a -> Boolean.TRUE.equals(a.getIsCompleted()));

        if (allComplete && !assignments.isEmpty()) {
            Application application =
                    applicationRepository.findByIdAndDeletedFalse(applicationId).orElseThrow();
            application.setStatus(ApplicationStatus.REVIEWED);
            applicationRepository.save(application);
        }
    }
}
