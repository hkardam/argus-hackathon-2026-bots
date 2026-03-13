package com.bots.hackathon.eligibility.repo;

import com.bots.hackathon.eligibility.model.ScreeningReport;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreeningReportRepository extends JpaRepository<ScreeningReport, UUID> {

  Optional<ScreeningReport> findByApplicationId(UUID applicationId);
}
