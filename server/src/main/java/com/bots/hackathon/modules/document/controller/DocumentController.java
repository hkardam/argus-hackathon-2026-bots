package com.bots.hackathon.modules.document.controller;

import com.bots.hackathon.modules.document.dto.DocumentResponse;
import com.bots.hackathon.modules.document.dto.DocumentUploadRequest;
import com.bots.hackathon.modules.document.services.DocumentService;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

  private final DocumentService documentService;

  @PostMapping("/upload")
  public ResponseEntity<DocumentResponse> uploadDocument(
      @RequestParam("file") MultipartFile file,
      @RequestParam("userId") String userId,
      @RequestParam("category") String category,
      @RequestParam("documentName") String documentName)
      throws IOException {

    DocumentUploadRequest request = new DocumentUploadRequest(userId, category, documentName);
    return ResponseEntity.ok(documentService.uploadDocument(file, request));
  }

  @GetMapping
  public ResponseEntity<List<DocumentResponse>> getDocuments(
      @RequestParam("userId") String userId,
      @RequestParam(value = "includeReplaced", defaultValue = "false") boolean includeReplaced) {

    if (includeReplaced) {
      return ResponseEntity.ok(documentService.getAllDocuments(userId));
    } else {
      return ResponseEntity.ok(documentService.getActiveDocuments(userId));
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
    documentService.deleteDocument(id);
    return ResponseEntity.noContent().build();
  }
}
