package com.bots.hackathon.review.repo;

import com.bots.hackathon.review.model.Review;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByApplicationId(UUID applicationId);

    Optional<Review> findByApplicationIdAndReviewerUserId(UUID applicationId, Long reviewerUserId);
}
