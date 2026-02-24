/**
 * DeeperClosing - Closing animation + path buttons after deeper processing
 * Letter-by-letter message reveal, then sacred glass path buttons
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Wind, Home } from 'lucide-react';
import { ROUTES, FIBONACCI_TIMING, DAILY_PRACTICES_ROTATION } from '@/lib/constants';
import { getDayOfYear } from '@/lib/dateUtils';
import { useReducedMotion } from '@/hooks';

export default function DeeperClosing({ message, context }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [closingChars, setClosingChars] = useState(0);
  const [showPaths, setShowPaths] = useState(false);

  const practice = useMemo(() => {
    return DAILY_PRACTICES_ROTATION[getDayOfYear() % DAILY_PRACTICES_ROTATION.length];
  }, []);

  useEffect(() => {
    if (closingChars < message.length) {
      const timer = setTimeout(() => setClosingChars(v => v + 1), FIBONACCI_TIMING.micro);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowPaths(true), FIBONACCI_TIMING.ceremony);
      return () => clearTimeout(timer);
    }
  }, [closingChars, message]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <h1
          className="text-2xl leading-relaxed mb-16"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            textShadow: '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)',
            minHeight: '4rem',
          }}
        >
          {(() => {
            const words = message.split(' ');
            let charIndex = 0;
            return words.map((word, wi) => {
              const startIdx = charIndex;
              charIndex += word.length + 1;
              return (
                <span key={wi} className="inline-block whitespace-nowrap">
                  {word.split('').map((char, ci) => (
                    <span
                      key={ci}
                      style={{
                        opacity: startIdx + ci < closingChars ? 1 : 0,
                        transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  {wi < words.length - 1 && (
                    <span style={{ opacity: startIdx + word.length < closingChars ? 1 : 0, transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out' }}>&nbsp;</span>
                  )}
                </span>
              );
            });
          })()}
        </h1>

        {showPaths && (
          <div className="space-y-4" style={{ animation: prefersReduced ? 'none' : 'fadeIn 0.377s ease-out' }}>
            {/* Don't offer breathwork after breathwork (creates a loop) */}
            {context !== 'breathwork' && (
              <button
                onClick={() => router.push(`/tools/${practice.id}?duration=${practice.duration}`)}
                className="relative w-full p-5 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 text-left transition-all duration-[233ms]"
                style={{
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(34,211,238,0.08) 100%)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px rgba(34,211,238,0.12), 0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(34,211,238,0.06) 0%, transparent 60%)' }} />
                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-cyan-500/30 bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Wind className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white mb-1" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
                      Breathe
                    </h3>
                    <p className="text-sm text-slate-300 font-light">
                      Go straight into a calming practice
                    </p>
                  </div>
                </div>
              </button>
            )}

            <button
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="relative w-full p-5 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 text-left transition-all duration-[233ms]"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl border border-indigo-500/30 bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
                    Return to sanctuary
                  </h3>
                  <p className="text-sm text-slate-300 font-light">
                    Head back when you are ready
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
