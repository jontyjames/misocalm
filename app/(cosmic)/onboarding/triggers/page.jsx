/**
 * Onboarding - Triggers
 * Select trigger sounds — personalisation before signup
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useReducedMotion } from '@/hooks';
import { ProgressDots } from '@/components/ui';
import { OnboardingTriggerSelector } from '@/components/composed';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 2;
const THANK_YOU_MESSAGE = 'Thank you for trusting us with this.';

export default function TriggersPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);

  const handleComplete = (selected) => {
    const existingData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}'
    );
    localStorage.setItem(
      STORAGE_KEYS.ONBOARDING_DATA,
      JSON.stringify({ ...existingData, triggers: selected })
    );
    setSubmitted(true);
    setTimeout(() => router.push(ROUTES.ONBOARDING_PROFILE), 1597);
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
              className={`text-2xl text-white ${prefersReduced ? '' : 'opacity-0'}`}
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
                animation: prefersReduced ? 'none' : `fadeIn 0.377s ease-out ${i * 0.034}s forwards`,
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
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: prefersReduced ? 'none' : 'fadeIn 1.597s ease-out' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-[26px]">
        <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <OnboardingTriggerSelector onComplete={handleComplete} onSkip={handleSkip} />
      </div>

      {/* Privacy note */}
      <div className="text-center pb-4">
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
