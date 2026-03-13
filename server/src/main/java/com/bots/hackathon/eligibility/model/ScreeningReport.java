package com.bots.hackathon.eligibility.model;

import com.bots.hackathon.common.enums.RiskLevel;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "screening_reports")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningReport {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "application_id", nullable = false)
  private UUID applicationId;

  @Enumerated(EnumType.STRING)
  @Column(name = "risk_level")
  private RiskLevel riskLevel;

  @Column(name = "ai_suggested")
  @Builder.Default
  private Boolean aiSuggested = true;

  @Column(name = "summary", columnDefinition = "TEXT")
  private String summary;

  @Column(name = "flags_json", columnDefinition = "TEXT")
  private String flagsJson;

  @Column(name = "reviewed_by_user_id")
  private Long reviewedByUserId;

  @Column(name = "is_reviewed")
  @Builder.Default
  private Boolean isReviewed = false;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;
}
