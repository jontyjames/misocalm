/**
 * TerminalStars
 * 13 faint stars (prime count) on void-black background.
 * Simple CSS dots — lightweight alternative to full Starfield.
 */

'use client';

import { useMemo } from 'react';

const STAR_COUNT = 13; // prime

// Seeded positions so they don't jump on re-render
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  left: `${((i * 7.69 + 13) % 100).toFixed(1)}%`,
  top: `${((i * 11.3 + 7) % 100).toFixed(1)}%`,
  size: i % 3 === 0 ? 2 : 1,
  duration: `${[5.3, 7.1, 3.7, 11.3, 13.7][i % 5]}s`,
  delay: `${(i * 0.89).toFixed(2)}s`,
}));

export default function TerminalStars() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background: 'rgba(255,255,255,0.4)',
            '--duration': star.duration,
            '--delay': star.delay,
          }}
        />
      ))}
    </div>
  );
}
