package com.bots.hackathon.disbursement.service;

import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.award.model.GrantAward;
import com.bots.hackathon.award.repo.GrantAwardRepository;
import com.bots.hackathon.common.enums.DisbursementStatus;
import com.bots.hackathon.common.exception.BusinessException;
import com.bots.hackathon.common.exception.InvalidStateTransitionException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.disbursement.dto.CreateTrancheRequest;
import com.bots.hackathon.disbursement.dto.DisbursementTrancheResponse;
import com.bots.hackathon.disbursement.model.DisbursementTranche;
import com.bots.hackathon.disbursement.repo.DisbursementTrancheRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DisbursementService {

    private final DisbursementTrancheRepository trancheRepository;
    private final GrantAwardRepository awardRepository;

    @Transactional
    @LoggableAction(actionType = "CREATE_TRANCHE", objectType = "DISBURSEMENT_TRANCHE")
    public DisbursementTrancheResponse createTranche(CreateTrancheRequest request) {
        GrantAward award =
                awardRepository
                        .findById(request.grantAwardId())
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "GrantAward", request.grantAwardId()));

        // Validate scheduled date is in the future
        if (request.scheduledDate() != null && request.scheduledDate().isBefore(LocalDate.now())) {
            throw new BusinessException("Tranche scheduled date must be in the future");
        }

        // Validate tranche sum does not exceed award amount
        List<DisbursementTranche> existingTranches =
                trancheRepository.findByGrantAwardId(request.grantAwardId());
        BigDecimal existingTotal =
                existingTranches.stream()
                        .map(DisbursementTranche::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (existingTotal.add(request.amount()).compareTo(award.getAwardedAmount()) > 0) {
            throw new BusinessException(
                    "Total tranche amounts ("
                            + existingTotal.add(request.amount())
                            + ") would exceed award amount ("
                            + award.getAwardedAmount()
                            + ")");
        }

        DisbursementTranche tranche =
                DisbursementTranche.builder()
                        .grantAwardId(request.grantAwardId())
                        .trancheNumber(request.trancheNumber())
                        .amount(request.amount())
                        .scheduledDate(request.scheduledDate())
                        .notes(request.notes())
                        .status(DisbursementStatus.SCHEDULED)
                        .build();

        return toResponse(trancheRepository.save(tranche));
    }

    @Transactional
    @LoggableAction(
            actionType = "UPDATE_TRANCHE_STATUS",
            objectType = "DISBURSEMENT_TRANCHE",
            objectIdExpression = "#trancheId.toString()")
    public DisbursementTrancheResponse updateStatus(
            UUID trancheId, DisbursementStatus newStatus, Long releasedByUserId) {
        DisbursementTranche tranche =
                trancheRepository
                        .findById(trancheId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "DisbursementTranche", trancheId));

        validateStatusTransition(tranche.getStatus(), newStatus);

        tranche.setStatus(newStatus);
        if (newStatus == DisbursementStatus.RELEASED) {
            tranche.setReleasedDate(LocalDate.now());
            tranche.setReleasedByUserId(releasedByUserId);
        }

        return toResponse(trancheRepository.save(tranche));
    }

    @Transactional(readOnly = true)
    public List<DisbursementTrancheResponse> getByAward(UUID grantAwardId) {
        return trancheRepository.findByGrantAwardId(grantAwardId).stream()
                .map(this::toResponse)
                .toList();
    }

    /** Validate SCHEDULED → ON_HOLD or RELEASED; ON_HOLD → RELEASED or CANCELLED. */
    private void validateStatusTransition(DisbursementStatus current, DisbursementStatus next) {
        boolean valid =
                switch (current) {
                    case SCHEDULED ->
                            next == DisbursementStatus.ON_HOLD
                                    || next == DisbursementStatus.RELEASED
                                    || next == DisbursementStatus.CANCELLED;
                    case ON_HOLD ->
                            next == DisbursementStatus.RELEASED
                                    || next == DisbursementStatus.CANCELLED;
                    case RELEASED, CANCELLED -> false;
                };
        if (!valid) {
            throw new InvalidStateTransitionException(current.name(), next.name());
        }
    }

    private DisbursementTrancheResponse toResponse(DisbursementTranche t) {
        return new DisbursementTrancheResponse(
                t.getId(),
                t.getGrantAwardId(),
                t.getTrancheNumber(),
                t.getAmount(),
                t.getScheduledDate(),
                t.getReleasedDate(),
                t.getStatus(),
                t.getReleasedByUserId(),
                t.getNotes(),
                t.getCreatedAt());
    }
}
