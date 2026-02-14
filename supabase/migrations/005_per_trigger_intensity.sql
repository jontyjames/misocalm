-- Per-trigger intensity tracking + environment field
-- trigger_intensities: JSONB map of trigger name to intensity (0-10)
-- environment: optional location context (replaces source for new logs)

ALTER TABLE trigger_logs ADD COLUMN IF NOT EXISTS trigger_intensities JSONB;
ALTER TABLE trigger_logs ADD COLUMN IF NOT EXISTS environment TEXT;
