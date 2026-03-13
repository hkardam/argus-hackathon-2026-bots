package com.bots.hackathon.application.repo;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.common.enums.ApplicationStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    Optional<Application> findByIdAndDeletedFalse(UUID id);

    List<Application> findByApplicantUserIdAndDeletedFalse(Long applicantUserId);

    List<Application> findByProgrammeIdAndDeletedFalse(UUID programmeId);

    List<Application> findByOrganisationIdAndDeletedFalse(UUID organisationId);

    List<Application> findByStatusAndDeletedFalse(ApplicationStatus status);

    List<Application> findByDeletedFalse();

    @Query(
            "SELECT a FROM Application a JOIN ReviewAssignment r ON a.id = r.applicationId "
                    + "WHERE r.reviewerUserId = :reviewerId AND a.deleted = false")
    List<Application> findAssignedToReviewer(@Param("reviewerId") Long reviewerId);
}
