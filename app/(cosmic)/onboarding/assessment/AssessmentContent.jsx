/**
 * Assessment Content
 * Handles both first-time onboarding and retake from profile
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useReducedMotion } from '@/hooks';
import { ProgressDots } from '@/components/ui';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';
import { SACRED_GLASS_STATIC_CLASSES, sacredGlassStaticStyle, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE } from '@/lib/sacredGlass';

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

export default function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReduced = useReducedMotion();
  const { upsertProfile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const isRetake = searchParams.get('from') === 'profile';

  const handleSelect = async (value) => {
    setSelected(value);

    if (isRetake) {
      // Retake mode: save directly to profile, then go back
      setSaving(true);
      await upsertProfile({ impact_level: value });
      await refreshProfile();

      // Brief confirmation before redirecting (987ms = fib-breathe)
      setTimeout(() => router.push(ROUTES.PROFILE), 987);
    } else {
      // First-time onboarding: store in localStorage, route to plan
      const existingData = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}'
      );
      localStorage.setItem(
        STORAGE_KEYS.ONBOARDING_DATA,
        JSON.stringify({ ...existingData, impact: value })
      );

      // Navigate after a brief moment (377ms = fib-flow)
      setTimeout(() => router.push(ROUTES.ONBOARDING_PLAN), 377);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: prefersReduced ? 'none' : 'fadeIn 1.597s ease-out' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        {isRetake ? (
          <button
            onClick={() => router.push(ROUTES.PROFILE)}
            className="flex items-center gap-1 text-sm text-indigo-300 font-light hover:text-indigo-200 transition-colors duration-[233ms]"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to profile
          </button>
        ) : (
          <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
        )}
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
            {isRetake
              ? 'Update your assessment anytime'
              : 'This helps us personalise your experience'
            }
          </p>
        </div>

        {/* Options */}
        <div className="w-full max-w-sm space-y-3">
          {IMPACT_OPTIONS.map((option) => {
            const isSelected = selected === option.value;
            const isUpdated = isRetake && saving && isSelected;

            return (
              <button
                key={option.value}
                onClick={() => !saving && handleSelect(option.value)}
                disabled={saving}
                className={`
                  relative w-full text-left p-4 rounded-xl overflow-hidden
                  ${SACRED_GLASS_STATIC_CLASSES}
                  hover:border-white/30 transition-all duration-[233ms]
                  ${isSelected
                    ? '!border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : ''
                  }
                  ${saving && !isSelected ? 'opacity-40' : ''}
                `}
                style={{
                  background: isSelected
                    ? 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(99,102,241,0.15) 100%)'
                    : sacredGlassStaticStyle().background,
                  boxShadow: sacredGlassStaticStyle().boxShadow,
                }}
              >
                {/* Glass overlays */}
                <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={GLASS_HIGHLIGHT_STYLE} />
                <div className="absolute inset-0 pointer-events-none rounded-xl" style={PHI_LAYERS_STYLE} />

                {/* Text content above glass layers */}
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-lg text-white font-light">{option.label}</p>
                    <p className="text-sm text-indigo-300 font-light mt-1">{option.description}</p>
                  </div>
                  {isUpdated && (
                    <span
                      className="text-sm text-indigo-300 font-light"
                      style={{ animation: prefersReduced ? 'none' : 'fadeIn 0.377s ease-out' }}
                    >
                      Updated
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
