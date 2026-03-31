/**
 * Dashboard — The Sanctuary Centre
 * A calm, minimal home screen with one clear invitation
 */

'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Wind, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNav } from '@/context/NavContext';
import { AppLayout, BetaInstallBanner } from '@/components/composed';
import { DashboardHeader, FindMyCalmCard, DashboardActionCard, DashboardSkeleton } from '@/components/composed/dashboard';
import { ROUTES, DAILY_AFFIRMATIONS } from '@/lib/constants';
import { getDayOfYear } from '@/lib/dateUtils';
import { getDailyPractice, buildPracticeHref } from '@/lib/dailyPractice';
import WelcomeArrival from '@/components/composed/welcome/WelcomeArrival';

const DAILY_MESSAGES = [
  'Your space is ready.',
  'You showed up. That matters.',
  "Whenever you need this, it's here.",
  "A moment of calm, whenever you're ready.",
  'Welcome back. Take what you need today.',
  'You carry more than most people see.',
  'We trust you. Completely.',
];

const ACCENT_STYLES = {
  indigo: { bg: 'bg-indigo-500/15', border: 'border-indigo-500/20', text: 'text-indigo-400', rgba: 'rgba(99,102,241,' },
  violet: { bg: 'bg-violet-500/15', border: 'border-violet-500/20', text: 'text-violet-400', rgba: 'rgba(139,92,246,' },
  cyan:   { bg: 'bg-cyan-500/15',   border: 'border-cyan-500/20',   text: 'text-cyan-400',   rgba: 'rgba(34,211,238,' },
  slate:  { bg: 'bg-slate-500/15',  border: 'border-slate-500/20',  text: 'text-slate-400',  rgba: 'rgba(148,163,184,' },
};

function getDailyMessage() {
  return DAILY_MESSAGES[getDayOfYear() % DAILY_MESSAGES.length];
}

function getDailyAffirmation() {
  return DAILY_AFFIRMATIONS[getDayOfYear() % DAILY_AFFIRMATIONS.length];
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dayParam = searchParams.get('day');
  const dayOverride = dayParam != null ? parseInt(dayParam, 10) : null;
  const { profile, isAuthenticated, loading, hasCompletedOnboarding, refreshProfile } = useAuth();
  const { setShowNav } = useNav();
  const todaysPractice = useMemo(() => getDailyPractice(), []);
  const profileFetchAttempted = useRef(false);
  const [profileFailed, setProfileFailed] = useState(false);
  const [welcomeComplete, setWelcomeComplete] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (dayParam != null) return false; // ?day= forces welcome to show
    return sessionStorage.getItem('misocalm_welcome_shown') === 'true';
  });
  const handleWelcomeComplete = useCallback(() => {
    if (dayParam == null) sessionStorage.setItem('misocalm_welcome_shown', 'true');
    setWelcomeComplete(true);
  }, [dayParam]);

  // Hide nav during welcome, restore on complete or unmount
  useEffect(() => {
    if (!welcomeComplete) setShowNav(false);
    else setShowNav(true);
    return () => setShowNav(true);
  }, [welcomeComplete, setShowNav]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push(ROUTES.HOME);
      return;
    }

    // Profile not loaded yet — fetch it before making any redirect decisions
    if (!profile) {
      if (!profileFetchAttempted.current) {
        profileFetchAttempted.current = true;
        refreshProfile().then((result) => {
          if (!result) setProfileFailed(true);
        });
      }
      return;
    }

    // Only redirect when we have a profile that confirms onboarding isn't done
    if (!hasCompletedOnboarding) {
      router.push(ROUTES.ONBOARDING_ASSESSMENT);
    }
  }, [isAuthenticated, hasCompletedOnboarding, loading, profile, router, refreshProfile]);

  if (loading || (!profile && !profileFailed)) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  if (profileFailed) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p
            className="text-xl text-white mb-2"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Something went quiet
          </p>
          <p className="text-sm text-slate-300 font-light mb-8">
            We couldn't load your profile. This usually resolves on retry.
          </p>
          <button
            onClick={() => {
              setProfileFailed(false);
              profileFetchAttempted.current = false;
              refreshProfile().then((result) => {
                if (!result) setProfileFailed(true);
              });
            }}
            className="px-6 py-3 rounded-full text-sm font-light bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 transition-all duration-[233ms]"
          >
            Try again
          </button>
        </div>
      </AppLayout>
    );
  }

  const practiceAccent = ACCENT_STYLES[todaysPractice.accent];

  return (
    <>
    <AppLayout>
      <div style={{
        opacity: welcomeComplete ? 1 : 0,
        transition: welcomeComplete ? 'opacity 987ms ease' : 'none',
      }}>
      <BetaInstallBanner />
      <div className="flex flex-col px-6 py-8 overflow-clip" style={{ animation: welcomeComplete ? 'fadeIn 0.377s ease-out' : 'none', height: 'calc(100dvh - 5rem - env(safe-area-inset-top, 0px))' }}>
        <DashboardHeader profileName={profile?.name} />

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

          <FindMyCalmCard />

          <DashboardActionCard
            href={buildPracticeHref(todaysPractice)}
            icon={todaysPractice.type === 'experience' ? Sparkles : Wind}
            iconColor={practiceAccent}
            accent={todaysPractice.accent}
            title="Today's Practice"
            subtitle={`${todaysPractice.name} · ${todaysPractice.label} · ${todaysPractice.time}`}
            className="mb-2.5"
          />

          <DashboardActionCard
            href={ROUTES.JOURNAL}
            icon={BookOpen}
            iconColor={{ bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400' }}
            accent="cyan"
            title="Go inward"
            subtitle="Reflect, log, or check in with yourself"
          />

          <a
            href={ROUTES.RESOURCES}
            className="text-slate-400/70 text-xs font-light tracking-wider hover:text-slate-300 transition-colors mt-6"
            style={{ transition: 'color 0.377s ease' }}
          >
            crisis support and resources
          </a>
        </div>
      </div>
      </div>
    </AppLayout>
    {!welcomeComplete && (
      <WelcomeArrival onComplete={handleWelcomeComplete} profileName={profile?.name} dayOverride={dayOverride} />
    )}
    </>
  );
}
