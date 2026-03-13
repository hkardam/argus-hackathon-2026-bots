package com.bots.hackathon.application.repo;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.common.enums.ApplicationStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    Optional<Application> findByIdAndDeletedFalse(UUID id);

    List<Application> findByApplicantUserIdAndDeletedFalse(Long applicantUserId);

    List<Application> findByProgrammeIdAndDeletedFalse(UUID programmeId);

    List<Application> findByOrganisationIdAndDeletedFalse(UUID organisationId);

    List<Application> findByStatusAndDeletedFalse(ApplicationStatus status);
}
