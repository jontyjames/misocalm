/**
 * DeeperProcessing - Context-aware reflective journaling
 * Shows different prompts based on origin (trigger, check-in, breathwork)
 * Stores question + answer pairs so the data is self-documenting
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { triggerLogService } from '@/services';
import {
  ROUTES,
  FIBONACCI_TIMING,
  DEEPER_PROMPTS_TRIGGER,
  DEEPER_PROMPTS_CHECKIN,
  DEEPER_PROMPTS_BREATHWORK,
} from '@/lib/constants';
import DeeperClosing from './DeeperClosing';

const CLOSING_MESSAGES = {
  trigger: 'Thank you for going there',
  check_in: 'Thank you for checking in with yourself',
  breathwork: 'Thank you for staying present',
};

const SUBTITLES = {
  trigger: 'There are no right answers. Write as much or as little as feels right.',
  check_in: 'Just notice what comes up. Nothing to fix.',
  breathwork: 'Let the practice settle. Notice what remains.',
};

const PROMPT_POOLS = {
  trigger: DEEPER_PROMPTS_TRIGGER,
  check_in: DEEPER_PROMPTS_CHECKIN,
  breathwork: DEEPER_PROMPTS_BREATHWORK,
};

/**
 * Select 3 prompts (prime) from the pool, cycling daily.
 * Uses day-of-year as seed so prompts rotate but stay consistent within a day.
 * Pools must have >= 3 items (all current pools are 7, 11, 23).
 */
function selectPrompts(pool) {
  if (!pool || pool.length < 3) return pool || [];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const selected = [];
  const stride = Math.max(1, Math.floor(pool.length / 3));

  for (let i = 0; i < 3; i++) {
    const idx = (dayOfYear + i * stride) % pool.length;
    selected.push(pool[idx]);
  }

  return selected;
}

function getContext(searchParams) {
  const isCheckIn = searchParams.get('type') === 'check_in';
  const fromBreathwork = searchParams.get('from') === 'breathwork';

  if (isCheckIn && fromBreathwork) return 'breathwork';
  if (isCheckIn) return 'check_in';
  return 'trigger';
}

export default function DeeperProcessing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get('entry');
  const { user } = useAuth();

  const context = useMemo(() => getContext(searchParams), [searchParams]);
  const prompts = useMemo(() => selectPrompts(PROMPT_POOLS[context]), [context]);
  const closingMessage = CLOSING_MESSAGES[context];
  const subtitle = SUBTITLES[context];

  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState(['', '', '']);
  const [saving, setSaving] = useState(false);
  const [showClosing, setShowClosing] = useState(false);

  const saveAndExit = async () => {
    setSaving(true);

    // Store as question + answer pairs (self-documenting)
    const entries = [];
    prompts.forEach((prompt, i) => {
      if (responses[i]?.trim()) {
        entries.push({ question: prompt, answer: responses[i].trim() });
      }
    });

    if (entries.length > 0 && entryId && user?.id) {
      await triggerLogService.update(entryId, {
        deeper_processing: {
          context,
          entries,
        },
      });
    }

    setSaving(false);
    setShowClosing(true);
  };

  const handleNext = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(p => p + 1);
    } else {
      saveAndExit();
    }
  };

  const updateResponse = (text) => {
    setResponses(prev => {
      const next = [...prev];
      next[currentPrompt] = text;
      return next;
    });
  };

  if (showClosing) {
    return <DeeperClosing message={closingMessage} context={context} />;
  }

  return (
    <div className="px-6 py-8" style={{ animation: `fadeIn ${FIBONACCI_TIMING.ease}ms ease-out` }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push(ROUTES.JOURNAL)}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1
          className="text-2xl text-white"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            textShadow: '0 0 16px rgba(139,92,246,0.3)',
          }}
        >
          Going a little deeper
        </h1>
      </div>

      <p className="text-slate-300 font-light mb-10">
        {subtitle}
      </p>

      {/* Current prompt */}
      <div
        key={currentPrompt}
        style={{ animation: 'fadeIn 0.377s ease-out' }}
      >
        <h2
          className="text-lg text-violet-300 mb-4"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          {prompts[currentPrompt]}
        </h2>

        <textarea
          value={responses[currentPrompt]}
          onChange={(e) => updateResponse(e.target.value)}
          placeholder="Write here..."
          rows={5}
          autoFocus
          className="w-full px-4 py-3 rounded-xl text-sm font-light bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-violet-500/50 focus:outline-none resize-none mb-6"
        />

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          {prompts.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-[233ms] ${
                i <= currentPrompt ? 'bg-violet-500/50' : 'bg-slate-700/50'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={saveAndExit}
            disabled={saving}
            className="text-sm text-slate-300 hover:text-slate-200 transition-colors font-light"
          >
            {saving ? 'Saving...' : "That's enough for now"}
          </button>

          <button
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-2.5 rounded-full text-sm font-light bg-violet-500/20 border border-violet-500/40 text-violet-300 hover:bg-violet-500/30 transition-all duration-[233ms]"
          >
            {currentPrompt < prompts.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
}
