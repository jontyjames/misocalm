'use client';

import { HeartPulse, Route, Sparkles } from 'lucide-react';
import { PHI_SCALE } from '@/lib/constants';

export const MISO_MODES = [
  {
    id: 'triggered_now',
    label: 'Triggered now',
    icon: HeartPulse,
  },
  {
    id: 'prepare',
    label: 'Prepare',
    icon: Route,
  },
  {
    id: 'process',
    label: 'Process',
    icon: Sparkles,
  },
];

export default function MisoModeChips({ activeMode, onChange }) {
  return (
    <div
      className="flex overflow-x-auto border-b border-slate-800 px-4 py-3"
      style={{ gap: PHI_SCALE[1] }}
    >
      {MISO_MODES.map((mode) => {
        const Icon = mode.icon;
        const active = activeMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            className={`flex shrink-0 items-center rounded-full border px-3 py-2 text-xs transition-colors duration-[144ms] ${
              active
                ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
                : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white'
            }`}
            style={{ gap: PHI_SCALE[0] }}
          >
            <Icon className="h-3.5 w-3.5" />
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
