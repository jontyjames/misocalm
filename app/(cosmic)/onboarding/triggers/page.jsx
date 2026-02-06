/**
 * Onboarding - Triggers
 * Select trigger sounds — personalisation before signup
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui';
import { DEFAULT_TRIGGERS, ROUTES, STORAGE_KEYS } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 2;

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${i + 1 === current
              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
              : i + 1 < current
                ? 'bg-cyan-400/50'
                : 'bg-slate-700'
            }
          `}
        />
      ))}
    </div>
  );
}

const THANK_YOU_MESSAGE = 'Thank you for trusting us with this.';

export default function TriggersPage() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTriggers, setCustomTriggers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const allTriggers = [...DEFAULT_TRIGGERS, ...customTriggers];

  const toggleTrigger = (trigger) => {
    setSelected((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleAddCustom = () => {
    const trimmed = customTrigger.trim();
    if (trimmed && !allTriggers.includes(trimmed)) {
      setCustomTriggers((prev) => [...prev, trimmed]);
      setSelected((prev) => [...prev, trimmed]);
      setCustomTrigger('');
      setShowCustomInput(false);
    }
  };

  const handleContinue = () => {
    const existingData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}'
    );
    localStorage.setItem(
      STORAGE_KEYS.ONBOARDING_DATA,
      JSON.stringify({ ...existingData, triggers: selected })
    );
    setSubmitted(true);
    setTimeout(() => router.push(ROUTES.ONBOARDING_PROFILE), 2000);
  };

  const handleSkip = () => {
    router.push(ROUTES.ONBOARDING_PROFILE);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="flex items-center justify-center flex-wrap">
          {THANK_YOU_MESSAGE.split('').map((char, i) => (
            <span
              key={i}
              className="text-2xl text-white opacity-0"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
                animation: `fadeIn 0.3s ease-out ${i * 0.04}s forwards`,
                width: char === ' ' ? '0.4em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.6s ease-out' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
        <button
          onClick={handleSkip}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content — centred in available space */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl text-white mb-4"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            What sounds affect you?
          </h1>
          <p className="text-sm text-slate-200 font-light leading-relaxed mb-3">
            To support your journey, we need to understand<br />
            what affects you most
          </p>
          <p className="text-sm text-indigo-400 font-light">
            Naming your triggers is the first step to managing them
          </p>
        </div>

        {/* Trigger chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-sm">
          {allTriggers.map((trigger) => {
            const isSelected = selected.includes(trigger);
            return (
              <button
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={`
                  px-4 py-2.5 rounded-full text-sm font-light transition-all duration-200
                  ${isSelected
                    ? 'bg-indigo-500/30 border border-indigo-400/50 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                    : 'bg-slate-800/40 border border-slate-700/50 text-slate-300 hover:border-slate-600'
                  }
                `}
              >
                {trigger}
              </button>
            );
          })}

          {/* Add custom trigger button */}
          {!showCustomInput && (
            <button
              onClick={() => setShowCustomInput(true)}
              className="px-4 py-2.5 rounded-full text-sm font-light transition-all duration-200
                bg-slate-800/20 border border-dashed border-slate-700/50 text-slate-300
                hover:border-slate-600 hover:text-slate-300 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add your own
            </button>
          )}
        </div>

        {/* Custom trigger input */}
        {showCustomInput && (
          <div className="flex items-center gap-2 max-w-xs mb-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <input
              type="text"
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="Type a trigger..."
              autoFocus
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2.5
                text-sm text-white font-light placeholder-slate-500 focus:outline-none
                focus:border-indigo-500/50 transition-colors"
            />
            <button
              onClick={handleAddCustom}
              disabled={!customTrigger.trim()}
              className="p-2.5 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-white
                hover:bg-indigo-500/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setShowCustomInput(false); setCustomTrigger(''); }}
              className="p-2.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400
                hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="text-center pb-4">
        <div className="mb-5">
          <Button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-slate-300" />
          <p className="text-xs text-slate-300 font-light">
            Your information is private and never shared
          </p>
        </div>
      </div>
    </div>
  );
}
