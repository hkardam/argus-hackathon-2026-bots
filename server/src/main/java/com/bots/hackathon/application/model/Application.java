package com.bots.hackathon.application.model;

import com.bots.hackathon.common.enums.ApplicationStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
    name = "applications",
    indexes = {
      @Index(name = "idx_app_programme_id", columnList = "programme_id"),
      @Index(name = "idx_app_organisation_id", columnList = "organisation_id")
    })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Application {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "programme_id", nullable = false)
  private UUID programmeId;

  @Column(name = "organisation_id", nullable = false)
  private UUID organisationId;

  @Column(name = "applicant_user_id", nullable = false)
  private Long applicantUserId;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String summary;

  @Column(name = "requested_amount", precision = 19, scale = 2)
  private BigDecimal requestedAmount;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private ApplicationStatus status = ApplicationStatus.DRAFT;

  @Column(name = "submitted_at")
  private LocalDateTime submittedAt;

  @Column(name = "sla_deadline")
  private LocalDateTime slaDeadline;

  @Column(nullable = false)
  @Builder.Default
  private Boolean deleted = false;

  @Column(name = "deleted_at")
  private LocalDateTime deletedAt;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
