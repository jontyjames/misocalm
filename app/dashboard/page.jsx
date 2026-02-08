/**
 * Dashboard — The Sanctuary Centre
 * A calm, minimal home screen with one clear invitation
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui';
import { AppLayout, Logo } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

const DAILY_MESSAGES = [
  'Your space is ready.',
  'You showed up. That matters.',
  "Whenever you need this, it's here.",
  "A moment of calm, whenever you're ready.",
  'Welcome back. This space was waiting for you.',
  'You carry more than most people see.',
  'We trust you. Completely.',
];

function getDailyMessage() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length];
}

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isAuthenticated, loading, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(ROUTES.HOME);
      } else if (!hasCompletedOnboarding) {
        router.push(ROUTES.ONBOARDING_ASSESSMENT);
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, loading, router]);

  if (loading || !profile) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Logo size="md" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.6s ease-out', height: 'calc(100vh - 6rem)' }}>
        {/* Header — pinned to top */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            <img
              src="/icons/MisoMind-logo-v1.png"
              alt="MisoMind"
              className="w-5 h-5 translate-y-[-3px]"
            />
            <span
              className="text-xl text-white leading-none"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              MisoMind
            </span>
          </div>
          <button
            onClick={() => router.push(ROUTES.PROFILE)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <Settings className="w-5 h-5" />
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
          </div>

          {/* Find my calm — the heart of the sanctuary */}
          <div className="relative mb-8 w-full">
            {/* Ambient glow — breathes slowly */}
            <div
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 45%, transparent 70%)',
                filter: 'blur(24px)',
                animation: 'glow-breathe 8s ease-in-out infinite',
              }}
            />
            <button
              onClick={() => router.push('/calm')}
              className="
                relative w-full py-8 rounded-2xl overflow-hidden
                border border-violet-500/25
                backdrop-blur-sm
                transition-all duration-500
                hover:border-violet-400/40
              "
              style={{
                background: 'linear-gradient(160deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.1) 40%, rgba(124,58,237,0.08) 100%)',
              }}
            >
              {/* Slow shimmer */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.02) 42%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 58%, transparent 65%)',
                  backgroundSize: '250% 100%',
                  animation: 'shimmer 14s ease-in-out infinite',
                }}
              />
              <span
                className="relative block text-2xl text-white mb-2"
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 400,
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

          {/* Today's Practice */}
          <Card
            variant="interactive"
            onClick={() => router.push(ROUTES.TOOLS)}
            className="w-full mb-3"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <span className="text-xl">🫁</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-white font-light mb-0.5">Today's Practice</h3>
                <p className="text-sm text-slate-400 font-light">4-7-8 Breathing · 5 min</p>
              </div>
            </div>
          </Card>

          {/* Journal a response */}
          <Card
            variant="interactive"
            onClick={() => router.push(ROUTES.JOURNAL)}
            className="w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-white font-light mb-0.5">Journal a Response</h3>
                <p className="text-sm text-slate-400 font-light">Log a misophonia moment</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
