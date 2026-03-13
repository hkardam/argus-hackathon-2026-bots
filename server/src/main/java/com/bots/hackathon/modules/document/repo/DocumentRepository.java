package com.bots.hackathon.modules.document.repo;

import com.bots.hackathon.modules.document.model.DocumentEntity;
import com.bots.hackathon.modules.document.util.DocumentStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, UUID> {
  List<DocumentEntity> findByUserIdAndStatus(String userId, DocumentStatus status);

  List<DocumentEntity> findByUserIdAndCategoryAndStatus(
      String userId, String category, DocumentStatus status);

  List<DocumentEntity> findByUserId(String userId);
}
