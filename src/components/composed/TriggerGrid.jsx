/**
 * Trigger Selection Grid
 * Displays triggers in a 2-column grid with selection state
 */

'use client';

import { Check, Plus } from 'lucide-react';

export default function TriggerGrid({
  triggers,
  selected = [],
  onToggle,
  columns = 2,
}) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {triggers.map((trigger) => {
        const isSelected = selected.includes(trigger);

        return (
          <button
            key={trigger}
            onClick={() => onToggle(trigger)}
            className={`
              p-4 rounded-xl border text-left
              transition-all duration-[144ms]
              ${isSelected
                ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-indigo-500/40 hover:text-white'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-light">{trigger}</span>
              {isSelected ? (
                <Check className="w-4 h-4 text-indigo-400" />
              ) : (
                <Plus className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
