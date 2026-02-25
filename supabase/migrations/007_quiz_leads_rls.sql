-- Enable RLS on quiz_leads to prevent unauthorized reads
-- Anonymous users can INSERT (quiz submission) but cannot SELECT/UPDATE/DELETE

ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (quiz submissions from unauthenticated users)
CREATE POLICY "Anyone can submit quiz results"
  ON quiz_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read quiz leads (admin dashboard, exports)
-- No SELECT policy for anon/authenticated means reads are blocked by default
