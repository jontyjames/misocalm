/**
 * ExpandingTriggerCard - Sacred glass card with per-trigger intensity slider
 * Expands from a chip into a card when a trigger is selected
 * Color shifts: indigo (0-3) > violet (4-6) > rose (7-10)
 */

'use client';

import { X } from 'lucide-react';
import { MISOPHONIA_LEVELS } from '@/lib/constants';
import { GLASS_HIGHLIGHT_STYLE } from '@/lib/sacredGlass';

// Intensity-based gradient backgrounds (solfeggio-mapped)
function getIntensityGradient(intensity) {
  if (intensity <= 3) {
    // Indigo glass (528Hz — calm, healing)
    return 'linear-gradient(160deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.06) 50%, rgba(30,27,75,0.3) 100%)';
  }
  if (intensity <= 6) {
    // Violet glass (852Hz — moderate depth)
    return 'linear-gradient(160deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.06) 50%, rgba(46,16,101,0.3) 100%)';
  }
  // Rose glass (warm alert, not alarming)
  return 'linear-gradient(160deg, rgba(244,63,94,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(76,29,149,0.3) 100%)';
}

function getIntensityBorder(intensity) {
  if (intensity <= 3) return 'rgba(99,102,241,0.3)';
  if (intensity <= 6) return 'rgba(139,92,246,0.3)';
  return 'rgba(244,63,94,0.25)';
}

export default function ExpandingTriggerCard({
  name,
  intensity,
  onIntensityChange,
  onRemove,
}) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden backdrop-blur-xl"
      style={{
        animation: 'fadeIn 0.233s ease-out',
        background: getIntensityGradient(intensity),
        border: `1px solid ${getIntensityBorder(intensity)}`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.08), 0 0 20px rgba(99,102,241,0.08), 0 4px 16px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Glass highlight line */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.2) 50%, transparent 90%)' }}
      />

      <div className="p-4">
        {/* Header: name + close */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-white font-light"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            {name}
          </span>
          <button
            onClick={() => onRemove(name)}
            aria-label={`Remove ${name}`}
            className="p-1 text-slate-400 hover:text-white transition-colors duration-[233ms]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Intensity slider */}
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={intensity}
          onChange={(e) => onIntensityChange(name, parseInt(e.target.value))}
          aria-label={`${name} intensity`}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={intensity}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(99,102,241,0.6), rgba(139,92,246,0.6), rgba(244,63,94,0.4))`,
          }}
        />

        {/* Labels */}
        <div className="flex justify-between items-baseline mt-1.5">
          <span className="text-xs text-slate-400">0</span>
          <span className="text-xs text-slate-200 font-light">
            {intensity} · {MISOPHONIA_LEVELS[intensity]?.label}
          </span>
          <span className="text-xs text-slate-400">10</span>
        </div>
      </div>
    </div>
  );
}
