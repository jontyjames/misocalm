/**
 * Admin Analytics API
 * Cross-user analytics queries for the admin dashboard.
 *
 * - ADMIN_EMAILS gate (same as /debug)
 * - Service role client for cross-user reads
 * - Multiple query modes for different dashboard views
 *
 * Query modes:
 *   ?mode=overview           — Aggregate counts and unique users
 *   ?mode=events             — Filtered event listing
 *   ?mode=journey            — Full event timeline for one user/anon
 *   ?mode=funnel             — Onboarding step completion rates
 *   ?mode=sessions           — Recent sessions with metadata
 *   ?mode=live               — Most recent events (live feed)
 */

import { createClient } from '@supabase/supabase-js';
import { ADMIN_EMAILS } from '@/lib/constants';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return null;

  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
  if (error || !user) return null;
  if (!ADMIN_EMAILS.includes(user.email)) return null;
  return user;
}

// ── Query handlers ────────────────────────────────────────

async function getOverview(searchParams) {
  const hours = parseInt(searchParams.get('hours')) || 24;
  const since = new Date(Date.now() - hours * 3600_000).toISOString();

  // Event counts by type
  const { data: events } = await supabase
    .from('analytics_events')
    .select('event_name')
    .gte('created_at', since);

  const eventCounts = {};
  (events || []).forEach(({ event_name }) => {
    eventCounts[event_name] = (eventCounts[event_name] || 0) + 1;
  });

  // Unique users and anonymous IDs
  const uniqueUsers = new Set((events || []).map(e => e.user_id).filter(Boolean));
  const uniqueAnons = new Set();
  const { data: anonEvents } = await supabase
    .from('analytics_events')
    .select('anonymous_id')
    .gte('created_at', since);
  (anonEvents || []).forEach(({ anonymous_id }) => uniqueAnons.add(anonymous_id));

  // Active sessions
  const { data: sessions, count: sessionCount } = await supabase
    .from('analytics_sessions')
    .select('id', { count: 'exact' })
    .gte('last_active_at', since);

  // Traffic sources (UTM breakdown)
  const { data: utmSessions } = await supabase
    .from('analytics_sessions')
    .select('utm_source, utm_medium, utm_campaign')
    .gte('started_at', since)
    .not('utm_source', 'is', null);

  const sources = {};
  (utmSessions || []).forEach(({ utm_source, utm_medium, utm_campaign }) => {
    const key = utm_source || 'direct';
    if (!sources[key]) sources[key] = { count: 0, mediums: {}, campaigns: {} };
    sources[key].count++;
    if (utm_medium) sources[key].mediums[utm_medium] = (sources[key].mediums[utm_medium] || 0) + 1;
    if (utm_campaign) sources[key].campaigns[utm_campaign] = (sources[key].campaigns[utm_campaign] || 0) + 1;
  });

  return {
    period_hours: hours,
    since,
    total_events: (events || []).length,
    unique_users: uniqueUsers.size,
    unique_visitors: uniqueAnons.size,
    active_sessions: sessionCount || 0,
    event_counts: eventCounts,
    traffic_sources: sources,
  };
}

async function getEvents(searchParams) {
  const event = searchParams.get('event');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const userId = searchParams.get('user_id');
  const anonId = searchParams.get('anonymous_id');
  const limit = Math.min(parseInt(searchParams.get('limit')) || 100, 500);
  const offset = parseInt(searchParams.get('offset')) || 0;

  let query = supabase
    .from('analytics_events')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (event) query = query.eq('event_name', event);
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);
  if (userId) query = query.eq('user_id', userId);
  if (anonId) query = query.eq('anonymous_id', anonId);

  const { data, count, error } = await query;
  if (error) return { error: error.message };

  return { events: data, count, limit, offset };
}

