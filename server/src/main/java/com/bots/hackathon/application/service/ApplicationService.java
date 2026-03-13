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
import com.bots.hackathon.common.exception.AccessDeniedException;
import com.bots.hackathon.common.exception.BusinessException;
import com.bots.hackathon.common.exception.InvalidStateTransitionException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private static final BigDecimal BUDGET_TOLERANCE = new BigDecimal("500");
    private static final BigDecimal OVERHEAD_CAP_PERCENT = new BigDecimal("15");

    private final ApplicationRepository applicationRepository;
    private final ApplicationSectionDataRepository sectionDataRepository;

    @Transactional
    @LoggableAction(actionType = "CREATE", objectType = "APPLICATION")
    public ApplicationResponse createDraft(CreateApplicationRequest request, Long applicantUserId) {
        validateBudgetRequest(request.requestedAmount());
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
    public void updateSection(UUID applicationId, UpdateSectionRequest request, Long userId) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Application", applicationId));

        verifyOwnership(app, userId);

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
    public ApplicationResponse submit(UUID applicationId, Long userId) {
        Application app =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Application", applicationId));

        verifyOwnership(app, userId);

        if (app.getStatus() != ApplicationStatus.DRAFT) {
            throw new InvalidStateTransitionException(app.getStatus().name(), "SUBMITTED");
        }

        validateSectionsComplete(applicationId);
        validateBudgetRequest(app.getRequestedAmount());

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

    public boolean isOwnedBy(UUID applicationId, Long userId) {
        return applicationRepository
                .findByIdAndDeletedFalse(applicationId)
                .map(app -> app.getApplicantUserId().equals(userId))
                .orElse(false);
    }

    public boolean isOverdue(UUID applicationId) {
        return applicationRepository
                .findByIdAndDeletedFalse(applicationId)
                .map(app -> app.getSlaDeadline() != null
                        && LocalDateTime.now().isAfter(app.getSlaDeadline()))
                .orElse(false);
    }

    private void verifyOwnership(Application app, Long userId) {
        if (!app.getApplicantUserId().equals(userId)) {
            throw new AccessDeniedException(
                    "User does not own application " + app.getId());
        }
    }

    private void validateSectionsComplete(UUID applicationId) {
        List<ApplicationSectionData> sections =
                sectionDataRepository.findByApplicationId(applicationId);
        if (sections.isEmpty()) {
            throw new BusinessException(
                    "Application must have at least one completed section before submission");
        }
        boolean allComplete = sections.stream()
                .allMatch(s -> Boolean.TRUE.equals(s.getIsComplete()));
        if (!allComplete) {
            throw new BusinessException(
                    "All application sections must be marked as complete before submission");
        }
    }

    private void validateBudgetRequest(BigDecimal requestedAmount) {
        if (requestedAmount == null) {
            return;
        }
        if (requestedAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Requested amount cannot be negative");
        }
    }

    private ApplicationResponse toResponse(Application app) {
        boolean overdue = app.getSlaDeadline() != null
                && LocalDateTime.now().isAfter(app.getSlaDeadline());
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
                overdue,
                app.getCreatedAt(),
                app.getUpdatedAt());
    }
}