package com.bots.hackathon.reporting.service;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.award.model.GrantAward;
import com.bots.hackathon.award.repo.GrantAwardRepository;
import com.bots.hackathon.common.enums.ReportStatus;
import com.bots.hackathon.common.exception.AccessDeniedException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.reporting.dto.ReportResponse;
import com.bots.hackathon.reporting.dto.SubmitReportRequest;
import com.bots.hackathon.reporting.model.Report;
import com.bots.hackathon.reporting.repo.ReportRepository;
import com.bots.hackathon.security.guard.AuthorizationGuard;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final GrantAwardRepository grantAwardRepository;
    private final ApplicationRepository applicationRepository;
    private final AuthorizationGuard authorizationGuard;

    @Transactional
    @LoggableAction(actionType = "SUBMIT_REPORT", objectType = "REPORT")
    public ReportResponse submitReport(SubmitReportRequest request, Long submittedByUserId) {
        verifyGrantAccess(request.grantAwardId(), submittedByUserId);
        Report report =
                Report.builder()
                        .grantAwardId(request.grantAwardId())
                        .submittedByUserId(submittedByUserId)
                        .reportType(request.reportType())
                        .content(request.content())
                        .status(ReportStatus.SUBMITTED)
                        .submittedAt(LocalDateTime.now())
                        .build();
        return toResponse(reportRepository.save(report));
    }

    @Transactional(readOnly = true)
    public ReportResponse getById(UUID id, Long userId) {
        Report report =
                reportRepository
                        .findByIdAndDeletedFalse(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Report", id));
        verifyGrantAccess(report.getGrantAwardId(), userId);
        return toResponse(report);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getByGrantAwardId(UUID grantAwardId, Long userId) {
        verifyGrantAccess(grantAwardId, userId);
        return reportRepository.findByGrantAwardIdAndDeletedFalse(grantAwardId).stream()
                .map(this::toResponse)
                .toList();
    }

    private void verifyGrantAccess(UUID grantAwardId, Long userId) {
        if (authorizationGuard.isStaff()) {
            return;
        }
        GrantAward award =
                grantAwardRepository
                        .findById(grantAwardId)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("GrantAward", grantAwardId));
        Application application =
                applicationRepository
                        .findByIdAndDeletedFalse(award.getApplicationId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Application", award.getApplicationId()));
        if (!application.getApplicantUserId().equals(userId)) {
            throw new AccessDeniedException(
                    "User does not have access to grant " + grantAwardId);
        }
    }

    private ReportResponse toResponse(Report r) {
        return new ReportResponse(
                r.getId(),
                r.getGrantAwardId(),
                r.getSubmittedByUserId(),
                r.getReportType(),
                r.getContent(),
                r.getStatus(),
                r.getSubmittedAt(),
                r.getCreatedAt(),
                r.getUpdatedAt());
    }
}