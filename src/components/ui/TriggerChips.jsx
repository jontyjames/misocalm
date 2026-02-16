/**
 * TriggerChips - Reusable pill-chip selector
 * Matches the onboarding trigger selection style
 * Used for triggers, body responses, time-of-day, and environment selection
 */

'use client';

import { useState } from 'react';

export default function TriggerChips({
  items,
  selected,
  onToggle,
  multiSelect = true,
  searchable = false,
  className = '',
}) {
  const [search, setSearch] = useState('');

  // Show search when searchable AND 13+ items (prime threshold)
  const showSearch = searchable && items.length >= 13;

  const filtered = showSearch && search.trim()
    ? items.filter(item => {
        const label = typeof item === 'string' ? item : item.label;
        return label.toLowerCase().includes(search.toLowerCase());
      })
    : items;

  return (
    <div className={`px-4 ${className}`}>
      {showSearch && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sounds..."
          aria-label="Search sounds"
          className="w-full mb-[10px] px-4 py-2 rounded-full text-base font-light bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
        />
      )}
      <div className="flex flex-wrap justify-center gap-[10px]">
        {filtered.map((item) => {
          const label = typeof item === 'string' ? item : item.label;
          const value = typeof item === 'string' ? item : item.value;
          const isSelected = multiSelect
            ? Array.isArray(selected) && selected.includes(value)
            : selected === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              className={`
                px-4 py-2.5 rounded-full text-sm font-light
                border transition-all duration-[233ms]
                ${isSelected
                  ? 'bg-indigo-500/30 border-indigo-400/50 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
