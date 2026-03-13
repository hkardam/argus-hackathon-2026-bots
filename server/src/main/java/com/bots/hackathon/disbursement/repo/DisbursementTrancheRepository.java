package com.bots.hackathon.disbursement.repo;

import com.bots.hackathon.disbursement.model.DisbursementTranche;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisbursementTrancheRepository extends JpaRepository<DisbursementTranche, UUID> {

  List<DisbursementTranche> findByGrantAwardId(UUID grantAwardId);
}
