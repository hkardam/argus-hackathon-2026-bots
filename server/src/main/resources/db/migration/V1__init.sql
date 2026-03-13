CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  "name" varchar(255) NULL,
  email varchar(255) NULL UNIQUE,
  oauth2_provider_id varchar(255) NULL,
  "role" varchar(50) NULL,
  password_hash varchar(255) NULL,
  created_at timestamptz NULL,
  is_email_verified bool NOT NULL,
  is_active bool NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id BIGINT,
    role VARCHAR(50),
    action_type VARCHAR(255) NOT NULL,
    object_type VARCHAR(255),
    object_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata_json TEXT
);
