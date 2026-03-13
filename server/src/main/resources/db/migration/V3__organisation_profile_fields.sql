-- Add missing profile fields to organisations table
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS organisation_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS year_established INTEGER,
  ADD COLUMN IF NOT EXISTS state VARCHAR(100),
  ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255),
  ADD COLUMN IF NOT EXISTS annual_budget DECIMAL(19, 2);
