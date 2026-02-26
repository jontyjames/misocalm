/**
 * Find My Calm — Support Level Selection
 * A gentle question: how much do you need right now?
 */

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuthGuard } from '@/hooks';
import { AppLayout } from '@/components/composed';
import { ROUTES } from '@/lib/constants';
import { SACRED_GLASS_CLASSES, sacredGlassStyle, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE, torusFlowStyle, solfeggioBreathStyle, SOLFEGGIO_RGBA } from '@/lib/sacredGlass';

// Solfeggio-mapped glass cards
// Each level breathes at its own harmonic rate, never syncing mechanically
const SUPPORT_LEVELS = [
  {
    id: 'quick',
    name: 'Just a moment',
    time: '1.5 min',
    description: 'A few breaths to bring you back to centre',
    accent: 'indigo',    // 528Hz, transformation
    badge: 'text-indigo-400 bg-indigo-400/10',
    breathe: 'solfeggio-breathe-528 5.28s ease-in-out infinite',
  },
  {
    id: 'deep',
    name: 'I need some space',
    time: '3 min',
    description: 'Enough space to let your body fully calm',
    accent: 'violet',    // 852Hz, intuition
    badge: 'text-violet-400 bg-violet-400/10',
    breathe: 'solfeggio-breathe-852 3.7s ease-in-out infinite',
  },
  {
    id: 'full',
    name: 'Stay with me',
    time: '4 min',
    description: 'A full session to find steady ground',
    accent: 'cyan',    // 741Hz, expression
    badge: 'text-cyan-400 bg-cyan-400/10',
    breathe: 'solfeggio-breathe-741 5.3s ease-in-out infinite',
  },
];

export default function CalmPage() {
  const router = useRouter();
  useAuthGuard();

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
                className={`relative w-full p-5 rounded-xl overflow-hidden ${SACRED_GLASS_CLASSES} text-left`}
                style={sacredGlassStyle(level.accent)}
              >
                {/* Glass top highlight */}
                <div
                  className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                  style={GLASS_HIGHLIGHT_STYLE}
                />
                {/* Phi opacity layers — 0.03, 0.05, 0.08, 0.13 (Fibonacci) */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={PHI_LAYERS_STYLE}
                />
                {/* Torus flow — light enters top centre, curves outward, returns at bottom */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={torusFlowStyle(level.accent)}
                />
                {/* Solfeggio breathing glow — each card pulses at its harmonic rate */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={solfeggioBreathStyle(level.accent, level.breathe)}
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
