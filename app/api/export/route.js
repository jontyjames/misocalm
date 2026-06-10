import { createClient } from '@supabase/supabase-js';

function createAuthedClient(token) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
      },
    }
  );
}

async function selectSection(client, table, buildQuery) {
  try {
    const query = buildQuery(client.from(table));
    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error.message || 'Export failed' };
  }
}

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return Response.json({ error: 'Export is not configured' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return Response.json({ error: 'Authentication required' }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);

  if (authError || !user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 });
  }

  const client = createAuthedClient(token);
  const userId = user.id;

  const [
    profile,
    triggerLogs,
    userTriggers,
    customTriggers,
    toolProgress,
    streaks,
    chatMessages,
    subscriptions,
    analyticsEvents,
    analyticsSessions,
  ] = await Promise.all([
    selectSection(client, 'users', query => query.select('*').eq('id', userId)),
    selectSection(client, 'trigger_logs', query => query.select('*').eq('user_id', userId).order('created_at', { ascending: true })),
    selectSection(client, 'user_triggers', query => query.select('*').eq('user_id', userId).order('created_at', { ascending: true })),
    selectSection(client, 'triggers', query => query.select('*').eq('user_id', userId).order('created_at', { ascending: true })),
    selectSection(client, 'user_tool_progress', query => query.select('*').eq('user_id', userId).order('created_at', { ascending: true })),
    selectSection(client, 'streaks', query => query.select('*').eq('user_id', userId)),
    selectSection(client, 'chat_messages', query => query.select('*').eq('user_id', userId).order('created_at', { ascending: true })),
    selectSection(client, 'subscriptions', query => query.select('*').eq('user_id', userId).order('created_at', { ascending: true })),
    selectSection(client, 'analytics_events', query => query.select('*').eq('user_id', userId).order('created_at', { ascending: true })),
    selectSection(client, 'analytics_sessions', query => query.select('*').eq('user_id', userId).order('started_at', { ascending: true })),
  ]);

  return Response.json({
    exported_at: new Date().toISOString(),
    user_id: userId,
    account_email: user.email,
    data: {
      profile: profile.data?.[0] || null,
      trigger_logs: triggerLogs.data,
      user_triggers: userTriggers.data,
      custom_triggers: customTriggers.data,
      tool_progress: toolProgress.data,
      streaks: streaks.data,
      chat_messages: chatMessages.data,
      subscriptions: subscriptions.data,
      analytics_events: analyticsEvents.data,
      analytics_sessions: analyticsSessions.data,
    },
    section_errors: {
      profile: profile.error,
      trigger_logs: triggerLogs.error,
      user_triggers: userTriggers.error,
      custom_triggers: customTriggers.error,
      tool_progress: toolProgress.error,
      streaks: streaks.error,
      chat_messages: chatMessages.error,
      subscriptions: subscriptions.error,
      analytics_events: analyticsEvents.error,
      analytics_sessions: analyticsSessions.error,
    },
  });
}
