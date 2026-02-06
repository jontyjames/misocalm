/**
 * Onboarding - Assessment
 * Simple self-assessment — one question, no clinical scale
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 5;

const IMPACT_OPTIONS = [
  {
    value: 'mild',
    label: 'A little',
    description: "It's manageable most of the time",
  },
  {
    value: 'moderate',
    label: 'Quite a bit',
    description: 'It affects my relationships and comfort',
  },
  {
    value: 'significant',
    label: 'Significantly',
    description: 'It impacts most of my day',
  },
  {
    value: 'unsure',
    label: "I'm not sure yet",
    description: "I'm still figuring it out",
  },
];

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

export default function AssessmentPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selected, setSelected] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSelect = (value) => {
    setSelected(value);

    // Store assessment data
    const existingData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}'
    );
    localStorage.setItem(
      STORAGE_KEYS.ONBOARDING_DATA,
      JSON.stringify({ ...existingData, impact: value })
    );

    // Navigate after a brief moment
    setTimeout(() => router.push(ROUTES.ONBOARDING_PLAN), 400);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-300 font-light">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.6s ease-out' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
      </div>

      {/* Content — centred */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-2xl text-white mb-4"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            How much does misophonia<br />
            affect your daily life?
          </h1>
          <p className="text-sm text-indigo-400 font-light">
            This helps us personalise your experience
          </p>
        </div>

        {/* Options */}
        <div className="w-full max-w-sm space-y-3">
          {IMPACT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full text-left p-4 rounded-xl transition-all duration-200
                ${selected === option.value
                  ? 'bg-indigo-500/30 border border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-600'
                }
              `}
            >
              <p className="text-lg text-white font-light">{option.label}</p>
              <p className="text-sm text-indigo-300 font-light mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
