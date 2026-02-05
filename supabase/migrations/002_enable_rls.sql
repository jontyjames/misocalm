-- MisoMind Row Level Security Policies
-- Run this in Supabase SQL Editor after 001_initial_schema.sql

-- =====================
-- ENABLE RLS ON ALL USER DATA TABLES
-- =====================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tool_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;

-- =====================
-- USERS TABLE POLICIES
-- =====================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================
-- TRIGGER_LOGS TABLE POLICIES
-- =====================

-- Users can only access their own trigger logs
CREATE POLICY "Users own trigger logs"
  ON trigger_logs FOR ALL
  USING (auth.uid() = user_id);

-- =====================
-- CHAT_MESSAGES TABLE POLICIES
-- =====================

-- Users can only access their own chat messages
CREATE POLICY "Users own chat messages"
  ON chat_messages FOR ALL
  USING (auth.uid() = user_id);

-- =====================
-- USER_TRIGGERS TABLE POLICIES
-- =====================

-- Users can only access their own trigger selections
CREATE POLICY "Users own user triggers"
  ON user_triggers FOR ALL
  USING (auth.uid() = user_id);

-- =====================
-- USER_TOOL_PROGRESS TABLE POLICIES
-- =====================

-- Users can only access their own tool progress
CREATE POLICY "Users own tool progress"
  ON user_tool_progress FOR ALL
  USING (auth.uid() = user_id);

-- =====================
-- STREAKS TABLE POLICIES
-- =====================

-- Users can only access their own streaks
CREATE POLICY "Users own streaks"
  ON streaks FOR ALL
  USING (auth.uid() = user_id);

-- =====================
-- TRIGGERS TABLE POLICIES
-- =====================

-- Everyone can read system triggers (user_id IS NULL)
CREATE POLICY "Anyone can read system triggers"
  ON triggers FOR SELECT
  USING (user_id IS NULL);

-- Users can read their own custom triggers
CREATE POLICY "Users can read own custom triggers"
  ON triggers FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own custom triggers
CREATE POLICY "Users can create custom triggers"
  ON triggers FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_custom = true);

-- Users can update their own custom triggers
CREATE POLICY "Users can update own custom triggers"
  ON triggers FOR UPDATE
  USING (auth.uid() = user_id AND is_custom = true);

-- Users can delete their own custom triggers
CREATE POLICY "Users can delete own custom triggers"
  ON triggers FOR DELETE
  USING (auth.uid() = user_id AND is_custom = true);

-- =====================
-- TOOLS TABLE (PUBLIC READ)
-- =====================

-- Tools table should be publicly readable (no user-specific data)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tools"
  ON tools FOR SELECT
  USING (true);

-- =====================
-- HELPER FUNCTION FOR SERVICE ROLE BYPASS
-- =====================

-- Create function to check if request is from service role
-- This allows server-side operations to bypass RLS when needed
CREATE OR REPLACE FUNCTION is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::json->>'role' = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- INDEXES FOR RLS PERFORMANCE
-- =====================

-- These indexes help with RLS policy evaluation
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_trigger_logs_user_id ON trigger_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_triggers_user_id ON user_triggers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tool_progress_user_id ON user_tool_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_triggers_user_id ON triggers(user_id);
