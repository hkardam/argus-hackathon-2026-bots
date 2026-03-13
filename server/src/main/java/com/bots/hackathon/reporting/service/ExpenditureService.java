package com.bots.hackathon.reporting.service;

import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.reporting.dto.CreateExpenditureRequest;
import com.bots.hackathon.reporting.dto.ExpenditureRecordResponse;
import com.bots.hackathon.reporting.dto.UpdateVerificationRequest;
import com.bots.hackathon.reporting.model.ExpenditureRecord;
import com.bots.hackathon.reporting.repo.ExpenditureRecordRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExpenditureService {

    private final ExpenditureRecordRepository expenditureRepository;

    @Transactional
    @LoggableAction(actionType = "CREATE", objectType = "EXPENDITURE_RECORD")
    public ExpenditureRecordResponse create(CreateExpenditureRequest request) {
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
    public List<ExpenditureRecordResponse> listByGrantAwardId(UUID grantAwardId) {
        return expenditureRepository.findByGrantAwardId(grantAwardId).stream()
                .map(this::toResponse)
                .toList();
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
