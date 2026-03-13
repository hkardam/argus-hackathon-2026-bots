package com.bots.hackathon.modules.document.model;

import com.bots.hackathon.modules.document.util.DocumentStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "vault_documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "category", nullable = false)
  private String category;

  @Column(name = "document_name", nullable = false)
  private String documentName;

  @Column(name = "file_path", nullable = false)
  private String filePath;

  @Column(name = "content_type")
  private String contentType;

  @Column(name = "file_size")
  private Long fileSize;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  @Builder.Default
  private DocumentStatus status = DocumentStatus.ACTIVE;

  @CreationTimestamp
  @Column(name = "uploaded_at", updatable = false)
  private LocalDateTime uploadedAt;
}
