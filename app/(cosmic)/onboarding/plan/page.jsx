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
  const [saveError, setSaveError] = useState(false);
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
      const profileResult = await upsertProfile({
        name: onboardingData.name || 'Friend',
        impact_level: onboardingData.impact,
        onboarding_completed: true,
      });

      if (profileResult?.error) {
        console.error('Profile save failed:', profileResult.error);
        setSaveError(true);
        setSaving(false);
        return;
      }

      // Verify it actually saved
      const freshProfile = await refreshProfile();
      if (!freshProfile?.onboarding_completed) {
        // Retry once
        console.warn('Onboarding save did not persist, retrying...');
        const retryResult = await upsertProfile({
          name: onboardingData.name || 'Friend',
          impact_level: onboardingData.impact,
          onboarding_completed: true,
        });

        if (retryResult?.error) {
          console.error('Profile retry failed:', retryResult.error);
          setSaveError(true);
          setSaving(false);
          return;
        }

        await refreshProfile();
      }

      // Save triggers to database
      let triggersSaved = false;
      if (user?.id && onboardingData.triggers && onboardingData.triggers.length > 0) {
        const { error } = await userTriggerService.saveUserTriggers(user.id, onboardingData.triggers);
        if (!error) {
          triggersSaved = true;
        } else {
          // Retry once after ceremony delay
          await new Promise(r => setTimeout(r, 1597));
          const { error: retryError } = await userTriggerService.saveUserTriggers(user.id, onboardingData.triggers);
          if (!retryError) triggersSaved = true;
        }
      } else {
        triggersSaved = true; // No triggers to save
      }

      // Only clear localStorage after confirmed DB save
      if (triggersSaved) {
        localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
        localStorage.removeItem(STORAGE_KEYS.PENDING_EMAIL);
      }
    } catch (err) {
      console.error('Error saving onboarding data:', err);
      setSaveError(true);
      setSaving(false);
      return;
    }

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
    <div className="min-h-screen flex flex-col px-6 py-8 relative" style={{ animation: 'fadeIn 1.597s ease-out' }}>
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
              className="text-xl sm:text-2xl text-white/80 opacity-0"
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
          <p className="text-lg text-indigo-300 font-light mb-6">
            All here for you
          </p>

          <div className="relative flex justify-center my-6">
            <button
              onClick={handleEnter}
              disabled={saving}
              className="relative overflow-hidden w-64 py-4 px-8 rounded-full border border-white/[0.25] backdrop-blur-2xl active:scale-[0.98] hover:border-white/40 transition-all duration-[233ms] cursor-pointer"
              style={{
                background: `linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 30%, rgba(99,102,241,0.12) 100%)`,
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.2), inset 0 -1px 0 0 rgba(255,255,255,0.04), 0 0 40px rgba(99,102,241,0.25), 0 0 80px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.3)`,
                animation: 'solfeggio-breathe-528 5.28s ease-in-out infinite',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.6) 50%, transparent 90%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.1) 15%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.16) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />
              <span
                className="relative z-10 font-light text-white text-base"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, textShadow: '0 0 12px rgba(255,255,255,0.3), 0 0 34px rgba(99,102,241,0.2)' }}
              >
                {saving ? 'Preparing...' : 'Enter MisoCalm'}
              </span>
            </button>
          </div>
          {saveError && (
            <div className="text-center mt-4">
              <p className="text-sm text-slate-300 font-light mb-3">
                Something went wrong. Please try again.
              </p>
              <Button onClick={handleEnter} variant="secondary" size="md">
                Try again
              </Button>
            </div>
          )}

          </div>
      </div>

      {/* Disclaimer — footer */}
      <div className="relative z-10 text-center pb-4">
        <p className="text-xs text-slate-300 font-light">
          MisoCalm is a wellness tool, not a substitute for professional support
        </p>
      </div>
    </div>
  );
}
