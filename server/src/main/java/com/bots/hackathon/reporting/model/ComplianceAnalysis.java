package com.bots.hackathon.reporting.model;

import com.bots.hackathon.common.enums.ComplianceStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "compliance_analyses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "grant_award_id", nullable = false)
    private UUID grantAwardId;

    @Column(name = "report_id")
    private UUID reportId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ComplianceStatus status = ComplianceStatus.UNDER_REVIEW;

    @Column(name = "findings", columnDefinition = "TEXT")
    private String findings;

    @Column(name = "ai_suggested")
    @Builder.Default
    private Boolean aiSuggested = false;

    @Column(name = "reviewed_by_user_id")
    private Long reviewedByUserId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
