-- GrantFlow Platform Schema
-- All new tables use UUID primary keys

CREATE TABLE IF NOT EXISTS organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(255) UNIQUE,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(100),
    owner_user_id BIGINT NOT NULL REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grant_programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grant_type VARCHAR(50) NOT NULL,
    total_budget DECIMAL(19,2),
    max_award_amount DECIMAL(19,2),
    application_open_date DATE,
    application_close_date DATE,
    current_stage VARCHAR(50) DEFAULT 'SUBMISSION',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id UUID NOT NULL REFERENCES grant_programmes(id),
    organisation_id UUID NOT NULL REFERENCES organisations(id),
    applicant_user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    requested_amount DECIMAL(19,2),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP,
    sla_deadline TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_app_programme_id ON applications(programme_id);
CREATE INDEX IF NOT EXISTS idx_app_organisation_id ON applications(organisation_id);

CREATE TABLE IF NOT EXISTS application_section_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    section_key VARCHAR(255) NOT NULL,
    section_data TEXT NOT NULL,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    storage_path VARCHAR(500),
    uploaded_by_user_id BIGINT NOT NULL REFERENCES users(id),
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS eligibility_check_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    is_eligible BOOLEAN,
    ai_suggested BOOLEAN DEFAULT FALSE,
    criteria_results TEXT,
    notes TEXT,
    checked_by_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS screening_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    risk_level VARCHAR(50),
    ai_suggested BOOLEAN DEFAULT TRUE,
    summary TEXT,
    flags_json TEXT,
    reviewed_by_user_id BIGINT REFERENCES users(id),
    is_reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS review_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    reviewer_user_id BIGINT NOT NULL REFERENCES users(id),
    assigned_by_user_id BIGINT REFERENCES users(id),
    is_completed BOOLEAN DEFAULT FALSE,
    deadline TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    reviewer_user_id BIGINT NOT NULL REFERENCES users(id),
    assignment_id UUID REFERENCES review_assignments(id),
    score INTEGER,
    outcome VARCHAR(50),
    comments TEXT,
    ai_suggested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_review_application_id ON reviews(application_id);

CREATE TABLE IF NOT EXISTS risk_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    flag_type VARCHAR(255) NOT NULL,
    description TEXT,
    risk_level VARCHAR(50) NOT NULL,
    ai_suggested BOOLEAN DEFAULT TRUE,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS grant_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL UNIQUE REFERENCES applications(id),
    programme_id UUID NOT NULL REFERENCES grant_programmes(id),
    organisation_id UUID NOT NULL REFERENCES organisations(id),
    awarded_amount DECIMAL(19,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    approved_by_user_id BIGINT REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bank_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id),
    account_holder_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(255) NOT NULL,
    sort_code VARCHAR(50),
    iban VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disbursement_tranches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_award_id UUID NOT NULL REFERENCES grant_awards(id),
    tranche_number INTEGER NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    scheduled_date DATE,
    released_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    released_by_user_id BIGINT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_award_id UUID NOT NULL REFERENCES grant_awards(id),
    submitted_by_user_id BIGINT NOT NULL REFERENCES users(id),
    report_type VARCHAR(100) NOT NULL,
    content TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_report_grant_id ON reports(grant_award_id);

CREATE TABLE IF NOT EXISTS compliance_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_award_id UUID NOT NULL REFERENCES grant_awards(id),
    report_id UUID REFERENCES reports(id),
    status VARCHAR(50) NOT NULL DEFAULT 'UNDER_REVIEW',
    findings TEXT,
    ai_suggested BOOLEAN DEFAULT FALSE,
    reviewed_by_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS expenditure_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_award_id UUID NOT NULL REFERENCES grant_awards(id),
    category VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(19,2) NOT NULL,
    expenditure_date DATE NOT NULL,
    receipt_document_id UUID REFERENCES documents(id),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    verified_by_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id BIGINT NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    reference_type VARCHAR(100),
    reference_id VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS message_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(500) NOT NULL,
    application_id UUID REFERENCES applications(id),
    created_by_user_id BIGINT NOT NULL REFERENCES users(id),
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES message_threads(id),
    sender_user_id BIGINT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
