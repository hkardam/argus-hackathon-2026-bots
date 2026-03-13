package com.bots.hackathon.review.service;

import com.bots.hackathon.review.model.ReviewPackage;
import com.bots.hackathon.review.repo.ReviewPackageRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewPackageService {

    private final ReviewPackageRepository reviewPackageRepository;

    public void generate(UUID applicationId) {
        if (reviewPackageRepository.findByApplicationId(applicationId).isPresent()) {
            return; // Already generated
        }

        // Mock deterministic generation as per requirements
        String aiSummaryResponse =
                """
                {
                    "who": "Mock Applicant",
                    "what": "Mock Project",
                    "where": "Mock Location",
                    "beneficiaries": 100,
                    "duration": "12 months",
                    "budget": 50000
                }
                """;

        String aiSuggestedScores =
                """
                [
                    {
                        "dimension": "Impact",
                        "aiScore": 4,
                        "justification": "AI justification based on clear outcomes.",
                        "referenceSection": "Project.Expected Outcomes",
                        "label": "AI Suggested"
                    }
                ]
                """;

        String riskFlags =
                """
                [
                    {
                        "type": "Budget Anomaly",
                        "severity": "HIGH",
                        "explanation": "Budget line > 60% of total"
                    }
                ]
                """;

        ReviewPackage reviewPackage =
                ReviewPackage.builder()
                        .applicationId(applicationId)
                        .summaryJson(aiSummaryResponse)
                        .aiSuggestedScoresJson(aiSuggestedScores)
                        .riskFlagsJson(riskFlags)
                        .generatedAt(LocalDateTime.now())
                        .build();

        reviewPackageRepository.save(reviewPackage);
    }
}
