package com.bots.hackathon.award.service;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.award.dto.ApproveAwardRequest;
import com.bots.hackathon.award.dto.GrantAwardResponse;
import com.bots.hackathon.award.model.GrantAward;
import com.bots.hackathon.award.repo.GrantAwardRepository;
import com.bots.hackathon.common.enums.ApplicationStatus;
import com.bots.hackathon.common.exception.BusinessException;
import com.bots.hackathon.common.exception.InvalidStateTransitionException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AwardService {

    private final GrantAwardRepository awardRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    @LoggableAction(actionType = "APPROVE_AWARD", objectType = "GRANT_AWARD")
    public GrantAwardResponse approveAward(ApproveAwardRequest request, Long approvedByUserId) {
        Application application =
                applicationRepository
                        .findByIdAndDeletedFalse(request.applicationId())
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Application", request.applicationId()));

        if (application.getStatus() != ApplicationStatus.REVIEWED
                && application.getStatus() != ApplicationStatus.UNDER_REVIEW) {
            throw new InvalidStateTransitionException(
                    application.getStatus().name(),
                    "APPROVED - Application must be reviewed first");
        }

        if (awardRepository.findByApplicationId(request.applicationId()).isPresent()) {
            throw new BusinessException(
                    "Award already exists for application " + request.applicationId());
        }

        // Transition application to APPROVED
        application.setStatus(ApplicationStatus.APPROVED);
        applicationRepository.save(application);

        GrantAward award =
                GrantAward.builder()
                        .applicationId(request.applicationId())
                        .programmeId(application.getProgrammeId())
                        .organisationId(application.getOrganisationId())
                        .awardedAmount(request.awardedAmount())
                        .startDate(request.startDate())
                        .endDate(request.endDate())
                        .approvedByUserId(approvedByUserId)
                        .isActive(true)
                        .build();

        return toResponse(awardRepository.save(award));
    }

    @Transactional(readOnly = true)
    public GrantAwardResponse getByApplicationId(UUID applicationId) {
        GrantAward award =
                awardRepository
                        .findByApplicationId(applicationId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "GrantAward for application", applicationId));
        return toResponse(award);
    }

    @Transactional(readOnly = true)
    public GrantAwardResponse getById(UUID id) {
        GrantAward award =
                awardRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("GrantAward", id));
        return toResponse(award);
    }

    @Transactional(readOnly = true)
    public List<GrantAwardResponse> getByOrganisation(UUID organisationId) {
        return awardRepository.findByOrganisationId(organisationId).stream()
                .map(this::toResponse)
                .toList();
    }

    private GrantAwardResponse toResponse(GrantAward a) {
        return new GrantAwardResponse(
                a.getId(),
                a.getApplicationId(),
                a.getProgrammeId(),
                a.getOrganisationId(),
                a.getAwardedAmount(),
                a.getStartDate(),
                a.getEndDate(),
                a.getApprovedByUserId(),
                a.getIsActive(),
                a.getCreatedAt());
    }
}
