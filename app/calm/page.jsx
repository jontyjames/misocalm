/**
 * Find My Calm — Support Level Selection
 * A gentle question: how much do you need right now?
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

// Solfeggio-mapped glass cards
// Each level breathes at its own harmonic rate, never syncing mechanically
const SUPPORT_LEVELS = [
  {
    id: 'quick',
    name: 'Just a moment',
    time: '1.5 min',
    description: 'A few breaths to bring you back to centre',
    color: 'rgba(99,102,241,',    // indigo — 528Hz, transformation
    badge: 'text-indigo-400 bg-indigo-400/10',
    breathe: 'solfeggio-breathe-528 5.28s ease-in-out infinite',
  },
  {
    id: 'deep',
    name: 'I need some space',
    time: '3 min',
    description: 'Enough space to let your body fully calm',
    color: 'rgba(139,92,246,',    // violet — 852Hz, intuition
    badge: 'text-violet-400 bg-violet-400/10',
    breathe: 'solfeggio-breathe-852 3.7s ease-in-out infinite',
  },
  {
    id: 'full',
    name: 'Stay with me',
    time: '4 min',
    description: 'A full session to find steady ground',
    color: 'rgba(34,211,238,',    // cyan — 741Hz, expression
    badge: 'text-cyan-400 bg-cyan-400/10',
    breathe: 'solfeggio-breathe-741 5.3s ease-in-out infinite',
  },
];

export default function CalmPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  const handleSelect = (level) => {
    router.push(`/tools/3?duration=${level.id}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.597s ease-out' }}>
        {/* Back button */}
        <button
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors self-start mb-4"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1
            className="text-2xl text-white mb-2 text-center"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            How much do you need right now?
          </h1>
          <p className="text-sm text-slate-300 font-light mb-8 text-center">
            There is no wrong answer
          </p>

          {/* Support level options */}
          <div className="space-y-4 w-full max-w-sm">
            {SUPPORT_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => handleSelect(level)}
                className="relative w-full p-5 rounded-xl overflow-hidden border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 transition-all duration-[233ms] text-left"
                style={{
                  background: `linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, ${level.color}0.08) 100%)`,
                  boxShadow: `
                    inset 0 1px 0 0 rgba(255,255,255,0.15),
                    inset 0 -1px 0 0 rgba(255,255,255,0.03),
                    0 0 16px ${level.color}0.12),
                    0 4px 20px rgba(0,0,0,0.25)
                  `,
                }}
              >
                {/* Glass top highlight */}
                <div
                  className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }}
                />
                {/* Phi opacity layers — 0.03, 0.05, 0.08, 0.13 (Fibonacci) */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={{ background: `linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)` }}
                />
                {/* Torus flow — light enters top centre, curves outward, returns at bottom */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={{
                    background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${level.color}0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, ${level.color}0.06) 0%, transparent 60%)`,
                  }}
                />
                {/* Solfeggio breathing glow — each card pulses at its harmonic rate */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={{
                    background: `radial-gradient(ellipse 120% 80% at 50% 50%, ${level.color}0.08) 0%, transparent 70%)`,
                    backgroundSize: '100% 200%',
                    animation: level.breathe,
                  }}
                />
                <div className="relative flex items-baseline justify-between mb-1.5">
                  <span
                    className="text-lg text-white"
                    style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                  >
                    {level.name}
                  </span>
                  <span className={`text-sm ${level.badge} px-2 py-0.5 rounded-full`}>{level.time}</span>
                </div>
                <p className="relative text-sm text-slate-200 font-light">{level.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
