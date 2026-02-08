/**
 * Starfield Background Component
 * Animated twinkling stars for the cosmic theme
 */

'use client';

import { useMemo } from 'react';

// Prime-based durations so stars never blink in unison
const PRIME_DURATIONS = [2.3, 3.7, 5.3, 7.1, 11.3, 13.7];

// 6 anchor stars at hexagonal sacred positions (Seed of Life projected onto the sky)
const ANCHOR_POSITIONS = Array.from({ length: 6 }, (_, i) => {
  const angle = (i * 60) * (Math.PI / 180);
  return {
    left: `${50 + 23 * Math.cos(angle)}%`,
    top: `${50 + 23 * Math.sin(angle)}%`,
  };
});

export default function Starfield({ count = 37 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${PRIME_DURATIONS[i % PRIME_DURATIONS.length]}s`,
      size: Math.random() > 0.7 ? 'w-1 h-1' : 'w-0.5 h-0.5',
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute ${star.size} bg-white rounded-full star`}
          style={{
            left: star.left,
            top: star.top,
            '--delay': star.delay,
            '--duration': star.duration,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Hexagonal anchor stars — Seed of Life projected onto the cosmos */}
      {ANCHOR_POSITIONS.map((pos, i) => (
        <div
          key={`anchor-${i}`}
          className="absolute w-1 h-1 rounded-full star"
          style={{
            left: pos.left,
            top: pos.top,
            background: 'radial-gradient(circle, rgba(139,92,246,0.9) 0%, rgba(99,102,241,0.4) 60%, transparent 100%)',
            opacity: 0.55,
            animationDelay: `${PRIME_DURATIONS[i % PRIME_DURATIONS.length] * 0.5}s`,
            animationDuration: `${PRIME_DURATIONS[(i + 3) % PRIME_DURATIONS.length]}s`,
            boxShadow: '0 0 3px rgba(139,92,246,0.3)',
          }}
        />
      ))}

      {/* Nebula glow effects */}
      <div
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.12) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)',
        }}
      />
    </div>
  );
}
