package com.bots.hackathon.modules.document.dto;

import com.bots.hackathon.modules.document.util.DocumentStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentResponse(
    UUID id,
    String userId,
    String category,
    String documentName,
    String filePath,
    String contentType,
    Long fileSize,
    DocumentStatus status,
    LocalDateTime uploadedAt) {}
