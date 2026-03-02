/**
 * Analytics Dashboard
 * Admin-only analytics views for the debug page.
 *
 * Tabs: Overview | Live Feed | User Journeys | Onboarding Funnel | Sessions
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { Card, Badge, Button } from '@/components/ui';
import { Activity, Users, Eye, Clock, RefreshCw, ChevronRight } from 'lucide-react';

const TABS = ['Overview', 'Live', 'Journeys', 'Funnel', 'Sessions'];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  return `${Math.floor(diff / 86400_000)}d ago`;
}

function formatDuration(ms) {
  if (!ms) return '-';
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60_000)}m`;
}

// ── Overview Tab ────────────────────────────────────────────

function OverviewTab() {
  const [data, setData] = useState(null);
  const [hours, setHours] = useState(24);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: result } = await analyticsService.getOverview(hours);
    setData(result);
    setLoading(false);
  }, [hours]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="text-slate-500 text-sm">Loading...</p>;
  if (!data) return <p className="text-slate-500 text-sm">No data</p>;

  const topEvents = Object.entries(data.event_counts)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-2">
        {[1, 24, 168, 720].map((h) => (
          <button
            key={h}
            onClick={() => setHours(h)}
            className={`px-3 py-1.5 rounded-lg text-xs font-light transition-colors ${
              hours === h ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {h === 1 ? '1h' : h === 24 ? '24h' : h === 168 ? '7d' : '30d'}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-slate-500 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Activity className="w-4 h-4 text-indigo-400" />} label="Events" value={data.total_events} />
        <StatCard icon={<Users className="w-4 h-4 text-cyan-400" />} label="Visitors" value={data.unique_visitors} />
        <StatCard icon={<Eye className="w-4 h-4 text-violet-400" />} label="Auth Users" value={data.unique_users} />
        <StatCard icon={<Clock className="w-4 h-4 text-amber-400" />} label="Sessions" value={data.active_sessions} />
      </div>

      {/* Event breakdown */}
      <div>
        <h3 className="text-sm text-slate-400 font-light mb-3">Events by type</h3>
        <div className="space-y-1.5">
          {topEvents.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50">
              <code className="text-xs text-indigo-300">{name}</code>
              <span className="text-sm text-white font-light">{count}</span>
            </div>
          ))}
          {topEvents.length === 0 && (
            <p className="text-sm text-slate-500 font-light">No events in this period</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-slate-400">{label}</span></div>
      <p className="text-2xl text-white font-light">{value}</p>
    </div>
  );
}

// ── Live Feed Tab ───────────────────────────────────────────

function LiveTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await analyticsService.getLive(50);
    setEvents(data?.events || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="text-slate-500 text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-slate-400 font-light">Most recent events</h3>
        <button onClick={load} className="text-slate-500 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/30 text-sm">
            <span className="text-slate-500 text-xs w-16 shrink-0">{timeAgo(e.created_at)}</span>
            <code className="text-indigo-300 text-xs">{e.event_name}</code>
            <span className="text-slate-500 text-xs truncate">{e.page_url}</span>
            <span className="ml-auto text-xs text-slate-600 font-mono">{e.anonymous_id?.slice(0, 8)}</span>
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-slate-500 font-light">No events yet</p>}
      </div>
    </div>
  );
}

// ── Journeys Tab ────────────────────────────────────────────

