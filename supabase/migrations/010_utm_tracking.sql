-- 010: Add UTM tracking columns to analytics_sessions
-- Captures traffic source from UTM parameters in URLs

ALTER TABLE analytics_sessions
  ADD COLUMN IF NOT EXISTS utm_source  text,
  ADD COLUMN IF NOT EXISTS utm_medium  text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term    text,
  ADD COLUMN IF NOT EXISTS utm_content text;

-- Index for querying by source (most common filter)
CREATE INDEX IF NOT EXISTS idx_sessions_utm_source
  ON analytics_sessions (utm_source)
  WHERE utm_source IS NOT NULL;
