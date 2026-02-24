/**
 * JournalHistoryList - Timeline of journal entries grouped by date
 */

'use client';

import { useState, useMemo } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useReducedMotion, useTriggerLogs } from '@/hooks';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/dateUtils';
import JournalEntryCard from './JournalEntryCard';

function groupByDate(logs) {
  const groups = {};
  logs.forEach(log => {
    const date = new Date(log.created_at).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
  });
  return Object.entries(groups).map(([date, entries]) => ({
    date,
    label: formatDateLabel(date),
    entries,
  }));
}

function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return formatDate(date, 'long');
}

export default function JournalHistoryList() {
  const { user } = useAuth();
  const { logs, loading, loadingMore, pagination, loadMore } = useTriggerLogs(user?.id, { limit: 30 });
  const [showWhy, setShowWhy] = useState(false);
  const prefersReduced = useReducedMotion();

  const groups = useMemo(() => groupByDate(logs), [logs]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="md" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <EmptyState />
    );
  }

  return (
    <div className="space-y-8">
      {/* Why look back */}
      <div>
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/30 text-left transition-all duration-[233ms] hover:border-slate-600/50"
        >
          <span className="text-sm text-slate-300 font-light">Why look back?</span>
          {showWhy
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />
          }
        </button>
        {showWhy && (
          <p
            className="text-sm text-slate-300 font-light leading-relaxed px-4 pt-3"
            style={{ animation: prefersReduced ? 'none' : 'fadeIn 0.233s ease-out' }}
          >
            Looking back isn't about reliving difficult moments.
            It's about noticing what keeps showing up, so you can
            meet it with a little more understanding next time.
          </p>
        )}
      </div>

      {groups.map((group) => (
        <div key={group.date}>
          <h3 className="text-xs text-slate-400 font-light uppercase tracking-wider mb-3">
            {group.label}
          </h3>
          <div className="divide-y divide-slate-800/40">
            {group.entries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}

      {/* Load more */}
      {pagination.hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-light disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load more entries'}
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const router = useRouter();

  return (
    <div className="text-center py-16 px-4">
      <p
        className="text-lg text-slate-300 mb-2"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        No entries yet
      </p>
      <p className="text-sm text-slate-400 font-light mb-8">
        When you are ready, the space is here.
      </p>
      <button
        onClick={() => router.push(ROUTES.LOG)}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-light bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 transition-all duration-[233ms]"
      >
        <Plus className="w-4 h-4" />
        Log a moment
      </button>
    </div>
  );
}
