package com.bots.hackathon.ai.services;

import com.bots.hackathon.ai.dto.AITaskConfigRequest;
import com.bots.hackathon.ai.dto.AITaskConfigResponse;
import com.bots.hackathon.ai.model.AITaskConfig;
import com.bots.hackathon.ai.repo.AITaskConfigRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AITaskConfigService {

    private final AITaskConfigRepo repo;

    public List<AITaskConfigResponse> getAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public AITaskConfigResponse getById(Long id) {
        return repo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("AITaskConfig not found: " + id));
    }

    public AITaskConfigResponse create(AITaskConfigRequest request) {
        AITaskConfig entity = toEntity(request);
        return toResponse(repo.save(entity));
    }

    public AITaskConfigResponse update(Long id, AITaskConfigRequest request) {
        AITaskConfig entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("AITaskConfig not found: " + id));
        entity.setTaskCode(request.taskCode());
        entity.setTaskName(request.taskName());
        entity.setSystemPrompt(request.systemPrompt());
        entity.setProvider(request.provider());
        entity.setModel(request.model());
        entity.setMaxTokens(request.maxTokens());
        entity.setTemperature(request.temperature());
        return toResponse(repo.save(entity));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    private AITaskConfigResponse toResponse(AITaskConfig e) {
        return new AITaskConfigResponse(
                e.getId(), e.getTaskCode(), e.getTaskName(), e.getSystemPrompt(),
                e.getProvider(), e.getModel(), e.getMaxTokens(), e.getTemperature()
        );
    }

    private AITaskConfig toEntity(AITaskConfigRequest r) {
        AITaskConfig e = new AITaskConfig();
        e.setTaskCode(r.taskCode());
        e.setTaskName(r.taskName());
        e.setSystemPrompt(r.systemPrompt());
        e.setProvider(r.provider());
        e.setModel(r.model());
        e.setMaxTokens(r.maxTokens());
        e.setTemperature(r.temperature());
        return e;
    }
}
