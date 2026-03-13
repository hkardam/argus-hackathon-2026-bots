package com.bots.hackathon.ai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "eligibility_check_interactions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityCheckInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "programme_id", nullable = false)
    private UUID programmeId;

    @Column(name = "applicant_id")
    private UUID applicantId;

    @Column(name = "request_data", columnDefinition = "TEXT")
    private String requestData;

    @Column(name = "eligible")
    private String eligible;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
