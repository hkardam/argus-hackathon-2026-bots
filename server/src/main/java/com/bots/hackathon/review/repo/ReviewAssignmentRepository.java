package com.bots.hackathon.review.repo;

import com.bots.hackathon.review.model.ReviewAssignment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewAssignmentRepository extends JpaRepository<ReviewAssignment, UUID> {

    List<ReviewAssignment> findByReviewerUserId(Long reviewerUserId);

    List<ReviewAssignment> findByApplicationId(UUID applicationId);

    List<ReviewAssignment> findByReviewerUserIdAndIsCompletedFalse(Long reviewerUserId);

    Optional<ReviewAssignment> findByApplicationIdAndReviewerUserId(
            UUID applicationId, Long reviewerUserId);

    boolean existsByApplicationIdAndReviewerUserId(UUID applicationId, Long reviewerUserId);
}
