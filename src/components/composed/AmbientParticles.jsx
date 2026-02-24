/**
 * AmbientParticles — 13 slow-drifting particles (prime count)
 * Touch/mouse: nearby particles drift away, return over 2584ms (fib-sacred)
 * Very subtle opacity (0.1-0.2), respects reduced motion
 */

'use client';

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks';

const PARTICLE_COUNT = 13; // prime
const PRIME_SPEEDS = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73]; // seconds per drift cycle

function seeded(i, offset = 0) {
  return ((i * 7 + offset * 13) % PARTICLE_COUNT) / PARTICLE_COUNT;
}

export default function AmbientParticles() {
  const prefersReduced = useReducedMotion();
  const [mousePos, setMousePos] = useState(null);
  const containerRef = useRef(null);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: seeded(i, 1) * 100,
      y: seeded(i, 2) * 100,
      size: (i % 3) + 1, // 1-3px
      opacity: 0.1 + seeded(i, 3) * 0.1, // 0.1-0.2
      speed: PRIME_SPEEDS[i],
      color: i % 3 === 0
        ? 'rgba(99,102,241,0.3)'  // indigo
        : i % 3 === 1
          ? 'rgba(139,92,246,0.3)' // violet
          : 'rgba(34,211,238,0.3)', // cyan
    }));
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, [prefersReduced]);

  // Clear mouse position when not hovering
  const handleMouseLeave = useCallback(() => setMousePos(null), []);

  if (prefersReduced) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-[1]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: 'none' }}
    >
      {particles.map((p) => {
        // Calculate push from mouse
        let pushX = 0;
        let pushY = 0;
        if (mousePos) {
          const dx = p.x - mousePos.x;
          const dy = p.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 15) {
            const force = (15 - dist) / 15;
            pushX = (dx / (dist || 1)) * force * 8;
            pushY = (dy / (dist || 1)) * force * 8;
          }
        }

        return (
          <div
            key={p.id}
            className="absolute rounded-full ambient-particle"
            style={{
              left: `${p.x + pushX}%`,
              top: `${p.y + pushY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              transition: mousePos ? 'left 377ms ease-out, top 377ms ease-out' : 'left 2584ms ease-out, top 2584ms ease-out',
            }}
          />
        );
      })}
    </div>
  );
}
