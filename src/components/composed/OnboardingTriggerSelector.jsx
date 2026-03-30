/**
 * OnboardingTriggerSelector - Trigger selection for onboarding flow
 * Shows curated defaults + custom input with validation
 */

'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { DEFAULT_TRIGGERS } from '@/lib/constants';
import { isValidTriggerName } from '@/lib/validators';
import { useReducedMotion } from '@/hooks';

export default function OnboardingTriggerSelector({ onComplete }) {
  const prefersReduced = useReducedMotion();
  const [selected, setSelected] = useState([]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTriggers, setCustomTriggers] = useState([]);
  const [inputError, setInputError] = useState(null);

  const allTriggers = [...DEFAULT_TRIGGERS, ...customTriggers];

  const toggleTrigger = (trigger) => {
    setSelected((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleAddCustom = () => {
    const { valid, error } = isValidTriggerName(customTrigger);
    if (!valid) {
      setInputError(error);
      return;
    }
    const trimmed = customTrigger.trim();
    if (allTriggers.includes(trimmed)) {
      setInputError('Already in the list');
      return;
    }
    setCustomTriggers((prev) => [...prev, trimmed]);
    setSelected((prev) => [...prev, trimmed]);
    setCustomTrigger('');
    setShowCustomInput(false);
    setInputError(null);
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-[26px]">
        <h1
          className="text-2xl text-white mb-[10px]"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Which sounds affect you?
        </h1>
        <p className="text-sm text-slate-300 font-light">
          Select the ones you recognise. You can always update these later.
        </p>
      </div>

      {/* Trigger chips */}
      <div className="flex flex-wrap justify-center gap-[10px] mb-[26px] w-full px-6 max-w-sm">
        {allTriggers.map((trigger) => {
          const isSelected = selected.includes(trigger);
          return (
            <button
              key={trigger}
              onClick={() => toggleTrigger(trigger)}
              className={`
                px-4 py-2.5 rounded-full text-sm font-light transition-all duration-[233ms]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60
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
            className="px-4 py-2.5 rounded-full text-sm font-light transition-all duration-[233ms]
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
        <div className="max-w-xs mb-4 mx-auto" style={{ animation: prefersReduced ? 'none' : 'fadeIn 0.377s ease-out' }}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customTrigger}
              onChange={(e) => { setCustomTrigger(e.target.value); setInputError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="Type a sound..."
              aria-label="Add a sound you recognise"
              maxLength={50}
              autoFocus
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2.5
                text-base text-white font-light placeholder-slate-500 focus:outline-none
                focus:border-indigo-500/50 transition-colors"
            />
            <button
              onClick={handleAddCustom}
              disabled={!customTrigger.trim()}
              aria-label="Add custom trigger"
              className="p-2.5 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-white
                hover:bg-indigo-500/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setShowCustomInput(false); setCustomTrigger(''); setInputError(null); }}
              aria-label="Cancel"
              className="p-2.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400
                hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {inputError && (
            <p className="text-xs text-slate-300 font-light mt-2 text-center">{inputError}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="w-full">
        <Button
          onClick={() => onComplete(selected)}
          disabled={selected.length === 0}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </>
  );
}
