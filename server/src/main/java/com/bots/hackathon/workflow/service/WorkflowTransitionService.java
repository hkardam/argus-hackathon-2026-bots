package com.bots.hackathon.workflow.service;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.common.enums.ApplicationStatus;
import com.bots.hackathon.common.exception.InvalidStateTransitionException;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WorkflowTransitionService {

  private final ApplicationRepository applicationRepository;

  private static final Map<ApplicationStatus, Set<ApplicationStatus>> VALID_TRANSITIONS =
      Map.ofEntries(
          Map.entry(
              ApplicationStatus.DRAFT,
              Set.of(ApplicationStatus.SUBMITTED, ApplicationStatus.WITHDRAWN)),
          Map.entry(
              ApplicationStatus.SUBMITTED,
              Set.of(ApplicationStatus.UNDER_ELIGIBILITY_CHECK, ApplicationStatus.WITHDRAWN)),
          Map.entry(
              ApplicationStatus.UNDER_ELIGIBILITY_CHECK,
              Set.of(ApplicationStatus.ELIGIBLE, ApplicationStatus.INELIGIBLE)),
          Map.entry(ApplicationStatus.ELIGIBLE, Set.of(ApplicationStatus.UNDER_SCREENING)),
          Map.entry(ApplicationStatus.UNDER_SCREENING, Set.of(ApplicationStatus.UNDER_REVIEW)),
          Map.entry(ApplicationStatus.UNDER_REVIEW, Set.of(ApplicationStatus.REVIEWED)),
          Map.entry(
              ApplicationStatus.REVIEWED,
              Set.of(ApplicationStatus.APPROVED, ApplicationStatus.REJECTED)),
          Map.entry(ApplicationStatus.APPROVED, Set.of(ApplicationStatus.AWARDED)),
          Map.entry(ApplicationStatus.AWARDED, Set.of(ApplicationStatus.ACTIVE)),
          Map.entry(ApplicationStatus.ACTIVE, Set.of(ApplicationStatus.COMPLETED)));

  @Transactional
  @LoggableAction(
      actionType = "WORKFLOW_TRANSITION",
      objectType = "APPLICATION",
      objectIdExpression = "#applicationId.toString()")
  public Application transition(UUID applicationId, ApplicationStatus targetStatus) {
    Application app =
        applicationRepository
            .findByIdAndDeletedFalse(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

    validateTransition(app.getStatus(), targetStatus);
    app.setStatus(targetStatus);

    // TODO: Update SLA deadline based on stage
    updateSlaDeadline(app, targetStatus);

    // TODO: Emit workflow event for notification hooks
    return applicationRepository.save(app);
  }

  public boolean isValidTransition(ApplicationStatus from, ApplicationStatus to) {
    Set<ApplicationStatus> allowed = VALID_TRANSITIONS.get(from);
    return allowed != null && allowed.contains(to);
  }

  private void validateTransition(ApplicationStatus current, ApplicationStatus target) {
    if (!isValidTransition(current, target)) {
      throw new InvalidStateTransitionException(current.name(), target.name());
    }
  }

  private void updateSlaDeadline(Application app, ApplicationStatus newStatus) {
    // TODO: Implement SLA calculation based on grant type and stage
    // Placeholder: set deadline to 14 days from now for review stages
    switch (newStatus) {
      case UNDER_ELIGIBILITY_CHECK, UNDER_SCREENING, UNDER_REVIEW ->
          app.setSlaDeadline(LocalDateTime.now().plusDays(14));
      default -> {}
    }
  }
}
