/**
 * Onboarding - Enter Your Sanctuary
 * Final screen — the promise fulfilled
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userTriggerService } from '@/services';
import { Button, Spinner, ProgressDots } from '@/components/ui';
import { Logo } from '@/components/composed';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 6;

export default function PlanPage() {
  const router = useRouter();
  const { user, upsertProfile, refreshProfile, isAuthenticated, loading: authLoading } = useAuth();
  const [onboardingData, setOnboardingData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Reveal content after letter animation finishes
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2584);
    return () => clearTimeout(timer);
  }, []);

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

    // Refresh profile so dashboard sees onboarding_completed: true
    await refreshProfile();
    router.push(ROUTES.DASHBOARD);
  };

  if (authLoading || !onboardingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 relative" style={{ animation: 'fadeIn 1.6s ease-out' }}>
      {/* Soft radial glow — lights coming on with content */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-[987ms] ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(ellipse at center 45%, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)',
        }}
      />

      {/* Top bar — all dots complete */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
      </div>

      {/* Content — centred */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        {/* Encouragement — letter by letter */}
        <div className="flex items-center justify-center flex-wrap mb-10">
          {'Well done for choosing this path'.split('').map((char, i) => (
            <span
              key={i}
              className="text-lg text-white/80 opacity-0"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
                textShadow: '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)',
                animation: `fadeIn 0.377s ease-out ${0.377 + i * 0.034}s forwards`,
                width: char === ' ' ? '0.4em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        {/* Everything below fades in together after letter animation */}

          {/* Logo — always visible */}
          <div className="mb-10 flex justify-center">
            <Logo size="xl" />
          </div>

          <div className={`transition-opacity duration-[1597ms] ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {/* Header */}
          <h1
            className="text-[2rem] text-white mb-3"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, letterSpacing: '0.06em' }}
          >
            Your sanctuary is ready
          </h1>

          <p className="text-lg text-white/70 font-light leading-relaxed mb-3">
            A companion for living with misophonia
          </p>
          <p className="text-lg text-indigo-300 font-light mb-10">
            All here for you
          </p>

          <div className="relative flex justify-center">
            <div
              className="absolute -inset-4 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
            <Button
              onClick={handleEnter}
              loading={saving}
              shape="pill"
              className="relative w-64 !border-2 !border-white/[0.33] hover:!border-white/40"
              size="lg"
              style={{ boxShadow: '0 0 12px rgba(255,255,255,0.06)' }}
            >
              Enter MisoCalm
            </Button>
          </div>
          </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center pb-4">
        <p className="text-xs text-slate-300 font-light">
          MisoCalm is a wellness tool, not a substitute for professional support
        </p>
      </div>
    </div>
  );
}
