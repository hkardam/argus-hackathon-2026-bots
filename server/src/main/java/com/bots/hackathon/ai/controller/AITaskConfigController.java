package com.bots.hackathon.ai.controller;

import com.bots.hackathon.ai.dto.AITaskConfigRequest;
import com.bots.hackathon.ai.dto.AITaskConfigResponse;
import com.bots.hackathon.ai.services.AITaskConfigService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-task-configs")
@RequiredArgsConstructor
public class AITaskConfigController {

    private final AITaskConfigService service;

    @GetMapping
    public List<AITaskConfigResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public AITaskConfigResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AITaskConfigResponse create(@RequestBody AITaskConfigRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public AITaskConfigResponse update(
            @PathVariable Long id, @RequestBody AITaskConfigRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
