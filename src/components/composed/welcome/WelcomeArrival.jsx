/**
 * WelcomeArrival — soft entry screen before the dashboard
 *
 * Shown once per browser session. Selects today's animation variant
 * (one per day of the week), plays a canvas animation with letter-by-letter
 * text, then fades through darkness to gently reveal the dashboard.
 *
 * Phases:
 *   'active'     — canvas + text visible, letter-by-letter reveal
 *   'darkening'  — canvas + text fade to 0 (610ms), container stays opaque → void-black
 *   'revealing'  — container fades to 0 (987ms), dashboard appears underneath
 *   'done'       — onComplete called, component unmounts
 *
 * Timing (all Fibonacci):
 *   0ms      — canvas starts, void-black fills screen
 *   610ms    — text begins letter-by-letter reveal (34ms stagger)
 *   ~2584ms  — text complete, animation at full beauty
 *   4181ms   — phase → darkening (610ms content fade)
 *   4791ms   — phase → revealing (987ms container fade)
 *   5778ms   — done, onComplete fires
 *
 * Tap anywhere to skip (compressed: 233ms each phase).
 */

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useReducedMotion } from '@/hooks';
import { VOID_BLACK } from '@/lib/constants';
import VARIANTS from './welcomeVariants';
import WelcomeCanvas from './WelcomeCanvas';

const LETTER_STAGGER = 34;   // fib — per character delay
const TEXT_DELAY = 610;       // fib — before text starts
const AUTO_FADE_AT = 4181;    // fib — start darkening phase
const DARKEN_DURATION = 610;  // fib — content fade to black
const REVEAL_DURATION = 987;  // fib — container fade to show dashboard
const SKIP_FADE = 233;        // fib — compressed phase duration on tap

export default function WelcomeArrival({ onComplete, profileName, dayOverride }) {
  const prefersReduced = useReducedMotion();
  const variant = useMemo(() => {
    const day = dayOverride != null ? dayOverride : new Date().getDay();
    return VARIANTS[day % 7];
  }, [dayOverride]);

  const [phase, setPhase] = useState('active');
  const [textVisible, setTextVisible] = useState(false);
  const completeCalled = useRef(false);
  const mountTime = useRef(Date.now());
  const skipping = useRef(false);

  // Start text reveal after delay
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), prefersReduced ? 233 : TEXT_DELAY);
    return () => clearTimeout(t);
  }, [prefersReduced]);

  // Auto phase transitions
  useEffect(() => {
    const delay = prefersReduced ? 2584 : AUTO_FADE_AT;
    const darken = prefersReduced ? 377 : DARKEN_DURATION;
    const reveal = prefersReduced ? 610 : REVEAL_DURATION;

    const t1 = setTimeout(() => {
      if (!skipping.current) setPhase('darkening');
    }, delay);

    const t2 = setTimeout(() => {
      if (!skipping.current) setPhase('revealing');
    }, delay + darken);

    const t3 = setTimeout(() => {
      if (!completeCalled.current) {
        completeCalled.current = true;
        setPhase('done');
        onComplete();
      }
    }, delay + darken + reveal);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete, prefersReduced]);

  // Tap to skip — compressed two-phase exit
  const handleSkip = useCallback(() => {
    if (completeCalled.current || skipping.current) return;
    skipping.current = true;
    setPhase('darkening');
    setTimeout(() => setPhase('revealing'), SKIP_FADE);
    setTimeout(() => {
      if (!completeCalled.current) {
        completeCalled.current = true;
        setPhase('done');
        onComplete();
      }
    }, SKIP_FADE * 2);
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

  // Compute opacities from phase
  const contentOpacity = phase === 'active' ? 1 : 0;
  const contentTransition = skipping.current ? SKIP_FADE : DARKEN_DURATION;
  const containerOpacity = phase === 'revealing' || phase === 'done' ? 0 : 1;
  const containerTransition = skipping.current ? SKIP_FADE : REVEAL_DURATION;

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
        opacity: containerOpacity,
        transition: `opacity ${containerTransition}ms ease`,
        cursor: 'pointer',
      }}
    >
      {/* Canvas + text — fade independently during darkening phase */}
      <div
        style={{
          opacity: contentOpacity,
          transition: `opacity ${contentTransition}ms ease`,
        }}
      >
        {!prefersReduced && <WelcomeCanvas variant={variant} />}
      </div>

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
          opacity: contentOpacity,
          transition: `opacity ${contentTransition}ms ease`,
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
          className="text-white"
        >
          {message.split('').map((char, i) => (
            <span
              key={i}
              style={{
                opacity: i < charsVisible ? 1 : 0,
                transition: 'opacity 0.377s ease',
              }}
            >
              {char}
            </span>
          ))}
        </p>

        <p
          className="text-slate-400 text-xs font-light tracking-widest mt-6"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            opacity: 0,
            ...(profileName && charsVisible >= message.length
              ? { animation: 'fadeIn 1.597s ease-out forwards' }
              : {}),
            ...(!profileName ? { visibility: 'hidden' } : {}),
          }}
        >
          welcome back, {profileName || ''}
        </p>
      </div>
    </div>
  );
}
