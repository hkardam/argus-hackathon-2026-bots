package com.bots.hackathon.grant.repo;

import com.bots.hackathon.common.enums.GrantType;
import com.bots.hackathon.grant.model.GrantProgramme;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrantProgrammeRepository extends JpaRepository<GrantProgramme, UUID> {

  List<GrantProgramme> findByIsActiveTrue();

  List<GrantProgramme> findByGrantType(GrantType grantType);
}
