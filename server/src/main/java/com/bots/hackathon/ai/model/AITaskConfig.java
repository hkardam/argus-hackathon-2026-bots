package com.bots.hackathon.ai.model;

import com.bots.hackathon.ai.dto.LLMProviderEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "ai_task_config")
public class AITaskConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique identifier for the task Example: DOC_SUMMARY, RISK_ANALYZER, CHAT_ASSISTANT */
    @Column(unique = true, nullable = false)
    private String taskCode;

    /** Human readable name */
    @Column(nullable = false)
    private String taskName;

    /** System prompt sent to LLM */
    @Column(columnDefinition = "TEXT")
    private String systemPrompt;

    /** LLM provider to use */
    @Enumerated(EnumType.STRING)
    private LLMProviderEnum provider;

    /** Optional model override Example: claude-sonnet-4-6, gemini-2.0-flash */
    @Column() private String model;

    /** Max tokens for generation */
    @Column() private Integer maxTokens;

    /** Temperature for randomness */
    @Column() private Double temperature;
}
