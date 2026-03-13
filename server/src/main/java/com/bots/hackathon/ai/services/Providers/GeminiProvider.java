package com.bots.hackathon.ai.services.Providers;

import com.bots.hackathon.ai.dto.LLMProviderEnum;
import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class GeminiProvider implements LLMProvider {

    @Value("${ai.gemini.api-key:}")
    private String apiKey;

    @Value("${ai.gemini.default-model:gemini-2.0-flash}")
    private String defaultModel;

    private Client client;

//    @PostConstruct
    public void init() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is missing");
        }

        client = Client.builder().apiKey(apiKey).build();
    }

    @Override
    public LLMResponse execute(LLMRequest request) {

        long start = System.currentTimeMillis();

        GenerateContentConfig.Builder configBuilder = GenerateContentConfig.builder();

        if (request.getSystemPrompt() != null && !request.getSystemPrompt().isBlank()) {
            configBuilder.systemInstruction(
                    Content.fromParts(Part.fromText(request.getSystemPrompt())));
        }

        GenerateContentResponse response =
                client.models.generateContent(
                        defaultModel,
                        Content.fromParts(Part.fromText(buildUserMessage(request))),
                        configBuilder.build());

        LLMResponse llmResponse = new LLMResponse();

        String output = "";
        if (response != null && response.text() != null) {
            output = response.text();
        }

        llmResponse.setOutput(output);
        llmResponse.setTimespent(System.currentTimeMillis() - start);

        int tokensUsed = 0;

        if (response != null
                && response.usageMetadata() != null
                && response.usageMetadata().isPresent()) {

            tokensUsed = response.usageMetadata().get().totalTokenCount().orElse(0).intValue();
        }

        llmResponse.setTokensUsed(tokensUsed);

        return llmResponse;
    }

    @Override
    public LLMProviderEnum getProviderType() {
        return LLMProviderEnum.GEMINI;
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
        sb.append(request.getUserPrompt());

        return sb.toString();
    }
}
