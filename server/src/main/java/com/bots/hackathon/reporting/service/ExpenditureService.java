package com.bots.hackathon.reporting.service;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.award.model.GrantAward;
import com.bots.hackathon.award.repo.GrantAwardRepository;
import com.bots.hackathon.common.exception.AccessDeniedException;
import com.bots.hackathon.common.exception.BusinessException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.reporting.dto.CreateExpenditureRequest;
import com.bots.hackathon.reporting.dto.ExpenditureRecordResponse;
import com.bots.hackathon.reporting.dto.UpdateVerificationRequest;
import com.bots.hackathon.reporting.model.ExpenditureRecord;
import com.bots.hackathon.reporting.repo.ExpenditureRecordRepository;
import com.bots.hackathon.security.guard.AuthorizationGuard;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExpenditureService {

    private final ExpenditureRecordRepository expenditureRepository;
    private final GrantAwardRepository grantAwardRepository;
    private final ApplicationRepository applicationRepository;
    private final AuthorizationGuard authorizationGuard;

    @Transactional
    @LoggableAction(actionType = "CREATE", objectType = "EXPENDITURE_RECORD")
    public ExpenditureRecordResponse create(CreateExpenditureRequest request) {
        if (request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Expenditure amount must be positive");
        }

        grantAwardRepository
                .findById(request.grantAwardId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("GrantAward", request.grantAwardId()));

        ExpenditureRecord record =
                ExpenditureRecord.builder()
                        .grantAwardId(request.grantAwardId())
                        .category(request.category())
                        .description(request.description())
                        .amount(request.amount())
                        .expenditureDate(request.expenditureDate())
                        .receiptDocumentId(request.receiptDocumentId())
                        .build();
        return toResponse(expenditureRepository.save(record));
    }

    @Transactional
    @LoggableAction(
            actionType = "UPDATE_VERIFICATION",
            objectType = "EXPENDITURE_RECORD",
            objectIdExpression = "#id.toString()")
    public ExpenditureRecordResponse updateVerificationStatus(
            UUID id, UpdateVerificationRequest request, Long verifiedByUserId) {
        ExpenditureRecord record =
                expenditureRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("ExpenditureRecord", id));

        record.setVerificationStatus(request.verificationStatus());
        record.setVerifiedByUserId(verifiedByUserId);
        return toResponse(expenditureRepository.save(record));
    }

    @Transactional(readOnly = true)
    public List<ExpenditureRecordResponse> listByGrantAwardId(UUID grantAwardId, Long userId) {
        verifyGrantAccess(grantAwardId, userId);
        return expenditureRepository.findByGrantAwardId(grantAwardId).stream()
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
                                () ->
                                        new ResourceNotFoundException(
                                                "Application", award.getApplicationId()));
        if (!application.getApplicantUserId().equals(userId)) {
            throw new AccessDeniedException("User does not have access to grant " + grantAwardId);
        }
    }

    private ExpenditureRecordResponse toResponse(ExpenditureRecord r) {
        return new ExpenditureRecordResponse(
                r.getId(),
                r.getGrantAwardId(),
                r.getCategory(),
                r.getDescription(),
                r.getAmount(),
                r.getExpenditureDate(),
                r.getReceiptDocumentId(),
                r.getVerificationStatus(),
                r.getVerifiedByUserId(),
                r.getCreatedAt(),
                r.getUpdatedAt());
    }
}
