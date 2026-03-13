package com.bots.hackathon.ai.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bots.hackathon.ai.dto.ChatRequest;
import com.bots.hackathon.ai.dto.ChatResponse;
import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;
import com.bots.hackathon.ai.model.AITaskConfig;
import com.bots.hackathon.ai.model.ChatAuthor;
import com.bots.hackathon.ai.model.ChatbotMessage;
import com.bots.hackathon.ai.repo.AITaskConfigRepo;
import com.bots.hackathon.ai.repo.ChatbotTextRepo;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatbotTextRepo chatRepo;
    private final AITaskConfigRepo configRepo;
    private final LLMService llmService;
    private final ObjectMapper objectMapper;

    public ChatResponse processMessage(String sessionId, ChatRequest request) {
        // 1. Get base prompt
        String tempTaskCode = "CHAT_ASSISTANT";
        if (request.getMetadata() != null && request.getMetadata().containsKey("taskCode")) {
            tempTaskCode = (String) request.getMetadata().get("taskCode");
        }
        final String finalTaskCode = tempTaskCode;
        AITaskConfig config = configRepo.findByTaskCode(finalTaskCode)
                .orElseThrow(() -> new RuntimeException("AI Task Config not found: " + finalTaskCode));

        // 2. Get chat history
        List<ChatbotMessage> history = chatRepo.findBySessionIdOrderByCreatedAtAsc(sessionId);

        // 3. Identify flow status
        if (!history.isEmpty()) {
            ChatbotMessage latest = history.get(history.size() - 1);
            if (latest.isCompleted()) {
                throw new RuntimeException("chat close");
            }
        }

        // 4. Save user message
        ChatbotMessage userMsg = new ChatbotMessage();
        userMsg.setSessionId(sessionId);
        userMsg.setAuthor(ChatAuthor.USER);
        userMsg.setMessage(request.getMessage());
        chatRepo.save(userMsg);

        // 5. Prepare LLMRequest
        LLMRequest llmRequest = new LLMRequest();
        llmRequest.setSystemPromt(config.getSystemPrompt());
        llmRequest.setUserPrompt(request.getMessage());
        llmRequest.setProvider(config.getProvider());

        // Combine messages into label text and add context fields
        StringBuilder userContext = new StringBuilder();
        for (ChatbotMessage msg : history) {
            userContext.append(msg.getAuthor()).append(": ").append(msg.getMessage()).append("\n");
        }

        if (!history.isEmpty()) {
            ChatbotMessage lastEntry = history.get(history.size() - 1);
            userContext.append("\nLatest Form Output: ").append(lastEntry.getFormOutput());
            userContext.append("\nLatest Next Field: ").append(lastEntry.getNextField());
            userContext.append("\nLatest Process Percent: ").append(lastEntry.getProcessPercent());
        }

        llmRequest.setUserContextText(userContext.toString());

        // 6. Generate ChatResponse via LLMService
        ChatResponse chatResponse = executeLLM(llmRequest);
        chatResponse.setSessionId(sessionId);

        // 7. Save bot response
        ChatbotMessage botMsg = new ChatbotMessage();
        botMsg.setSessionId(sessionId);
        botMsg.setAuthor(ChatAuthor.SYSTEM);
        botMsg.setMessage(chatResponse.getReply());
        botMsg.setGotToNextQuestion(chatResponse.getGotToNextQuestion());
        botMsg.setNextMessage(chatResponse.getNextMessage());
        botMsg.setNextField(chatResponse.getNextField());
        botMsg.setFormOutput(chatResponse.getFormOutput());
        botMsg.setProcessPercent(chatResponse.getProgressPercent());
        botMsg.setCompleted(chatResponse.isCompleted());
        chatRepo.save(botMsg);

        return chatResponse;
    }

    private ChatResponse executeLLM(LLMRequest request) {
        LLMResponse llmResponse = llmService.executeTask(request);
        try {
            return objectMapper.readValue(llmResponse.getOutput(), ChatResponse.class);
        } catch (Exception e) {
            ChatResponse response = new ChatResponse();
            response.setReply(llmResponse.getOutput());
            return response;
        }
    }
}
