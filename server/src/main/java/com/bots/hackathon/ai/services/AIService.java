package com.bots.hackathon.ai.services;

import com.bots.hackathon.ai.dto.AITaskConfigResponse;
import com.bots.hackathon.ai.dto.EligibilityAiRequest;
import com.bots.hackathon.ai.dto.EligibilityAiResponse;
import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;
import com.bots.hackathon.ai.model.EligibilityCheckInteraction;
import com.bots.hackathon.ai.repo.EligibilityCheckInteractionRepository;
import com.bots.hackathon.grant.dto.GrantProgrammeResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {
    private final AITaskConfigService aiTaskConfigService;
    private final LLMService llmService;
    private final EligibilityCheckInteractionRepository interactionRepo;
    private final ObjectMapper objectMapper;

    public EligibilityAiResponse checkEligibility(
            EligibilityAiRequest request, GrantProgrammeResponse grantProgrammeResponse) {
        AITaskConfigResponse config = aiTaskConfigService.getByTaskCode("ELIGIBILITY_CHECK");
        LLMRequest llmRequest = new LLMRequest();
        llmRequest.setSystemPrompt(config.getSystemPrompt());

        String dataJson;
        try {
            dataJson = objectMapper.writeValueAsString(request.data());
        } catch (Exception e) {
            dataJson = request.data().toString();
        }

        String userContext =
                "Grant Programme Description: "
                        + grantProgrammeResponse.description()
                        + "\n"
                        + "Grant Programme Eligibility Criteria: "
                        + grantProgrammeResponse.eligibilityCriteria()
                        + "\n"
                        + "User Submitted Information: "
                        + dataJson;

        llmRequest.setUserContextText(userContext);

        llmRequest.setProvider(config.getProvider());
        llmRequest.setModel(config.getModel());
        llmRequest.setMaxTokens(config.getMaxTokens());
        llmRequest.setTemperature(config.getTemperature());

        LLMResponse llmResponse = llmService.executeTask(llmRequest);

        EligibilityAiResponse response;
        try {
            response = objectMapper.readValue(llmResponse.getOutput(), EligibilityAiResponse.class);
        } catch (Exception e) {
            // Simple parsing fallback if needed
            throw new RuntimeException("Failed to parse eligibility response", e);
        }

        // Store interaction
        EligibilityCheckInteraction interaction =
                EligibilityCheckInteraction.builder()
                        .programmeId(request.programmeId())
                        .applicantId(request.applicantId())
                        .requestData(dataJson)
                        .eligible(response.eligible())
                        .feedback(response.feedback())
                        .build();
        interactionRepo.save(interaction);

        return response;
    }

    public LLMResponse eligibiltyScreening() {
        AITaskConfigResponse config = aiTaskConfigService.getByTaskCode("ELIGIBILITY_SCREENING");
        LLMRequest request = new LLMRequest();
        request.setSystemPrompt(config.getSystemPrompt());

        // TODO: get from params
        request.setUserContextText(null);
        request.setUserContextFiles(null);

        request.setModel(config.getModel());
        request.setMaxTokens(config.getMaxTokens());
        request.setTemperature(config.getTemperature());
        return llmService.executeTask(request);
    }

    public LLMResponse reviewPackage() {
        AITaskConfigResponse config = aiTaskConfigService.getByTaskCode("REVIEW_PACKAGE");
        LLMRequest request = new LLMRequest();
        request.setSystemPrompt(config.getSystemPrompt());

        // TODO: get from params
        request.setUserContextText(null);
        request.setUserContextFiles(null);

        request.setModel(config.getModel());
        request.setMaxTokens(config.getMaxTokens());
        request.setTemperature(config.getTemperature());
        return llmService.executeTask(request);
    }

    public LLMResponse complianceAnalysis() {
        AITaskConfigResponse config = aiTaskConfigService.getByTaskCode("COMPLIANCE_ANALYSIS");
        LLMRequest request = new LLMRequest();
        request.setSystemPrompt(config.getSystemPrompt());

        // TODO: get from params
        request.setUserContextText(null);
        request.setUserContextFiles(null);

        request.setModel(config.getModel());
        request.setMaxTokens(config.getMaxTokens());
        request.setTemperature(config.getTemperature());
        return llmService.executeTask(request);
    }
}
