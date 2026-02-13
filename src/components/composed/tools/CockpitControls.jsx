/**
 * CockpitControls — Three rows of neon-glow selectors
 * Duration (indigo/528Hz), Grace period (cyan/741Hz), Rounds (violet/852Hz)
 */

'use client';

import { TIMER_DURATIONS, TIMER_REMINDERS, TIMER_ROUNDS } from '@/lib/constants';
import { resumeAudio, playSelectionTone } from '@/lib/timerSounds';

const REMINDER_LABELS = { 0: 'None', 2: '2 min', 5: '5 min' };

function neonStyle(rgb, isSelected) {
  if (!isSelected) return {};
  return {
    background: `rgba(${rgb}, 0.15)`,
    border: `1px solid rgba(${rgb}, 0.4)`,
    boxShadow: `0 0 12px rgba(${rgb}, 0.25), inset 0 0 8px rgba(${rgb}, 0.1)`,
  };
}

export default function CockpitControls({
  duration,
  setDuration,
  reminder,
  setReminder,
  rounds,
  setRounds,
  onSelectionChange,
}) {
  const handleSelect = (setter, value, colorName) => {
    resumeAudio();
    setter(value);
    playSelectionTone(colorName);
    onSelectionChange(colorName);
  };

  return (
    <div>
      {/* Duration — indigo 528Hz */}
      <p className="text-sm font-light text-slate-300 mb-2">Duration</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {TIMER_DURATIONS.map((min) => {
          const selected = duration === min;
          return (
            <button
              key={min}
              onClick={() => handleSelect(setDuration, min, 'indigo')}
              className={`
                px-4 py-2 rounded-full text-sm font-light
                transition-all duration-[144ms] active:scale-95
                ${selected
                  ? 'text-indigo-300'
                  : 'text-slate-300 border border-slate-700 hover:text-white hover:border-slate-500'
                }
              `}
              style={neonStyle('99,102,241', selected)}
            >
              {min} min
            </button>
          );
        })}
      </div>

      {/* Grace period — cyan 741Hz */}
      <p className="text-sm font-light text-slate-300 mb-2">Grace period</p>
      <div className="flex gap-2 mb-6">
        {TIMER_REMINDERS.map((min) => {
          const selected = reminder === min;
          return (
            <button
              key={min}
              onClick={() => handleSelect(setReminder, min, 'cyan')}
              className={`
                px-4 py-2 rounded-full text-sm font-light
                transition-all duration-[144ms] active:scale-95
                ${selected
                  ? 'text-cyan-300'
                  : 'text-slate-300 border border-slate-700 hover:text-white hover:border-slate-500'
                }
              `}
              style={neonStyle('34,211,238', selected)}
            >
              {REMINDER_LABELS[min]}
            </button>
          );
        })}
      </div>

      {/* Rounds — violet 852Hz */}
      <p className="text-sm font-light text-slate-300 mb-2">Rounds</p>
      <div className="flex gap-2">
        {TIMER_ROUNDS.map((n) => {
          const selected = rounds === n;
          return (
            <button
              key={n}
              onClick={() => handleSelect(setRounds, n, 'violet')}
              className={`
                w-11 h-11 rounded-full text-sm font-light
                transition-all duration-[144ms] active:scale-95
                ${selected
                  ? 'text-violet-300'
                  : 'text-slate-300 border border-slate-700 hover:text-white hover:border-slate-500'
                }
              `}
              style={neonStyle('139,92,246', selected)}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
