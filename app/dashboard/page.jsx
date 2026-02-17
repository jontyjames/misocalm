/**
 * Dashboard — The Sanctuary Centre
 * A calm, minimal home screen with one clear invitation
 */

'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Wind } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout, BetaInstallBanner } from '@/components/composed';
import { Spinner } from '@/components/ui';
import { ROUTES, DAILY_AFFIRMATIONS, DAILY_PRACTICES_ROTATION } from '@/lib/constants';
import { getDayOfYear } from '@/lib/dateUtils';

const DAILY_MESSAGES = [
  'Your space is ready.',
  'You showed up. That matters.',
  "Whenever you need this, it's here.",
  "A moment of calm, whenever you're ready.",
  'Welcome back. Take what you need today.',
  'You carry more than most people see.',
  'We trust you. Completely.',
];

function getDailyMessage() {
  return DAILY_MESSAGES[getDayOfYear() % DAILY_MESSAGES.length];
}

function getDailyAffirmation() {
  return DAILY_AFFIRMATIONS[getDayOfYear() % DAILY_AFFIRMATIONS.length];
}

function getDailyPractice() {
  return DAILY_PRACTICES_ROTATION[getDayOfYear() % DAILY_PRACTICES_ROTATION.length];
}

const ACCENT_STYLES = {
  indigo: { bg: 'bg-indigo-500/15', border: 'border-indigo-500/20', text: 'text-indigo-400', glow: 'rgba(99,102,241,0.08)', rgba: 'rgba(99,102,241,' },
  violet: { bg: 'bg-violet-500/15', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'rgba(139,92,246,0.08)', rgba: 'rgba(139,92,246,' },
  cyan:   { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/20',   text: 'text-cyan-400',   glow: 'rgba(34,211,238,0.08)', rgba: 'rgba(34,211,238,' },
};

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isAuthenticated, loading, hasCompletedOnboarding } = useAuth();
  const todaysPractice = useMemo(() => getDailyPractice(), []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(ROUTES.HOME);
      } else if (!hasCompletedOnboarding) {
        // Don't redirect if we just finished onboarding (context hasn't caught up yet)
        const justCompleted = sessionStorage.getItem('onboarding_just_completed');
        if (justCompleted) {
          sessionStorage.removeItem('onboarding_just_completed');
          return;
        }
        router.push(ROUTES.ONBOARDING_ASSESSMENT);
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, loading, router]);

  if (loading || !profile) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <BetaInstallBanner />
      <div className="flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.6s ease-out', height: 'calc(100dvh - 6rem)' }}>
        {/* Header — pinned to top */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <img
              src="/icons/MisoCalm-logo-v1.png"
              alt="MisoCalm"
              className="w-5 h-5 translate-y-[-3px]"
            />
            <span
              className="text-xl text-white leading-none"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              MisoCalm
            </span>
          </div>
          <button
            onClick={() => router.push(ROUTES.PROFILE)}
            aria-label="View profile"
            className="w-11 h-11 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-500/30 transition-all duration-[233ms]"
          >
            <span
              className="text-sm text-indigo-300 leading-none"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}
            >
              {profile?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </button>
        </div>

        {/* Content — vertically centred */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Greeting */}
          <div className="mb-10">
            <h1
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              Welcome back, {profile.name}
            </h1>
            <p className="text-base text-slate-300 font-light">
              {getDailyMessage()}
            </p>
            <p
              className="text-sm text-indigo-300/70 font-light italic mt-3"
              style={{ animation: 'fadeIn 2.584s ease-out' }}
            >
              {getDailyAffirmation()}
            </p>
          </div>

          {/* Find my calm — the heart of the sanctuary */}
          <div className="relative w-full" style={{ marginBottom: '26px' }}>
            {/* Ambient glow — toroidal field: vertically elongated, energy flows up and down */}
            <div
              className="absolute rounded-3xl pointer-events-none"
              style={{
                top: '-2rem', bottom: '-2rem', left: '-1.5rem', right: '-1.5rem',
                background: 'radial-gradient(ellipse 90% 140% at center, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 45%, transparent 70%)',
                filter: 'blur(24px)',
                animation: 'glow-breathe 8s ease-in-out infinite',
              }}
            />
            <button
              onClick={() => router.push(ROUTES.CALM)}
              className="
                relative w-full py-8 rounded-2xl overflow-hidden
                border border-white/[0.18]
                backdrop-blur-xl
                transition-all duration-[610ms]
                hover:border-white/30
              "
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(139,92,246,0.08) 60%, rgba(99,102,241,0.06) 100%)',
                boxShadow: `
                  inset 0 1px 0 0 rgba(255,255,255,0.18),
                  inset 0 -1px 0 0 rgba(255,255,255,0.04),
                  0 0 30px rgba(139,92,246,0.15),
                  0 8px 32px rgba(0,0,0,0.3)
                `,
              }}
            >
              {/* Glass highlight — bright top edge */}
              <div
                className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 70%, transparent 95%)',
                }}
              />
              {/* Phi opacity layers — 0.03, 0.05, 0.08, 0.13 (Fibonacci) */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
                }}
              />
              {/* Torus flow — light enters top centre, curves outward, returns at bottom */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 40% at 50% 110%, rgba(99,102,241,0.06) 0%, transparent 60%)',
                }}
              />
              {/* Solfeggio breathing — violet 852Hz rhythm */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)',
                  backgroundSize: '100% 200%',
                  animation: 'solfeggio-breathe-852 3.7s ease-in-out infinite',
                }}
              />
              {/* Slow shimmer */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 60%, transparent 70%)',
                  backgroundSize: '250% 100%',
                  animation: 'shimmer 13s ease-in-out infinite',
                }}
              />
              <span
                className="relative block text-2xl text-white mb-2"
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 200,
                  letterSpacing: '0.04em',
                }}
              >
                Find my calm
              </span>
              <span className="relative block text-sm text-slate-300 font-light">
                A guided breathing practice, ready when you are
              </span>
            </button>
          </div>

          {/* Today's Practice — rotates daily across all 9 sessions */}
          <button
            onClick={() => router.push(`/tools/${todaysPractice.id}?duration=${todaysPractice.duration}`)}
            className="relative overflow-hidden w-full p-5 rounded-xl border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms] text-left mb-2.5"
            style={{
              background: `linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, ${ACCENT_STYLES[todaysPractice.accent].rgba}0.08) 100%)`,
              boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px ${ACCENT_STYLES[todaysPractice.accent].rgba}0.12), 0 4px 20px rgba(0,0,0,0.25)`,
            }}
          >
            {/* Glass top highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
            {/* Phi opacity layers */}
            <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
            {/* Torus flow */}
            <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${ACCENT_STYLES[todaysPractice.accent].rgba}0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, ${ACCENT_STYLES[todaysPractice.accent].rgba}0.06) 0%, transparent 60%)` }} />
            <div className="relative flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${ACCENT_STYLES[todaysPractice.accent].bg} border ${ACCENT_STYLES[todaysPractice.accent].border} flex items-center justify-center shrink-0`}>
                <Wind className={`w-5 h-5 ${ACCENT_STYLES[todaysPractice.accent].text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-light mb-0.5">Today's Practice</h2>
                <p className={`text-sm font-light ${ACCENT_STYLES[todaysPractice.accent].text}`}>
                  {todaysPractice.name} · {todaysPractice.label} · {todaysPractice.time}
                </p>
              </div>
            </div>
          </button>

          {/* Go inward */}
          <button
            onClick={() => router.push(ROUTES.JOURNAL)}
            className="relative overflow-hidden w-full p-5 rounded-xl border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms] text-left"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(34,211,238,0.08) 100%)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px rgba(34,211,238,0.12), 0 4px 20px rgba(0,0,0,0.25)',
            }}
          >
            {/* Glass top highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
            {/* Phi opacity layers */}
            <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
            {/* Torus flow */}
            <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(34,211,238,0.06) 0%, transparent 60%)' }} />
            <div className="relative flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-light mb-0.5">Go inward</h2>
                <p className="text-sm text-cyan-400 font-light">Reflect, log, or check in with yourself</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
