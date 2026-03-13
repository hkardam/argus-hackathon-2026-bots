package com.bots.hackathon.ai.repo;

import com.bots.hackathon.ai.model.AITaskConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AITaskConfigRepo extends JpaRepository<AITaskConfig, Long> {
    java.util.Optional<AITaskConfig> findByTaskCode(String taskCode);
}
