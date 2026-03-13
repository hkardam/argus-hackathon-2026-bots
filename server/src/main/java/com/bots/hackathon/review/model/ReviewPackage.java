package com.bots.hackathon.review.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity
@Table(
        name = "review_packages",
        indexes = {
            @Index(name = "idx_review_package_application_id", columnList = "application_id")
        })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id", nullable = false)
    private UUID applicationId;

    @Column(name = "summary_json", columnDefinition = "TEXT")
    private String summaryJson;

    @Column(name = "ai_suggested_scores_json", columnDefinition = "TEXT")
    private String aiSuggestedScoresJson;

    @Column(name = "risk_flags_json", columnDefinition = "TEXT")
    private String riskFlagsJson;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
}
