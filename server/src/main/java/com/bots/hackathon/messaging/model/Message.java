package com.bots.hackathon.messaging.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "messages")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "thread_id", nullable = false)
  private UUID threadId;

  @Column(name = "sender_user_id", nullable = false)
  private Long senderUserId;

  @Column(name = "content", columnDefinition = "TEXT", nullable = false)
  private String content;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;
}
