package com.bots.hackathon.disbursement.repo;

import com.bots.hackathon.disbursement.model.BankDetails;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankDetailsRepository extends JpaRepository<BankDetails, UUID> {

  Optional<BankDetails> findByOrganisationId(UUID organisationId);
}
