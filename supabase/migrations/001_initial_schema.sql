-- MisoMind Database Schema
-- Run this in Supabase SQL Editor

-- Note: RLS is DISABLED for MVP as requested

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 10),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers table (system + custom triggers)
CREATE TABLE IF NOT EXISTS triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table: user's selected triggers
CREATE TABLE IF NOT EXISTS user_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trigger_id UUID NOT NULL REFERENCES triggers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, trigger_id)
);

-- Trigger logs
CREATE TABLE IF NOT EXISTS trigger_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trigger_id UUID REFERENCES triggers(id) ON DELETE SET NULL,
  source TEXT CHECK (source IN ('partner', 'parent', 'sibling', 'child', 'friend', 'colleague', 'stranger', 'self', 'pet', 'environment')),
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  location TEXT,
  response TEXT CHECK (response IN ('left_situation', 'coping_technique', 'asked_stop', 'angry', 'headphones', 'ignored')),
  notes TEXT,
  wanted_support BOOLEAN DEFAULT false,
  support_type TEXT CHECK (support_type IN ('breathing', 'mantra', 'soundscape', 'ai_chat')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools/practices
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('breathwork', 'somatic', 'cognitive', 'education', 'therapeutic', 'communication')),
  duration_minutes INTEGER,
  level TEXT CHECK (level IN ('basic', 'intermediate', 'advanced')),
  type TEXT CHECK (type IN ('practice', 'video', 'guided')),
  unlock_code TEXT,
  content_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tool progress
CREATE TABLE IF NOT EXISTS user_tool_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  favorited BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  times_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- SEED DATA
-- =====================

-- Default triggers
INSERT INTO triggers (name, is_custom, user_id) VALUES
  ('Chewing', false, NULL),
  ('Sniffing', false, NULL),
  ('Typing', false, NULL),
  ('Throat clearing', false, NULL),
  ('Breathing sounds', false, NULL),
  ('Pen clicking', false, NULL),
  ('Lip smacking', false, NULL),
  ('Coughing', false, NULL),
  ('Slurping', false, NULL)
ON CONFLICT DO NOTHING;

-- Default tools
INSERT INTO tools (title, description, category, duration_minutes, level, type, sort_order) VALUES
  ('4-7-8 Breathing', 'Calm your nervous system with this proven breathing technique developed by Dr. Andrew Weil.', 'breathwork', 5, 'basic', 'practice', 1),
  ('Body Scan', 'Release tension by systematically scanning through your body and releasing stored stress.', 'somatic', 10, 'basic', 'guided', 2),
  ('Grounding Technique', '5-4-3-2-1 sensory awareness exercise to bring you back to the present moment.', 'cognitive', 5, 'basic', 'practice', 3),
  ('Progressive Relaxation', 'Systematically tense and release muscle groups to reduce physical tension.', 'somatic', 15, 'intermediate', 'guided', 4),
  ('Cognitive Reframing', 'Learn to reframe your thoughts and reactions to trigger sounds.', 'cognitive', 20, 'intermediate', 'video', 5)
ON CONFLICT DO NOTHING;

-- =====================
-- INDEXES
-- =====================

CREATE INDEX IF NOT EXISTS idx_trigger_logs_user ON trigger_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_trigger_logs_created ON trigger_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_user_tool_progress_user ON user_tool_progress(user_id);
