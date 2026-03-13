package com.bots.hackathon.organisation.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "organisations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organisation {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String name;

  @Column(name = "registration_number", unique = true)
  private String registrationNumber;

  @Enumerated(EnumType.STRING)
  @Column(name = "organisation_type")
  private OrganisationType organisationType;

  @Column(name = "year_established")
  private Integer yearEstablished;

  @Column(name = "state")
  private String state;

  @Column(name = "contact_person")
  private String contactPerson;

  @Column(columnDefinition = "TEXT")
  private String address;

  @Column(name = "contact_email")
  private String contactEmail;

  @Column(name = "contact_phone")
  private String contactPhone;

  @Column(name = "annual_budget", precision = 19, scale = 2)
  private BigDecimal annualBudget;

  @Column(name = "owner_user_id", nullable = false)
  private Long ownerUserId;

  @Column(name = "is_verified")
  @Builder.Default
  private Boolean isVerified = false;

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
