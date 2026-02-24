/**
 * StarDissolve — completion celebration
 * 37 star points burst upward from element position
 * Duration: 987ms (fib-breathe), final 377ms fade
 */

'use client';

import { useMemo } from 'react';
import { useReducedMotion } from '@/hooks';

// Pseudo-random deterministic values using index
function seededValue(i, offset = 0) {
  return ((i * 7 + offset * 13) % 37) / 37;
}

export default function StarDissolve({ active = false, color = 'cyan' }) {
  const prefersReduced = useReducedMotion();

  const stars = useMemo(() => {
    return Array.from({ length: 37 }, (_, i) => {
      const dx = (seededValue(i, 1) - 0.5) * 120; // spread: -60px to 60px
      const dy = -(seededValue(i, 2) * 80 + 30); // upward: -30 to -110px
      const size = (i % 3) + 1; // 1px, 2px, or 3px (prime range)
      const delay = seededValue(i, 3) * 233; // stagger over 233ms

      return { id: i, dx, dy, size, delay };
    });
  }, []);

  if (!active || prefersReduced) return null;

  const colors = {
    cyan: '#22d3ee',
    indigo: '#818cf8',
    violet: '#a78bfa',
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute star-dissolve-point"
          style={{
            left: '50%',
            top: '50%',
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            backgroundColor: colors[color] || colors.cyan,
            boxShadow: `0 0 ${star.size * 2}px ${colors[color] || colors.cyan}`,
            '--dx': `${star.dx}px`,
            '--dy': `${star.dy}px`,
            animation: `starBurst 987ms ease-out ${star.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}
