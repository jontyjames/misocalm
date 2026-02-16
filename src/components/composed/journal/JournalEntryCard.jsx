/**
 * JournalEntryCard - A quiet line in the timeline
 * Minimal by default, expandable for those who want to look closer
 * Supports both trigger logs and check-in entries
 */

'use client';

import { useState } from 'react';
import { timeAgo } from '@/lib/dateUtils';
import { SOURCE_OPTIONS } from '@/lib/constants';

const ENERGY_LABELS = ['Very low', 'Low', 'Somewhat low', 'Neutral', 'Somewhat high', 'High', 'Very high'];
const PLEASANTNESS_LABELS = ['Very unpleasant', 'Unpleasant', 'Somewhat unpleasant', 'Neutral', 'Somewhat pleasant', 'Pleasant', 'Very pleasant'];

function getIntensityColor(intensity) {
  if (intensity <= 3) return 'bg-emerald-400';
  if (intensity <= 5) return 'bg-amber-400';
  if (intensity <= 7) return 'bg-orange-400';
  return 'bg-rose-400';
}

function getSourceLabel(value) {
  return SOURCE_OPTIONS.find(s => s.value === value)?.label || value;
}

export default function JournalEntryCard({ entry }) {
  const [open, setOpen] = useState(false);
  const isCheckIn = entry.entry_type === 'check_in';
  const triggers = entry.triggers?.join(', ') || 'Untitled';
  const hasBody = entry.body_responses?.length > 0;
  const hasDeeper = !!entry.deeper_processing;
  const hasNotes = !!entry.notes;
  const hasBodySensation = !!entry.body_sensation;

  return (
    <div className="transition-all duration-[233ms]">
      {/* Collapsed: one quiet line */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={isCheckIn ? `Check-in, ${timeAgo(entry.created_at)}` : `${triggers}, ${timeAgo(entry.created_at)}`}
        className="w-full flex items-center gap-3 py-3 px-1 text-left group"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${isCheckIn ? 'bg-cyan-400/60' : getIntensityColor(entry.intensity)}`} />
        <span className="text-sm text-slate-200 font-light flex-1 truncate">
          {isCheckIn ? 'Check-in' : triggers}
        </span>
        <span className="text-sm text-slate-400 font-light shrink-0">
          {timeAgo(entry.created_at)}
        </span>
      </button>

      {/* Expanded: gentle details */}
      {open && (
        <div
          className="ml-5 pl-4 pb-4 border-l border-slate-800/60"
          style={{ animation: 'fadeIn 0.233s ease-out' }}
        >
          <div className="space-y-2 pt-1">
            {isCheckIn ? (
              <>
                <p className="text-sm text-slate-300 font-light">
                  Energy: {ENERGY_LABELS[entry.energy] || 'Neutral'}
                </p>
                <p className="text-sm text-slate-300 font-light">
                  Pleasantness: {PLEASANTNESS_LABELS[entry.pleasantness] || 'Neutral'}
                </p>
                {hasBodySensation && (
                  <p className="text-sm text-slate-200 font-light leading-relaxed">
                    {entry.body_sensation}
                  </p>
                )}
              </>
            ) : (
              <>
                {entry.source && (
                  <p className="text-sm text-slate-300 font-light">
                    {Array.isArray(entry.source)
                      ? entry.source.map(getSourceLabel).join(', ')
                      : getSourceLabel(entry.source)
                    }
                  </p>
                )}
                <p className="text-sm text-slate-400 font-light">
                  Intensity: {entry.intensity}/10
                  {entry.time_of_day && entry.time_of_day !== 'now' && (
                    <span> · {entry.time_of_day}</span>
                  )}
                </p>
                {hasBody && (
                  <div className="flex flex-wrap gap-1.5">
                    {entry.body_responses.map((r) => (
                      <span
                        key={r}
                        className="px-2 py-0.5 rounded-full text-xs font-light bg-violet-500/10 border border-violet-500/20 text-violet-300"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}
                {hasDeeper && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span className="text-sm text-violet-400 font-light">Went deeper</span>
                  </div>
                )}
                {hasNotes && (
                  <p className="text-sm text-slate-200 font-light leading-relaxed">
                    {entry.notes}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
