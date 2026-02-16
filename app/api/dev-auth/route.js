/**
 * Dev Auth Bypass API Route
 * Generates a real Supabase session without email OTP
 * Only works when DEV_BYPASS_CODE env var is set.
 *
 * Production safety: if DEV_BYPASS_CODE is not set in the environment
 * (e.g. on Vercel), the early return below returns 403, effectively
 * disabling the bypass. No additional NODE_ENV guard is needed.
 */

import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  const bypassCode = process.env.DEV_BYPASS_CODE;

  if (!bypassCode) {
    return Response.json({ error: 'Dev bypass not configured' }, { status: 403 });
  }

  const { email, code } = await request.json();

  if (code !== bypassCode) {
    return Response.json({ error: 'Invalid bypass code' }, { status: 403 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Generate a magic link server-side (doesn't send an email)
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({
    hashed_token: data.properties.hashed_token,
  });
}
