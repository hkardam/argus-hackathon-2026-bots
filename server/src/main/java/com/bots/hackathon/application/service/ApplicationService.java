package com.bots.hackathon.application.service;

import com.bots.hackathon.application.dto.ApplicationResponse;
import com.bots.hackathon.application.dto.CreateApplicationRequest;
import com.bots.hackathon.application.dto.UpdateSectionRequest;
import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.model.ApplicationSectionData;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.application.repo.ApplicationSectionDataRepository;
import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.common.enums.ApplicationStatus;
import com.bots.hackathon.common.exception.InvalidStateTransitionException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationSectionDataRepository sectionDataRepository;

    @Transactional
    @LoggableAction(actionType = "CREATE", objectType = "APPLICATION")
    public ApplicationResponse createDraft(CreateApplicationRequest request, Long applicantUserId) {
        Application app =
                Application.builder()
                        .programmeId(request.programmeId())
                        .organisationId(request.organisationId())
                        .applicantUserId(applicantUserId)
                        .title(request.title())
                        .summary(request.summary())
                        .requestedAmount(request.requestedAmount())
                        .status(ApplicationStatus.DRAFT)
                        .build();
        return toResponse(applicationRepository.save(app));
    }

    @Transactional
    @LoggableAction(
            actionType = "UPDATE_SECTION",
            objectType = "APPLICATION",
            objectIdExpression = "#applicationId.toString()")
    public void updateSection(UUID applicationId, UpdateSectionRequest request) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Application", applicationId));

        if (app.getStatus() != ApplicationStatus.DRAFT) {
            throw new InvalidStateTransitionException(
                    app.getStatus().name(), "Cannot update sections of non-draft application");
        }

        ApplicationSectionData section =
                sectionDataRepository
                        .findByApplicationIdAndSectionKey(applicationId, request.sectionKey())
                        .orElse(
                                ApplicationSectionData.builder()
                                        .applicationId(applicationId)
                                        .sectionKey(request.sectionKey())
                                        .build());

        section.setSectionData(request.sectionData());
        if (request.isComplete() != null) {
            section.setIsComplete(request.isComplete());
        }
        sectionDataRepository.save(section);
    }

    @Transactional
    @LoggableAction(
            actionType = "SUBMIT",
            objectType = "APPLICATION",
            objectIdExpression = "#applicationId.toString()")
    public ApplicationResponse submit(UUID applicationId) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Application", applicationId));

        if (app.getStatus() != ApplicationStatus.DRAFT) {
            throw new InvalidStateTransitionException(app.getStatus().name(), "SUBMITTED");
        }

        // TODO: Validate all required sections are complete
        // TODO: Validate budget totals

        app.setStatus(ApplicationStatus.SUBMITTED);
        app.setSubmittedAt(LocalDateTime.now());
        return toResponse(applicationRepository.save(app));
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getById(UUID id) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Application", id));
        return toResponse(app);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listByApplicant(Long applicantUserId) {
        return applicationRepository.findByApplicantUserIdAndDeletedFalse(applicantUserId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listByProgramme(UUID programmeId) {
        return applicationRepository.findByProgrammeIdAndDeletedFalse(programmeId).stream()
                .map(this::toResponse)
                .toList();
    }

    private ApplicationResponse toResponse(Application app) {
        return new ApplicationResponse(
                app.getId(),
                app.getProgrammeId(),
                app.getOrganisationId(),
                app.getApplicantUserId(),
                app.getTitle(),
                app.getSummary(),
                app.getRequestedAmount(),
                app.getStatus(),
                app.getSubmittedAt(),
                app.getSlaDeadline(),
                app.getCreatedAt(),
                app.getUpdatedAt());
    }
}
