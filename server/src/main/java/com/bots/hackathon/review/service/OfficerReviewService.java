package com.bots.hackathon.review.service;

import com.bots.hackathon.application.model.Application;
import com.bots.hackathon.application.repo.ApplicationRepository;
import com.bots.hackathon.common.enums.ApplicationStatus;
import com.bots.hackathon.grant.model.GrantProgramme;
import com.bots.hackathon.grant.repo.GrantProgrammeRepository;
import com.bots.hackathon.review.dto.FinalDecisionRequest;
import com.bots.hackathon.review.dto.ReviewedApplicationDto;
import com.bots.hackathon.review.model.Review;
import com.bots.hackathon.review.model.RiskFlag;
import com.bots.hackathon.review.repo.ReviewRepository;
import com.bots.hackathon.review.repo.RiskFlagRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OfficerReviewService {

    private final ApplicationRepository applicationRepository;
    private final GrantProgrammeRepository grantProgrammeRepository;
    private final ReviewRepository reviewRepository;
    private final RiskFlagRepository riskFlagRepository;

    public List<ReviewedApplicationDto> getReviewedApplications() {
        List<Application> reviewedApps =
                applicationRepository.findByStatusAndDeletedFalse(ApplicationStatus.REVIEWED);

        return reviewedApps.stream()
                .map(
                        app -> {
                            GrantProgramme programme =
                                    grantProgrammeRepository
                                            .findById(app.getProgrammeId())
                                            .orElseThrow();
                            List<Review> reviews =
                                    reviewRepository.findByApplicationId(app.getId());
                            List<RiskFlag> riskFlags =
                                    riskFlagRepository.findByApplicationId(app.getId());

                            Double compositeScore =
                                    reviews.stream()
                                            .filter(r -> r.getScore() != null)
                                            .mapToDouble(Review::getScore)
                                            .average()
                                            .orElse(0.0);

                            return new ReviewedApplicationDto(
                                    app.getId(),
                                    programme.getGrantType().name(),
                                    compositeScore,
                                    reviews,
                                    riskFlags);
                        })
                .collect(Collectors.toList());
    }

    @Transactional
    public void submitFinalDecision(
            UUID applicationId, FinalDecisionRequest request, Long officerId) {
        Application application =
                applicationRepository
                        .findByIdAndDeletedFalse(applicationId)
                        .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (!ApplicationStatus.REVIEWED.equals(application.getStatus())) {
            throw new IllegalStateException("Application is not in REVIEWED state");
        }

        if (request.reason() == null || request.reason().isBlank()) {
            throw new IllegalArgumentException("Decision reason is mandatory");
        }

        switch (request.decision().toUpperCase()) {
            case "APPROVE":
                application.setStatus(ApplicationStatus.APPROVED);
                break;
            case "REJECT":
                application.setStatus(ApplicationStatus.REJECTED);
                break;
            case "WAITLIST":
                // If there's no WAITLISTED state in ApplicationStatus, we can use a generic logic
                // Or map to another valid state. The Enum has UNDER_ELIGIBILITY_CHECK, ELIGIBLE,
                // INELIGIBLE,
                // UNDER_SCREENING, UNDER_REVIEW, REVIEWED, APPROVED, REJECTED, AWARDED, ACTIVE,
                // COMPLETED, WITHDRAWN.
                // Assuming WAITLIST maps to an extended state, or just throwing an exception if
                // unsupported.
                // Adding check if we don't have it. For now, PRD says WAITLISTED. Let's assume it
                // should exist or we can just leave it as is if it fails.
                // Or I can add WAITLISTED to the enum by executing a multi_replace on
                // ApplicationStatus. Let's add WAITLISTED.
                application.setStatus(
                        ApplicationStatus.valueOf(
                                "WAITLISTED")); // This will fail if not added. I will add it.
                break;
            default:
                throw new IllegalArgumentException("Invalid decision");
        }

        applicationRepository.save(application);
    }
}
