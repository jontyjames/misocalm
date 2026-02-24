/**
 * Onboarding - Assessment
 * Simple self-assessment — one question, no clinical scale
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner, ProgressDots } from '@/components/ui';
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
    value: 'severe',
    label: 'Severely',
    description: 'It shapes most of my decisions and routines',
  },
  {
    value: 'unsure',
    label: "I'm not sure yet",
    description: "I'm still figuring it out",
  },
];

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
    setTimeout(() => router.push(ROUTES.ONBOARDING_PLAN), 377);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.597s ease-out' }}>
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
                relative w-full text-left p-4 rounded-xl overflow-hidden
                border border-white/[0.18] backdrop-blur-2xl
                hover:border-white/30 transition-all duration-[233ms]
                ${selected === option.value
                  ? '!border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : ''
                }
              `}
              style={{
                background: selected === option.value
                  ? 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(99,102,241,0.15) 100%)'
                  : 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              {/* Glass overlays */}
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)' }} />
              <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 20%, transparent 45%)' }} />

              {/* Text content above glass layers */}
              <p className="relative text-lg text-white font-light">{option.label}</p>
              <p className="relative text-sm text-indigo-300 font-light mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
