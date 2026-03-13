package com.bots.hackathon.ai.controller;

import com.bots.hackathon.ai.dto.ChatRequest;
import com.bots.hackathon.ai.dto.ChatResponse;
import com.bots.hackathon.ai.services.ChatbotService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-chat")
public class ChatbotController {
    ChatbotService chatbotService;

    @PostMapping("/{sessionId}")
    public ChatResponse chat(@PathVariable String sessionId, @RequestBody ChatRequest req) {

        return chatbotService.processMessage(sessionId, req);
    }
}
