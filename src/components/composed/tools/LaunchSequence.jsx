/**
 * LaunchSequence — 5-step solfeggio colour ascension countdown
 * Each step 987ms (fib-breathe), ascending from grounding to connection.
 */

'use client';

import { useState, useEffect } from 'react';
import { playLaunchTone } from '@/lib/timerSounds';

const STEPS = [
  { count: 5, color: '148,163,184', label: 'grounding' },
  { count: 4, color: '99,102,241', label: 'transformation' },
  { count: 3, color: '34,211,238', label: 'awakening' },
  { count: 2, color: '139,92,246', label: 'spirit' },
  { count: 1, color: '255,255,255', label: 'connection' },
];

export default function LaunchSequence({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    playLaunchTone(5);

    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next < 5) {
          playLaunchTone(5 - next);
        }
        if (next >= 5) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 610);
          return prev;
        }
        return next;
      });
    }, 987);

    return () => clearInterval(interval);
  }, [onComplete]);

  const current = STEPS[step];
  const { count, color, label } = current;

  return (
    <div
      key={step}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: `radial-gradient(circle at 50% 50%, rgba(${color}, 0.3) 0%, rgba(${color}, 0.08) 40%, rgba(0,0,0,0.95) 70%)`,
        animation: 'fadeIn 377ms ease-out',
      }}
    >
      {/* Countdown number */}
      <span
        className="text-8xl"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 100,
          color: `rgb(${color})`,
          textShadow: `0 0 42px rgba(${color}, 0.6), 0 0 110px rgba(${color}, 0.3)`,
        }}
      >
        {count}
      </span>

      {/* Frequency label */}
      <span
        className="text-lg font-light mt-4"
        style={{ color: `rgba(${color}, 0.7)` }}
      >
        {label}
      </span>
    </div>
  );
}
