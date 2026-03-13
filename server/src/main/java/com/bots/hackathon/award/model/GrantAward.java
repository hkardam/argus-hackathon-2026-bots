package com.bots.hackathon.award.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "grant_awards")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrantAward {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id", nullable = false, unique = true)
    private UUID applicationId;

    @Column(name = "programme_id", nullable = false)
    private UUID programmeId;

    @Column(name = "organisation_id", nullable = false)
    private UUID organisationId;

    @Column(name = "awarded_amount", precision = 19, scale = 2, nullable = false)
    private BigDecimal awardedAmount;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "approved_by_user_id")
    private Long approvedByUserId;

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
