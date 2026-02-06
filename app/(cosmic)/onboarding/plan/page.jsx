/**
 * Onboarding - Enter Your Sanctuary
 * Final screen — the promise fulfilled
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userTriggerService } from '@/services';
import { Button } from '@/components/ui';
import { Logo } from '@/components/composed';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 6;

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

export default function PlanPage() {
  const router = useRouter();
  const { user, upsertProfile, isAuthenticated, loading: authLoading } = useAuth();
  const [onboardingData, setOnboardingData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
    if (!raw) {
      router.push(ROUTES.ONBOARDING_ASSESSMENT);
      return;
    }
    setOnboardingData(JSON.parse(raw));
  }, [router]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleEnter = async () => {
    if (!onboardingData) return;

    setSaving(true);

    try {
      // Save profile to database
      await upsertProfile({
        name: onboardingData.name,
        impact_level: onboardingData.impact,
        onboarding_completed: true,
      });

      // Save triggers to database
      if (user?.id && onboardingData.triggers && onboardingData.triggers.length > 0) {
        await userTriggerService.saveUserTriggers(user.id, onboardingData.triggers);
      }
    } catch (err) {
      // Continue to dashboard even if save fails
      console.error('Error saving onboarding data:', err);
    }

    // Clean up storage
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
    localStorage.removeItem(STORAGE_KEYS.PENDING_EMAIL);

    // Brief delay to let auth context update before navigating
    await new Promise((r) => setTimeout(r, 100));
    router.push(ROUTES.DASHBOARD);
  };

  if (authLoading || !onboardingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-300 font-light">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.6s ease-out' }}>
      {/* Top bar — all dots complete */}
      <div className="flex items-center justify-between mb-6">
        <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
      </div>

      {/* Content — centred */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <div className="mb-10">
          <Logo size="xl" />
        </div>

        {/* Header */}
        <h1
          className="text-[2rem] text-white mb-3"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, letterSpacing: '0.06em' }}
        >
          Your sanctuary is ready
        </h1>

        <p className="text-base text-slate-200 font-light leading-relaxed mb-3">
          Breathing tools, trigger tracking, and<br />
          personalised support
        </p>
        <p className="text-base text-indigo-400 font-light mb-10">
          All here for you
        </p>

        <Button
          onClick={handleEnter}
          loading={saving}
          shape="pill"
          className="w-64"
          size="lg"
        >
          Enter MisoMind
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="text-center pb-4">
        <p className="text-xs text-slate-300 font-light">
          MisoMind is a wellness tool, not a substitute for professional support
        </p>
      </div>
    </div>
  );
}
