package com.bots.hackathon.review.model;

import com.bots.hackathon.common.enums.ReviewOutcome;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(
    name = "reviews",
    indexes = {@Index(name = "idx_review_application_id", columnList = "application_id")})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "application_id", nullable = false)
  private UUID applicationId;

  @Column(name = "reviewer_user_id", nullable = false)
  private Long reviewerUserId;

  @Column(name = "assignment_id")
  private UUID assignmentId;

  @Column(name = "score")
  private Integer score;

  @Enumerated(EnumType.STRING)
  @Column(name = "outcome")
  private ReviewOutcome outcome;

  @Column(name = "comments", columnDefinition = "TEXT")
  private String comments;

  @Column(name = "ai_suggested")
  @Builder.Default
  private Boolean aiSuggested = false;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;
}