async function getJourney(searchParams) {
  const userId = searchParams.get('user_id');
  const anonId = searchParams.get('anonymous_id');
  const sessionId = searchParams.get('session_id');

  if (!userId && !anonId && !sessionId) {
    return { error: 'Provide user_id, anonymous_id, or session_id' };
  }

  let query = supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1000);

  if (sessionId) {
    query = query.eq('session_id', sessionId);
  } else if (userId) {
    query = query.eq('user_id', userId);
  } else {
    query = query.eq('anonymous_id', anonId);
  }

  const { data, error } = await query;
  if (error) return { error: error.message };

  // Also fetch associated sessions
  let sessionsQuery = supabase
    .from('analytics_sessions')
    .select('*')
    .order('started_at', { ascending: true });

  if (sessionId) {
    sessionsQuery = sessionsQuery.eq('id', sessionId);
  } else if (userId) {
    sessionsQuery = sessionsQuery.eq('user_id', userId);
  } else {
    sessionsQuery = sessionsQuery.eq('anonymous_id', anonId);
  }

  const { data: sessions } = await sessionsQuery;

  return { events: data, sessions: sessions || [], count: data?.length || 0 };
}

async function getFunnel() {
  // Get onboarding events for all users
  const { data: events } = await supabase
    .from('analytics_events')
    .select('anonymous_id, event_name, properties, created_at')
    .in('event_name', [
      'onboarding_step_viewed',
      'onboarding_completed',
    ])
    .order('created_at', { ascending: true });

  if (!events || events.length === 0) {
    return { funnel: [], total_started: 0 };
  }

  // Group by anonymous_id to track individual journeys
  const journeys = {};
  for (const event of events) {
    if (!journeys[event.anonymous_id]) journeys[event.anonymous_id] = [];
    journeys[event.anonymous_id].push(event);
  }

  // Count completions per step
  const stepCounts = {};
  let completedCount = 0;

  for (const journey of Object.values(journeys)) {
    const stepsReached = new Set();
    for (const event of journey) {
      if (event.event_name === 'onboarding_step_viewed') {
        const step = event.properties?.step;
        if (step) stepsReached.add(step);
      }
      if (event.event_name === 'onboarding_completed') {
        completedCount++;
      }
    }
    for (const step of stepsReached) {
      stepCounts[step] = (stepCounts[step] || 0) + 1;
    }
  }

  // Build ordered funnel
  const stepOrder = ['first-practice', 'triggers', 'profile', 'verify', 'assessment', 'plan'];
  const totalStarted = Object.keys(journeys).length;
  const funnel = stepOrder.map((step, i) => ({
    step,
    step_number: i + 1,
    reached: stepCounts[step] || 0,
    rate: totalStarted > 0 ? Math.round(((stepCounts[step] || 0) / totalStarted) * 100) : 0,
  }));

  funnel.push({
    step: 'completed',
    step_number: 7,
    reached: completedCount,
    rate: totalStarted > 0 ? Math.round((completedCount / totalStarted) * 100) : 0,
  });

  return { funnel, total_started: totalStarted };
}

async function getSessions(searchParams) {
  const limit = Math.min(parseInt(searchParams.get('limit')) || 50, 200);
  const offset = parseInt(searchParams.get('offset')) || 0;

  const { data, count, error } = await supabase
    .from('analytics_sessions')
    .select('*', { count: 'exact' })
    .order('last_active_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return { error: error.message };
  return { sessions: data, count, limit, offset };
}

async function getLive(searchParams) {
  const limit = Math.min(parseInt(searchParams.get('limit')) || 30, 100);

  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return { error: error.message };
  return { events: data, count: data?.length || 0 };
}

// ── Route handler ─────────────────────────────────────────

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'overview';

  let result;
  switch (mode) {
    case 'overview':  result = await getOverview(searchParams); break;
    case 'events':    result = await getEvents(searchParams); break;
    case 'journey':   result = await getJourney(searchParams); break;
    case 'funnel':    result = await getFunnel(); break;
    case 'sessions':  result = await getSessions(searchParams); break;
    case 'live':      result = await getLive(searchParams); break;
    default:
      return Response.json({ error: `Unknown mode: ${mode}` }, { status: 400 });
  }

  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result);
}
