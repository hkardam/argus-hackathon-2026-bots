package com.bots.hackathon.audit.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Immutable Audit Log Entity. Deliberately omitting @Setter on class level to strictly enforce
 * immutability post-persistence.
 */
@Entity
@Table(name = "audit_logs")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA requires a no-arg constructor
@AllArgsConstructor(access = AccessLevel.PRIVATE) // Builder uses this
public class AuditLogEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "actor_id", updatable = false)
  private Long actorId;

  @Column(name = "role", updatable = false)
  private String role;

  @Column(name = "action_type", nullable = false, updatable = false)
  private String actionType;

  @Column(name = "object_type", updatable = false)
  private String objectType;

  @Column(name = "object_id", updatable = false)
  private String objectId;

  @CreationTimestamp
  @Column(name = "timestamp", nullable = false, updatable = false)
  private LocalDateTime timestamp;

  @Column(name = "metadata_json", columnDefinition = "TEXT", updatable = false)
  private String metadataJson;
}
