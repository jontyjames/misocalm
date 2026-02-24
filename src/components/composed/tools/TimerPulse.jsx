/**
 * TimerPulse - Ambient radial glow wrapper around the timer circle.
 * Layered breathing glow at prime-based durations so layers never sync.
 * Phase-coloured: indigo (528Hz practice), cyan (741Hz reminder), violet (852Hz between).
 * Phi-scale insets: 68px, 42px, 26px, 16px from PHI_SCALE.
 */

'use client';

import { useReducedMotion } from '@/hooks';
import { FIBONACCI_TIMING, PRIME_DURATIONS, PHI_SCALE } from '@/lib/constants';
import { PHASE_COLOURS } from '@/lib/timerConstants';

export default function TimerPulse({ phase, children }) {
  const prefersReduced = useReducedMotion();
  const color = PHASE_COLOURS[phase] || PHASE_COLOURS.idle;
  const isActive = phase !== 'idle' && phase !== 'complete';
  const t = `${FIBONACCI_TIMING.ease}ms`;

  return (
    <div className="relative flex items-center justify-center">
      {/* Layer 1: outermost halo - slowest prime rhythm (7.1s) */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: `-${PHI_SCALE[5]}px`,
          background: `radial-gradient(circle, rgba(${color},${isActive ? 0.1 : 0.04}) 0%, rgba(${color},0.02) 50%, transparent 70%)`,
          animation: isActive && !prefersReduced
            ? `timerPulse ${PRIME_DURATIONS[3]}s ease-in-out infinite`
            : 'none',
          transition: `background ${t} ease-in-out`,
        }}
      />

      {/* Layer 2: outer glow ring - mid prime rhythm (5.3s) */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: `-${PHI_SCALE[4]}px`,
          background: `radial-gradient(circle, rgba(${color},${isActive ? 0.18 : 0.08}) 0%, rgba(${color},0.06) 40%, transparent 70%)`,
          animation: isActive && !prefersReduced
            ? `timerPulse ${PRIME_DURATIONS[2]}s ease-in-out infinite`
            : 'none',
          transition: `background ${t} ease-in-out`,
        }}
      />

      {/* Layer 3: inner glow - faster prime rhythm (3.7s), reversed for organic counter-pulse */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: `-${PHI_SCALE[3]}px`,
          background: `radial-gradient(circle, rgba(${color},${isActive ? 0.12 : 0.05}) 0%, transparent 60%)`,
          animation: isActive && !prefersReduced
            ? `timerPulse ${PRIME_DURATIONS[1]}s ease-in-out infinite reverse`
            : 'none',
          transition: `background ${t} ease-in-out`,
        }}
      />

      {/* Layer 4: tight colour wash + box-shadow glow - 5.3s prime */}
      {isActive && !prefersReduced && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: `-${PHI_SCALE[2]}px`,
            boxShadow: `0 0 ${PHI_SCALE[4]}px rgba(${color},0.2), 0 0 ${PHI_SCALE[6]}px rgba(${color},0.08)`,
            animation: `timerPulse ${PRIME_DURATIONS[2]}s ease-in-out infinite`,
          }}
        />
      )}

      {children}
    </div>
  );
}
