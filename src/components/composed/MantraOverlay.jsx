/**
 * MantraOverlay - Sacred geometry behind mantra text.
 * Each reveal randomises: pattern (7), colour (7), animation (2).
 * 23 mantras x 7 patterns x 7 colours x 2 animations = 2,254 unique moments.
 *
 * Timing: overlay fades in at 377ms (fib-flow),
 *         pattern fades in at 610ms (fib-ease).
 * All durations are Fibonacci or prime.
 */

'use client';

import { useMemo, useEffect, useCallback } from 'react';
import { SACRED_PATTERNS } from '@/lib/sacredPatterns';

/* ─── Solfeggio Colour Palette (7, prime) ───────────────────────── */
const SOLFEGGIO_COLORS = [
  { name: 'Indigo',     rgb: '99,102,241',  hz: 528 },  // healing
  { name: 'Violet',     rgb: '139,92,246',   hz: 852 },  // intuition
  { name: 'Cyan',       rgb: '34,211,238',   hz: 741 },  // expression
  { name: 'Rose',       rgb: '244,114,182',  hz: 639 },  // connection
  { name: 'Amber',      rgb: '251,191,36',   hz: 417 },  // releasing
  { name: 'Emerald',    rgb: '52,211,153',   hz: 396 },  // grounding
  { name: 'Soft White', rgb: '226,232,240',  hz: 963 },  // oneness
];

/* ─── Animation Variants (2, prime) ───────────────────────────── */
const ANIMATIONS = [
  'sacredRotate 23s linear infinite',    // prime duration, eternal
  'sacredPulse 13s ease-in-out infinite', // prime duration, gentle
];

export default function MantraOverlay({ mantra, visible, onClose }) {
  /* Dismiss on ESC key */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!visible) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleKeyDown]);

  /* Pick random pattern, colour, and animation each time visible flips to true */
  const { pattern, color, animation } = useMemo(() => {
    if (!visible) return { pattern: 0, color: 0, animation: 0 };
    return {
      pattern: Math.floor(Math.random() * SACRED_PATTERNS.length),
      color: Math.floor(Math.random() * SOLFEGGIO_COLORS.length),
      animation: Math.floor(Math.random() * ANIMATIONS.length),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const { Component: PatternSvg } = SACRED_PATTERNS[pattern];
  const { rgb } = SOLFEGGIO_COLORS[color];
  const patternColor = `rgba(${rgb}, 0.18)`;
  const glowColor = `rgba(${rgb}, 0.35)`;
  const glowColorSoft = `rgba(${rgb}, 0.12)`;
  const radialColor = `rgba(${rgb}, 0.06)`;

  return (
    <div
      role="dialog"
      aria-label="Mantra"
      className="fixed inset-0 z-[60] flex items-center justify-center px-8"
      onClick={onClose}
      style={{
        background: 'rgba(3,7,18,0.85)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 377ms ease-out',
      }}
    >
      {/* Subtle radial glow behind everything */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${radialColor} 0%, transparent 60%)`,
        }}
      />

      {/* Sacred geometric pattern - centred, behind text */}
      <div
        className="mantra-pattern absolute pointer-events-none flex items-center justify-center"
        style={{
          width: 340,
          height: 340,
          opacity: 0,
          animation: `sacredPatternIn 610ms ease-out 233ms forwards, ${ANIMATIONS[animation]}`,
        }}
      >
        <PatternSvg color={patternColor} />
      </div>

      {/* Mantra text - the star */}
      <p
        className="relative z-10 text-xl text-white/90 text-center leading-relaxed max-w-md"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColorSoft}`,
        }}
      >
        {mantra}
      </p>
    </div>
  );
}
