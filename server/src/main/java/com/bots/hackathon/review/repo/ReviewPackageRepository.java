package com.bots.hackathon.review.repo;

import com.bots.hackathon.review.model.ReviewPackage;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewPackageRepository extends JpaRepository<ReviewPackage, UUID> {
    Optional<ReviewPackage> findByApplicationId(UUID applicationId);
}
