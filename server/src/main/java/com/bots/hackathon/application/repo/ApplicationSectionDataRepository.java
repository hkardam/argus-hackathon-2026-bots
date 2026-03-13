package com.bots.hackathon.application.repo;

import com.bots.hackathon.application.model.ApplicationSectionData;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationSectionDataRepository
    extends JpaRepository<ApplicationSectionData, UUID> {

  List<ApplicationSectionData> findByApplicationId(UUID applicationId);

  Optional<ApplicationSectionData> findByApplicationIdAndSectionKey(
      UUID applicationId, String sectionKey);
}
