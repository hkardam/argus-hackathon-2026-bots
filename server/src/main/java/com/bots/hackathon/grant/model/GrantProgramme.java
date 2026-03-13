package com.bots.hackathon.grant.model;

import com.bots.hackathon.common.enums.GrantType;
import com.bots.hackathon.common.enums.WorkflowStage;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "grant_programmes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrantProgramme {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "grant_type", nullable = false)
  private GrantType grantType;

  @Column(name = "total_budget", precision = 19, scale = 2)
  private BigDecimal totalBudget;

  @Column(name = "max_award_amount", precision = 19, scale = 2)
  private BigDecimal maxAwardAmount;

  @Column(name = "application_open_date")
  private LocalDate applicationOpenDate;

  @Column(name = "application_close_date")
  private LocalDate applicationCloseDate;

  @Enumerated(EnumType.STRING)
  @Column(name = "current_stage")
  @Builder.Default
  private WorkflowStage currentStage = WorkflowStage.SUBMISSION;

  @Column(name = "is_active")
  @Builder.Default
  private Boolean isActive = true;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
