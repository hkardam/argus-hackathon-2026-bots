-- AI Module Schemas
-- Consolidates all tables for the AI module

-- Task configuration for various AI features (Doc Summary, Risk Analysis, etc.)
CREATE TABLE IF NOT EXISTS ai_task_config (
    id BIGSERIAL PRIMARY KEY,
    task_code VARCHAR(255) NOT NULL UNIQUE,
    task_name VARCHAR(255) NOT NULL,
    system_prompt TEXT,
    provider VARCHAR(50),
    model VARCHAR(255),
    max_tokens INTEGER,
    temperature DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat bot message logs and session state
CREATE TABLE IF NOT EXISTS chat_bot_message (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    author VARCHAR(50) NOT NULL,
    message TEXT,
    got_to_next_question BOOLEAN DEFAULT FALSE,
    next_message TEXT,
    next_field VARCHAR(255),
    form_output TEXT,
    process_percent INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_ai_task_code ON ai_task_config(task_code);
CREATE INDEX IF NOT EXISTS idx_chat_bot_session_id ON chat_bot_message(session_id);
