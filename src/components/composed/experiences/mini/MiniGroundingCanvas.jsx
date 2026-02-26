/**
 * MiniGroundingCanvas
 * Seed-of-life with breathing petals, individual shimmer phases, and an outer halo ring.
 * Grounding = cyan (741Hz solfeggio). Calm presence, not static diagram.
 * 120x120 default, accepts size prop. Pre-seeded, no interaction.
 */

'use client';

import React, { useEffect } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const PETALS = 6;
const TWO_PI = Math.PI * 2;
// Prime outer ring count keeps outer layer distinct from inner 6
const OUTER_PETALS = 6;

function MiniGroundingCanvas({ size = 120 }) {
  const { containerRef, canvasRef, setRenderCallback, prefersReduced } = useCanvasVisibility();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReduced) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;
    // Base orbit radius — petals positioned at this distance from center
    const orbitR = size * 0.2;
    let angle = 0;
    // t drives all oscillations. 0.034 = fib-micro stagger, gives ~17s breath cycle at 11fps
    let t = 0;

    setRenderCallback(() => {
      ctx.clearRect(0, 0, size, size);
      // 0.008 matches MiniMandala — just perceptibly slow at 11fps (~71s full rotation)
      angle += 0.008;
      // 0.034 per frame at ~11fps → ~0.37 rad/s → full Math.sin cycle ~17s
      t += 0.034;

      // --- Center circle: breathes between 17px and 23px radius ---
      const centerBreath = 0.5 + 0.5 * Math.sin(t * 0.5);
      const centerR = size * 0.17 + centerBreath * size * 0.06;
      const centerAlpha = 0.18 + centerBreath * 0.14;
      ctx.beginPath();
      ctx.arc(cx, cy, centerR, 0, TWO_PI);
      ctx.strokeStyle = `rgba(34,211,238,${centerAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- Inner seed petals: each has its own breath phase ---
      for (let i = 0; i < PETALS; i++) {
        const theta = angle + (i / PETALS) * TWO_PI;
        const px = cx + Math.cos(theta) * orbitR;
        const py = cy + Math.sin(theta) * orbitR;
        // Phase offset spreads the 6 petals across a full breath cycle
        const phase = t * 0.5 + (i / PETALS) * TWO_PI;
        const breath = 0.5 + 0.5 * Math.sin(phase);
        const petalR = size * 0.17 + breath * size * 0.04;
        const alpha = 0.12 + breath * 0.16;
        ctx.beginPath();
        ctx.arc(px, py, petalR, 0, TWO_PI);
        ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // --- Outer halo ring: same 6-fold, at 2.1x orbit distance, smaller and fainter ---
      // Rotates at half speed (counter-feel) giving depth without busy-ness
      const outerAngle = -angle * 0.5;
      const outerOrbitR = orbitR * 2.1;
      const outerCircleR = size * 0.13;
      for (let i = 0; i < OUTER_PETALS; i++) {
        const theta = outerAngle + (i / OUTER_PETALS) * TWO_PI;
        // Keep outer petals within canvas — outerOrbitR max ~25px, outerCircleR ~16px, sum ~41px < 60px (half of 120)
        const px = cx + Math.cos(theta) * outerOrbitR;
        const py = cy + Math.sin(theta) * outerOrbitR;
        // Outer layer shimmers on a slower, offset cycle
        const phase = t * 0.3 + (i / OUTER_PETALS) * TWO_PI;
        const shimmer = 0.5 + 0.5 * Math.sin(phase);
        const alpha = 0.06 + shimmer * 0.09;
        ctx.beginPath();
        ctx.arc(px, py, outerCircleR, 0, TWO_PI);
        ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }, [canvasRef, setRenderCallback, prefersReduced, size]);

  if (prefersReduced) {
    return (
      <div
        ref={containerRef}
        style={{ width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)' }}
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

export default React.memo(MiniGroundingCanvas);
