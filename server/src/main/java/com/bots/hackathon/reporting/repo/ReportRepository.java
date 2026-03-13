package com.bots.hackathon.reporting.repo;

import com.bots.hackathon.reporting.model.Report;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, UUID> {

    Optional<Report> findByIdAndDeletedFalse(UUID id);

    List<Report> findByGrantAwardIdAndDeletedFalse(UUID grantAwardId);
}
