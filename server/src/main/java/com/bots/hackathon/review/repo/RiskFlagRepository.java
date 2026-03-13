package com.bots.hackathon.review.repo;

import com.bots.hackathon.review.model.RiskFlag;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskFlagRepository extends JpaRepository<RiskFlag, UUID> {

    List<RiskFlag> findByApplicationId(UUID applicationId);

    List<RiskFlag> findByApplicationIdAndIsResolvedFalse(UUID applicationId);
}
