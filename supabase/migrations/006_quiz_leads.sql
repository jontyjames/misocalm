-- Quiz leads table for misophonia self-assessment
-- Public table, no RLS (anonymous inserts allowed)
-- No unique constraint on email (retakes are fine)

CREATE TABLE IF NOT EXISTS quiz_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  result_category TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_leads_email ON quiz_leads(email);
CREATE INDEX IF NOT EXISTS idx_quiz_leads_created ON quiz_leads(created_at);
