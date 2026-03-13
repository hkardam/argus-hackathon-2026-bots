package com.bots.hackathon.reporting.repo;

import com.bots.hackathon.reporting.model.ExpenditureRecord;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenditureRecordRepository extends JpaRepository<ExpenditureRecord, UUID> {

    List<ExpenditureRecord> findByGrantAwardId(UUID grantAwardId);
}
