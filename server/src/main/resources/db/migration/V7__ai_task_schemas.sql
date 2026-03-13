CREATE TABLE IF NOT EXISTS ai_task_config (
    id BIGSERIAL PRIMARY KEY,
    task_code VARCHAR(255) NOT NULL UNIQUE,
    task_name VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(255) NOT NULL,
    max_tokens INTEGER NOT NULL,
    temperature DOUBLE PRECISION NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_task_code ON ai_task_config(task_code);
