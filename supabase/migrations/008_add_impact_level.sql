-- Add impact_level column for onboarding assessment
-- Stores descriptive values: mild, moderate, significant, severe, unsure
ALTER TABLE users ADD COLUMN IF NOT EXISTS impact_level TEXT;