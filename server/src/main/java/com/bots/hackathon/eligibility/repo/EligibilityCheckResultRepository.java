package com.bots.hackathon.eligibility.repo;

import com.bots.hackathon.eligibility.model.EligibilityCheckResult;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EligibilityCheckResultRepository
        extends JpaRepository<EligibilityCheckResult, UUID> {

    Optional<EligibilityCheckResult> findByApplicationId(UUID applicationId);
}
