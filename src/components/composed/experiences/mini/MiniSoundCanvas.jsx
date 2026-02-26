/**
 * MiniSoundCanvas (Impermanence)
 * Drifting ink particles radiating from center.
 * 120x120 default, accepts size prop. Pre-seeded, no interaction.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const PARTICLE_COUNT = 13; // prime
const TWO_PI = Math.PI * 2;

function createParticles(count, size) {
  const cx = size / 2;
  const cy = size / 2;
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * TWO_PI,
    speed: 0.2 + Math.random() * 0.3,
    dist: Math.random() * size * 0.15,
    maxDist: size * 0.4,
    alpha: 0.55 + Math.random() * 0.35,
    radius: 2 + Math.random() * 1.5,
    cx,
    cy,
  }));
}

function MiniSoundCanvas({ size = 120 }) {
  const { containerRef, canvasRef, setRenderCallback, prefersReduced } = useCanvasVisibility();
  const particlesRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReduced) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    if (!particlesRef.current) {
      particlesRef.current = createParticles(PARTICLE_COUNT, size);
    }

    setRenderCallback(() => {
      ctx.clearRect(0, 0, size, size);
      const particles = particlesRef.current;

      for (const p of particles) {
        p.dist += p.speed;
        if (p.dist > p.maxDist) {
          p.dist = 0;
          p.angle += 0.3;
        }

        const progress = p.dist / p.maxDist;
        const x = p.cx + Math.cos(p.angle) * p.dist;
        const y = p.cy + Math.sin(p.angle) * p.dist;
        const alpha = p.alpha * (1 - progress);

        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, TWO_PI);
        ctx.fillStyle = `rgba(139,92,246,${alpha})`;
        ctx.fill();
      }
    });
  }, [canvasRef, setRenderCallback, prefersReduced, size]);

  if (prefersReduced) {
    return (
      <div
        ref={containerRef}
        style={{ width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div ref={containerRef} style={{ width: size, height: size }} aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
    </div>
  );
}

export default React.memo(MiniSoundCanvas);