function JourneysTab() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await analyticsService.getSessions(30);
      setSessions(data?.sessions || []);
      setLoading(false);
    })();
  }, []);

  const loadJourney = async (session) => {
    setSelected(session.id);
    const { data } = await analyticsService.getJourney({ session_id: session.id });
    setJourney(data);
  };

  if (loading) return <p className="text-slate-500 text-sm">Loading...</p>;

  if (journey && selected) {
    return (
      <div>
        <button onClick={() => { setJourney(null); setSelected(null); }} className="text-sm text-indigo-300 mb-4 hover:text-indigo-200">
          Back to sessions
        </button>
        <h3 className="text-sm text-slate-400 font-light mb-3">
          Session {selected.slice(0, 8)}... ({journey.events?.length || 0} events)
        </h3>
        <div className="space-y-1">
          {(journey.events || []).map((e, i) => (
            <div key={e.id} className="flex items-start gap-3 px-3 py-2 rounded-lg bg-slate-800/30">
              <div className="flex flex-col items-center w-4 shrink-0">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1" />
                {i < journey.events.length - 1 && <div className="w-px flex-1 bg-slate-700 mt-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-xs text-indigo-300">{e.event_name}</code>
                  <span className="text-xs text-slate-500">{timeAgo(e.created_at)}</span>
                </div>
                {e.page_url && <p className="text-xs text-slate-500 truncate">{e.page_url}</p>}
                {e.properties && Object.keys(e.properties).length > 0 && (
                  <p className="text-xs text-slate-600 truncate mt-0.5">
                    {Object.entries(e.properties).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm text-slate-400 font-light mb-3">Recent sessions</h3>
      <div className="space-y-1.5">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => loadJourney(s)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-mono">{s.anonymous_id?.slice(0, 8)}</span>
                {s.user_id && <Badge color="emerald" size="sm">auth</Badge>}
                <Badge color="slate" size="sm">{s.device_type || '?'}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-500">{timeAgo(s.last_active_at)}</span>
                <span className="text-xs text-slate-600">{formatDuration(s.duration_ms)}</span>
                {s.entry_page && <span className="text-xs text-slate-600 truncate">{s.entry_page}</span>}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
          </button>
        ))}
        {sessions.length === 0 && <p className="text-sm text-slate-500 font-light">No sessions yet</p>}
      </div>
    </div>
  );
}

// ── Funnel Tab ──────────────────────────────────────────────

function FunnelTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: result } = await analyticsService.getFunnel();
      setData(result);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-slate-500 text-sm">Loading...</p>;
  if (!data) return <p className="text-slate-500 text-sm">No data</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-slate-400 font-light">Onboarding funnel</h3>
        <span className="text-xs text-slate-500">{data.total_started} started</span>
      </div>
      <div className="space-y-2">
        {(data.funnel || []).map((step) => (
          <div key={step.step} className="flex items-center gap-3">
            <div className="w-28 shrink-0">
              <p className="text-xs text-white font-light">{step.step}</p>
              <p className="text-xs text-slate-500">Step {step.step_number}</p>
            </div>
            <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(step.rate, 2)}%` }}
              />
            </div>
            <div className="w-16 text-right shrink-0">
              <span className="text-sm text-white font-light">{step.reached}</span>
              <span className="text-xs text-slate-500 ml-1">({step.rate}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sessions Tab ────────────────────────────────────────────

function SessionsTab() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await analyticsService.getSessions(50);
      setSessions(data?.sessions || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-slate-500 text-sm">Loading...</p>;

  return (
    <div>
      <h3 className="text-sm text-slate-400 font-light mb-3">All sessions ({sessions.length})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500 text-left">
              <th className="pb-2 font-light">Visitor</th>
              <th className="pb-2 font-light">Device</th>
              <th className="pb-2 font-light">Entry</th>
              <th className="pb-2 font-light">Duration</th>
              <th className="pb-2 font-light">Last active</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-t border-slate-800/50">
                <td className="py-2">
                  <span className="font-mono text-white">{s.anonymous_id?.slice(0, 8)}</span>
                  {s.user_id && <Badge color="emerald" size="sm" className="ml-1">auth</Badge>}
                </td>
                <td className="py-2 text-slate-400">{s.device_type || '-'}</td>
                <td className="py-2 text-slate-400 max-w-32 truncate">{s.entry_page || '-'}</td>
                <td className="py-2 text-slate-400">{formatDuration(s.duration_ms)}</td>
                <td className="py-2 text-slate-500">{timeAgo(s.last_active_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <Card variant="elevated">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-light">Analytics</h2>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-light whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && <OverviewTab />}
      {activeTab === 'Live' && <LiveTab />}
      {activeTab === 'Journeys' && <JourneysTab />}
      {activeTab === 'Funnel' && <FunnelTab />}
      {activeTab === 'Sessions' && <SessionsTab />}
    </Card>
  );
}
