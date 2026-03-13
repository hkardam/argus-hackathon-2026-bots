package com.bots.hackathon.reporting.repo;

import com.bots.hackathon.reporting.model.ComplianceAnalysis;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplianceAnalysisRepository extends JpaRepository<ComplianceAnalysis, UUID> {

    List<ComplianceAnalysis> findByGrantAwardId(UUID grantAwardId);
}
