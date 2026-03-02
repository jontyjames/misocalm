/**
 * Analytics Event Ingestion API
 * Accepts batched events from the client analytics engine.
 *
 * - Authenticated requests: validates Bearer token, sets user_id
 * - Anonymous requests: allowed (pre-login onboarding), rate-limited by IP
 * - Service role client for inserts (bypasses RLS)
 * - Validates payload structure, max 100 events per batch
 */

import { createClient } from '@supabase/supabase-js';
import { rateLimit, checkRateLimit, rateLimitResponse, rateLimitHeaders } from '@/lib/rateLimit';

// Service role client (bypasses RLS for batch inserts)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Auth-only client for token validation
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Rate limits
const authedLimit = rateLimit({ limit: 30, interval: 60_000 });   // 30 req/min per user
const anonLimit = rateLimit({ limit: 12, interval: 60_000 });     // 12 req/min per IP

const MAX_EVENTS = 100;
const MAX_PROPERTY_SIZE = 4096; // bytes

function getClientIP(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function validateEvent(event) {
  if (!event || typeof event !== 'object') return false;
  if (typeof event.event_name !== 'string' || event.event_name.length > 100) return false;
  if (typeof event.session_id !== 'string' || event.session_id.length > 100) return false;
  if (typeof event.anonymous_id !== 'string' || event.anonymous_id.length > 100) return false;
  if (event.properties && JSON.stringify(event.properties).length > MAX_PROPERTY_SIZE) return false;
  return true;
}

export async function POST(request) {
  try {
    // ── Auth (optional) ───────────────────────────────────
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    let authedUserId = null;

    if (token) {
      const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
      if (!error && user) {
        authedUserId = user.id;
      }
    }

    // ── Rate limiting ─────────────────────────────────────
    const rateLimitKey = authedUserId || `ip:${getClientIP(request)}`;
    const config = authedUserId ? authedLimit : anonLimit;
    const rl = checkRateLimit(rateLimitKey, config);
    if (!rl.success) return rateLimitResponse(rl);

    // ── Parse & validate ──────────────────────────────────
    let body;
    try {
      // Handle both fetch POST and sendBeacon (which sends as text blob)
      const text = await request.text();
      body = JSON.parse(text);
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { events, session } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return Response.json({ error: 'Events array required' }, { status: 400 });
    }

    if (events.length > MAX_EVENTS) {
      return Response.json({ error: `Max ${MAX_EVENTS} events per batch` }, { status: 400 });
    }

    // ── Prepare events ────────────────────────────────────
    const validEvents = [];

    for (const raw of events) {
      if (!validateEvent(raw)) continue;

      // Security: if authenticated, enforce user_id matches token
      // If anonymous, user_id must be null
      const userId = authedUserId || null;

      validEvents.push({
        id: raw.id || undefined,
        anonymous_id: raw.anonymous_id,
        user_id: userId,
        session_id: raw.session_id,
        event_name: raw.event_name,
        properties: raw.properties || {},
        page_url: typeof raw.page_url === 'string' ? raw.page_url.slice(0, 500) : null,
        created_at: raw.created_at || new Date().toISOString(),
      });
    }

    if (validEvents.length === 0) {
      return Response.json({ error: 'No valid events' }, { status: 400 });
    }

    // ── Insert events ─────────────────────────────────────
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert(validEvents);

    if (insertError) {
      console.error('Analytics insert error:', insertError);
      return Response.json({ error: 'Insert failed' }, { status: 500 });
    }

    // ── Upsert session ────────────────────────────────────
    if (session && typeof session.id === 'string') {
      const sessionData = {
        id: session.id,
        anonymous_id: session.anonymous_id || validEvents[0]?.anonymous_id,
        user_id: authedUserId || null,
        started_at: session.started_at || new Date().toISOString(),
        last_active_at: session.last_active_at || new Date().toISOString(),
        duration_ms: typeof session.duration_ms === 'number' ? session.duration_ms : 0,
        device_type: typeof session.device_type === 'string' ? session.device_type.slice(0, 20) : null,
        entry_page: typeof session.entry_page === 'string' ? session.entry_page.slice(0, 500) : null,
        referrer: typeof session.referrer === 'string' ? session.referrer.slice(0, 500) : null,
      };

      const { error: sessionError } = await supabase
        .from('analytics_sessions')
        .upsert(sessionData, {
          onConflict: 'id',
          // On conflict, update the mutable fields
          ignoreDuplicates: false,
        });

      if (sessionError) {
        console.error('Session upsert error:', sessionError);
        // Non-fatal: events were already saved
      }
    }

    return Response.json(
      { ok: true, count: validEvents.length },
      { headers: rateLimitHeaders(rl) }
    );
  } catch (error) {
    console.error('Analytics API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
