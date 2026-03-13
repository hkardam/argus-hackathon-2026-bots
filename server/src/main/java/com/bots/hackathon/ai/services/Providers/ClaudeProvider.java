package com.bots.hackathon.ai.services.Providers;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.bots.hackathon.ai.dto.LLMProviderEnum;
import com.bots.hackathon.ai.dto.LLMRequest;
import com.bots.hackathon.ai.dto.LLMResponse;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ClaudeProvider implements LLMProvider {

    @Value("${ai.llm.api-key}")
    private String apiKey;

    @Value("${ai.llm.default-model:claude-sonnet-4-6}")
    private String defaultModel;

    private AnthropicClient client;

    @PostConstruct
    public void init() {
        if (apiKey == null || apiKey.isBlank()) {
            return;
            // TODO: fix
        }
        client = AnthropicOkHttpClient.builder().apiKey(apiKey).build();
    }

    @Override
    public LLMResponse execute(LLMRequest request) {

        long start = System.currentTimeMillis();

        MessageCreateParams.Builder paramsBuilder =
                MessageCreateParams.builder()
                        .model(Model.of(defaultModel))
                        .maxTokens(2048L)
                        .addUserMessage(buildUserMessage(request));

        if (request.getSystemPrompt() != null && !request.getSystemPrompt().isBlank()) {
            paramsBuilder.system(request.getSystemPrompt());
        }

        Message message = client.messages().create(paramsBuilder.build());

        String output =
                message.content().stream()
                        .filter(c -> c.isText())
                        .map(c -> c.asText().text())
                        .collect(Collectors.joining("\n"));

        int tokensUsed = 0;
        if (message.usage() != null) {
            tokensUsed = (int) (message.usage().inputTokens() + message.usage().outputTokens());
        }

        LLMResponse response = new LLMResponse();
        response.setOutput(output);
        response.setTokensUsed(tokensUsed);
        response.setTimespent(System.currentTimeMillis() - start);

        return response;
    }

    @Override
    public LLMProviderEnum getProviderType() {
        return LLMProviderEnum.CLAUDE;
    }

    private String buildUserMessage(LLMRequest request) {

        StringBuilder sb = new StringBuilder();

        if (request.getUserContextText() != null && !request.getUserContextText().isBlank()) {
            sb.append("Context:\n").append(request.getUserContextText()).append("\n\n");
        }

        List<String> files = request.getUserContextFiles();
        if (files != null && !files.isEmpty()) {

            sb.append("Files Context:\n");

            files.stream()
                    .filter(Objects::nonNull)
                    .forEach(
                            file -> {
                                sb.append(file).append("\n");
                            });

            sb.append("\n");
        }

        sb.append("User Prompt:\n");
        sb.append(request.getUserPrompt());

        return sb.toString();
    }
}
