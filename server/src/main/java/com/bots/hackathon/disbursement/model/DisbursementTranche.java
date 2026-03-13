package com.bots.hackathon.disbursement.model;

import com.bots.hackathon.common.enums.DisbursementStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "disbursement_tranches")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementTranche {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "grant_award_id", nullable = false)
    private UUID grantAwardId;

    @Column(name = "tranche_number", nullable = false)
    private Integer trancheNumber;

    @Column(name = "amount", precision = 19, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "released_date")
    private LocalDate releasedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DisbursementStatus status = DisbursementStatus.SCHEDULED;

    @Column(name = "released_by_user_id")
    private Long releasedByUserId;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
