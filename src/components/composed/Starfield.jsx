/**
 * Starfield Background Component
 * Animated twinkling stars for the cosmic theme
 */

'use client';

import { useMemo } from 'react';

export default function Starfield({ count = 30 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${Math.random() * 2 + 2}s`,
      size: Math.random() > 0.7 ? 'w-1 h-1' : 'w-0.5 h-0.5', // Some bigger stars
      opacity: Math.random() * 0.5 + 0.2, // Brighter: 0.2-0.7 instead of 0.1-0.5
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
