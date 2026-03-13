-- Add missing columns to reviews table
ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS dimension_scores_json TEXT,
    ADD COLUMN IF NOT EXISTS highlights_json TEXT;

-- Create review_packages table
CREATE TABLE IF NOT EXISTS review_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    summary_json TEXT,
    ai_suggested_scores_json TEXT,
    risk_flags_json TEXT,
    generated_at TIMESTAMP
);

CREATE INDEX idx_review_package_application_id ON review_packages(application_id);
