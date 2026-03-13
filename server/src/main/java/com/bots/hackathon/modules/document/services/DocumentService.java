package com.bots.hackathon.modules.document.services;

import com.bots.hackathon.modules.document.dto.DocumentResponse;
import com.bots.hackathon.modules.document.dto.DocumentUploadRequest;
import com.bots.hackathon.modules.document.model.DocumentEntity;
import com.bots.hackathon.modules.document.repo.DocumentRepository;
import com.bots.hackathon.modules.document.util.DocumentStatus;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DocumentService {

  private final DocumentRepository documentRepository;
  private final String uploadDir = "uploads/vault/";

  @Transactional
  public DocumentResponse uploadDocument(MultipartFile file, DocumentUploadRequest request)
      throws IOException {
    // Handle replacement: mark previous documents of same category for this user as
    // REPLACED
    List<DocumentEntity> existing =
        documentRepository.findByUserIdAndCategoryAndStatus(
            request.userId(), request.category(), DocumentStatus.ACTIVE);

    for (DocumentEntity entity : existing) {
      entity.setStatus(DocumentStatus.REPLACED);
      documentRepository.save(entity);
    }

    // Save file
    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
    Path path = Paths.get(uploadDir + fileName);
    Files.createDirectories(path.getParent());
    Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

    DocumentEntity newDoc =
        DocumentEntity.builder()
            .userId(request.userId())
            .category(request.category())
            .documentName(request.documentName())
            .filePath(path.toString())
            .contentType(file.getContentType())
            .fileSize(file.getSize())
            .status(DocumentStatus.ACTIVE)
            .build();

    return toResponse(documentRepository.save(newDoc));
  }

  @Transactional(readOnly = true)
  public List<DocumentResponse> getActiveDocuments(String userId) {
    return documentRepository.findByUserIdAndStatus(userId, DocumentStatus.ACTIVE).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<DocumentResponse> getAllDocuments(String userId) {
    return documentRepository.findByUserId(userId).stream().map(this::toResponse).toList();
  }

  @Transactional
  public void deleteDocument(UUID id) {
    documentRepository.deleteById(id);
  }

  private DocumentResponse toResponse(DocumentEntity entity) {
    return new DocumentResponse(
        entity.getId(),
        entity.getUserId(),
        entity.getCategory(),
        entity.getDocumentName(),
        entity.getFilePath(),
        entity.getContentType(),
        entity.getFileSize(),
        entity.getStatus(),
        entity.getUploadedAt());
  }
}
