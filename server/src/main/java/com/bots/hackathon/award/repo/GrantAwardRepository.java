package com.bots.hackathon.award.repo;

import com.bots.hackathon.award.model.GrantAward;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrantAwardRepository extends JpaRepository<GrantAward, UUID> {

  Optional<GrantAward> findByApplicationId(UUID applicationId);

  java.util.List<GrantAward> findByOrganisationId(UUID organisationId);

  java.util.List<GrantAward> findByProgrammeId(UUID programmeId);
}
