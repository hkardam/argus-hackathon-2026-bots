package com.bots.hackathon.review.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "review_assignments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAssignment {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "application_id", nullable = false)
  private UUID applicationId;

  @Column(name = "reviewer_user_id", nullable = false)
  private Long reviewerUserId;

  @Column(name = "assigned_by_user_id")
  private Long assignedByUserId;

  @Column(name = "is_completed")
  @Builder.Default
  private Boolean isCompleted = false;

  @Column(name = "deadline")
  private LocalDateTime deadline;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;
}
