package com.bots.hackathon.application.repo;

import com.bots.hackathon.application.model.Document;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, UUID> {

    List<Document> findByApplicationIdAndDeletedFalse(UUID applicationId);
}
