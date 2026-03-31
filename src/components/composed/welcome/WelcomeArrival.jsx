/**
 * WelcomeArrival — soft entry screen before the dashboard
 *
 * Shown once per browser session. Selects today's animation variant
 * (one per day of the week), plays a canvas animation with letter-by-letter
 * text, then fades to reveal the dashboard underneath.
 *
 * Timing (all Fibonacci):
 *   0ms      — canvas starts, void-black fills screen
 *   610ms    — text begins letter-by-letter reveal (34ms stagger)
 *   ~2584ms  — text complete, animation at full beauty
 *   4181ms   — begin fade-out (987ms duration)
 *   ~5168ms  — welcome gone, dashboard revealed
 *
 * Tap anywhere to skip (233ms quick fade).
 */

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useReducedMotion } from '@/hooks';
import { VOID_BLACK } from '@/lib/constants';
import VARIANTS from './welcomeVariants';
import WelcomeCanvas from './WelcomeCanvas';

const LETTER_STAGGER = 34;   // fib — per character delay
const TEXT_DELAY = 610;       // fib — before text starts
const AUTO_FADE_AT = 4181;    // fib — start fade-out
const FADE_DURATION = 987;    // fib — fade-out length
const SKIP_FADE = 233;        // fib — tap-to-skip fade

export default function WelcomeArrival({ onComplete, profileName, dayOverride }) {
  const prefersReduced = useReducedMotion();
  const variant = useMemo(() => {
    const day = dayOverride != null ? dayOverride : new Date().getDay();
    return VARIANTS[day % 7];
  }, [dayOverride]);
  const [opacity, setOpacity] = useState(1);
  const [textVisible, setTextVisible] = useState(false);
  const completeCalled = useRef(false);
  const mountTime = useRef(Date.now());

  // Start text reveal after delay
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), prefersReduced ? 233 : TEXT_DELAY);
    return () => clearTimeout(t);
  }, [prefersReduced]);

  // Auto fade-out
  useEffect(() => {
    const delay = prefersReduced ? 2584 : AUTO_FADE_AT;
    const duration = prefersReduced ? 610 : FADE_DURATION;
    const t1 = setTimeout(() => setOpacity(0), delay);
    const t2 = setTimeout(() => {
      if (!completeCalled.current) {
        completeCalled.current = true;
        onComplete();
      }
    }, delay + duration);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete, prefersReduced]);

  // Tap to skip
  const handleSkip = useCallback(() => {
    if (completeCalled.current) return;
    setOpacity(0);
    setTimeout(() => {
      if (!completeCalled.current) {
        completeCalled.current = true;
        onComplete();
      }
    }, SKIP_FADE);
  }, [onComplete]);

  // Letter-by-letter text
  const message = variant.message;
  const elapsed = textVisible ? Date.now() - mountTime.current - (prefersReduced ? 233 : TEXT_DELAY) : 0;
  const charsVisible = textVisible ? Math.min(message.length, Math.floor(Math.max(0, elapsed) / LETTER_STAGGER)) : 0;

  // Force re-render during text reveal
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!textVisible || charsVisible >= message.length) return;
    const id = setInterval(() => setTick(t => t + 1), LETTER_STAGGER);
    return () => clearInterval(id);
  }, [textVisible, charsVisible, message.length]);

  return (
    <div
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      aria-label="Tap to continue"
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleSkip(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: VOID_BLACK,
        opacity,
        transition: `opacity ${opacity === 0 ? (completeCalled.current ? SKIP_FADE : FADE_DURATION) : 0}ms ease`,
        cursor: 'pointer',
      }}
    >
      {!prefersReduced && <WelcomeCanvas variant={variant} />}

      {/* Centered text */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
            letterSpacing: '0.1em',
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            textAlign: 'center',
            maxWidth: 340,
            padding: '0 26px',
            lineHeight: 1.8,
          }}
          className="text-slate-200"
        >
          {message.split('').map((char, i) => (
            <span
              key={i}
              style={{
                opacity: i < charsVisible ? 1 : 0,
                transition: `opacity 0.377s ease`,
              }}
            >
              {char}
            </span>
          ))}
        </p>

        {profileName && charsVisible >= message.length && (
          <p
            className="text-slate-400/50 text-xs font-light tracking-widest mt-6"
            style={{
              opacity: 0,
              animation: 'fadeIn 1.597s ease-out forwards',
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
            }}
          >
            welcome back, {profileName}
          </p>
        )}
      </div>
    </div>
  );
}
