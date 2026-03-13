package com.bots.hackathon.ai.services.Providers;

import com.bots.hackathon.ai.dto.LLMProviderEnum;
import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OpenAIProvider implements LLMProvider {

    @Value("${ai.openai.api-key:}")
    private String apiKey;

    @Value("${ai.openai.default-model:gpt-4o-mini}")
    private String defaultModel;

    private OpenAIClient client;

    @PostConstruct
    public void init() {
        if (apiKey != null && !apiKey.isBlank()) {
            client = OpenAIOkHttpClient.builder().apiKey(apiKey).build();
        }
    }

    @Override
    public LLMResponse execute(LLMRequest request) {
        if (client == null) {
            LLMResponse errorResponse = new LLMResponse();
            errorResponse.setOutput("OpenAI Client not initialized. Check API Key.");
            return errorResponse;
        }

        long start = System.currentTimeMillis();

        try {
            ChatCompletionCreateParams.Builder paramsBuilder = ChatCompletionCreateParams.builder();

            String modelStr = request.getModel() != null ? request.getModel() : defaultModel;
            paramsBuilder.model(ChatModel.of(modelStr));

            if (request.getSystemPrompt() != null && !request.getSystemPrompt().isBlank()) {
                paramsBuilder.addSystemMessage(request.getSystemPrompt());
            }

            paramsBuilder.addUserMessage(buildUserMessage(request));

            if (request.getMaxTokens() != null) {
                paramsBuilder.maxCompletionTokens(request.getMaxTokens().longValue());
            }
            if (request.getTemperature() != null) {
                paramsBuilder.temperature(request.getTemperature());
            }

            ChatCompletion chatCompletion = client.chat().completions().create(paramsBuilder.build());

            int tokensUsed = 0;

            if (chatCompletion != null && !chatCompletion.choices().isEmpty()) {
                output = chatCompletion.choices().get(0).message().content().orElse("");
                if (chatCompletion.usage().isPresent()) {
                    tokensUsed = (int) chatCompletion.usage().get().totalTokens();
                }
            }

            LLMResponse response = new LLMResponse();
            response.setOutput(output);
            response.setTokensUsed(tokensUsed);
            response.setTimespent(System.currentTimeMillis() - start);
            return response;

        } catch (Exception e) {
            LLMResponse errorResponse = new LLMResponse();
            errorResponse.setOutput("Error calling OpenAI SDK: " + e.getMessage());
            errorResponse.setTimespent(System.currentTimeMillis() - start);
            return errorResponse;
        }
    }

    @Override
    public LLMProviderEnum getProviderType() {
        return LLMProviderEnum.OPEN_AI;
    }

    private String buildUserMessage(LLMRequest request) {
        StringBuilder sb = new StringBuilder();

        if (request.getUserContextText() != null && !request.getUserContextText().isBlank()) {
            sb.append("Context:\n").append(request.getUserContextText()).append("\n\n");
        }

        List<String> files = request.getUserContextFiles();
        if (files != null && !files.isEmpty()) {
            sb.append("Files Context:\n");
            files.stream().filter(Objects::nonNull).forEach(file -> sb.append(file).append("\n"));
            sb.append("\n");
        }

        sb.append("User Prompt:\n");
        sb.append(request.getUserPrompt() != null ? request.getUserPrompt() : "");

        return sb.toString();
    }
}
