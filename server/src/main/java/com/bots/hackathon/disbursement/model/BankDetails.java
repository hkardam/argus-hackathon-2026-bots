package com.bots.hackathon.disbursement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "bank_details")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "organisation_id", nullable = false)
  private UUID organisationId;

  @Column(name = "account_holder_name", nullable = false)
  private String accountHolderName;

  @Column(name = "bank_name", nullable = false)
  private String bankName;

  @Column(name = "account_number", nullable = false)
  private String accountNumber;

  @Column(name = "sort_code")
  private String sortCode;

  @Column(name = "iban")
  private String iban;

  @Column(name = "is_verified")
  @Builder.Default
  private Boolean isVerified = false;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
