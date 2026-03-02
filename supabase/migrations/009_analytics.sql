-- Migration 009: Analytics & User Journey Tracking
-- Append-only event log + session summaries for complete user journey visibility
-- Privacy-respecting: no PII stored, RLS enabled, admin access server-side only

-- ════════════════════════════════════════════════════════════
-- 1. analytics_events — Append-only event log
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  event_name text NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}',
  page_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Query patterns: user journey, event filtering, session replay, time-range
CREATE INDEX idx_analytics_events_user_time
  ON analytics_events (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

CREATE INDEX idx_analytics_events_anon_time
  ON analytics_events (anonymous_id, created_at DESC);

CREATE INDEX idx_analytics_events_event_time
  ON analytics_events (event_name, created_at DESC);

CREATE INDEX idx_analytics_events_session
  ON analytics_events (session_id, created_at ASC);

-- Partial index for onboarding funnel queries
CREATE INDEX idx_analytics_events_onboarding
  ON analytics_events (anonymous_id, created_at ASC)
  WHERE event_name LIKE 'onboarding_%';

-- ════════════════════════════════════════════════════════════
-- 2. analytics_sessions — Session summaries
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS analytics_sessions (
  id text PRIMARY KEY,
  anonymous_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now(),
  duration_ms integer DEFAULT 0,
  device_type text,
  entry_page text,
  referrer text,
  properties jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_analytics_sessions_anon
  ON analytics_sessions (anonymous_id, started_at DESC);

CREATE INDEX idx_analytics_sessions_user
  ON analytics_sessions (user_id, started_at DESC)
  WHERE user_id IS NOT NULL;

CREATE INDEX idx_analytics_sessions_active
  ON analytics_sessions (last_active_at DESC);

-- ════════════════════════════════════════════════════════════
-- 3. Row Level Security
-- ════════════════════════════════════════════════════════════
-- All writes go through service role API routes (bypass RLS).
-- Client-side: users can only read their own data.

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Users can read their own events
CREATE POLICY "Users can read own events"
  ON analytics_events FOR SELECT
  USING (user_id = auth.uid());

-- Users can read their own sessions
CREATE POLICY "Users can read own sessions"
  ON analytics_sessions FOR SELECT
  USING (user_id = auth.uid());
