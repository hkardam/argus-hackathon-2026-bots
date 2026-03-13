package com.bots.hackathon.organisation.repo;

import com.bots.hackathon.organisation.model.Organisation;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganisationRepository extends JpaRepository<Organisation, UUID> {

    Optional<Organisation> findByIdAndDeletedFalse(UUID id);

    List<Organisation> findByOwnerUserIdAndDeletedFalse(Long ownerUserId);

    Optional<Organisation> findByRegistrationNumber(String registrationNumber);
}
