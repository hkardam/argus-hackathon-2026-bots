package com.bots.hackathon.ai.repo;

import com.bots.hackathon.ai.model.EligibilityCheckInteraction;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EligibilityCheckInteractionRepository
        extends JpaRepository<EligibilityCheckInteraction, UUID> {}
