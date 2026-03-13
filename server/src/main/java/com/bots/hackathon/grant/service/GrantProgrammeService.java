package com.bots.hackathon.grant.service;

import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.grant.dto.GrantProgrammeResponse;
import com.bots.hackathon.grant.model.GrantProgramme;
import com.bots.hackathon.grant.repo.GrantProgrammeRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GrantProgrammeService {

    private final GrantProgrammeRepository grantProgrammeRepository;
    private final com.bots.hackathon.ai.services.AIService aiService;

    @Transactional
    public com.bots.hackathon.ai.dto.EligibilityAiResponse checkEligibility(
            com.bots.hackathon.ai.dto.EligibilityAiRequest request) {
        GrantProgrammeResponse gp = getProgrammeById(request.programmeId());
        return aiService.checkEligibility(request, gp);
    }

    @Transactional(readOnly = true)
    public List<GrantProgrammeResponse> getAllActiveProgrammes() {
        return grantProgrammeRepository.findByIsActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public GrantProgrammeResponse getProgrammeById(UUID id) {
        GrantProgramme programme =
                grantProgrammeRepository
                        .findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("GrantProgramme", id));
        return toResponse(programme);
    }

    private GrantProgrammeResponse toResponse(GrantProgramme programme) {
        return new GrantProgrammeResponse(
                programme.getId(),
                programme.getName(),
                programme.getDescription(),
                programme.getGrantType(),
                programme.getTotalBudget(),
                programme.getMaxAwardAmount(),
                programme.getApplicationOpenDate(),
                programme.getApplicationCloseDate(),
                programme.getEligibilityCriteria(),
                programme.getCurrentStage(),
                programme.getIsActive());
    }
}
