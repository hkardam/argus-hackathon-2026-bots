package com.bots.hackathon.eligibility.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "eligibility_check_results")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityCheckResult {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "application_id", nullable = false)
  private UUID applicationId;

  @Column(name = "is_eligible")
  private Boolean isEligible;

  @Column(name = "ai_suggested")
  @Builder.Default
  private Boolean aiSuggested = false;

  @Column(name = "criteria_results", columnDefinition = "TEXT")
  private String criteriaResults;

  @Column(columnDefinition = "TEXT")
  private String notes;

  @Column(name = "checked_by_user_id")
  private Long checkedByUserId;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;
}
