/**
 * MiniPulseCanvas
 * Expanding concentric rings + center breathing dot.
 * 120x120 default, accepts size prop. Pre-seeded, no interaction.
 */

'use client';

import React, { useEffect } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const RING_COUNT = 3;
const TWO_PI = Math.PI * 2;

function MiniPulseCanvas({ size = 120 }) {
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
    let t = 0;

    setRenderCallback(() => {
      ctx.clearRect(0, 0, size, size);
      t += 0.02;

      // Center breathing dot
      const breathScale = 0.5 + 0.5 * Math.sin(t * 0.8);
      const dotRadius = 4 + breathScale * 4;
      ctx.beginPath();
      ctx.arc(cx, cy, dotRadius, 0, TWO_PI);
      ctx.fillStyle = `rgba(99,102,241,${0.4 + breathScale * 0.4})`;
      ctx.fill();

      // Concentric rings expanding outward
      for (let i = 0; i < RING_COUNT; i++) {
        const phase = (t + i * 2.1) % 6.28;
        const progress = phase / 6.28;
        const radius = progress * size * 0.45;
        const alpha = (1 - progress) * 0.65;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, TWO_PI);
        ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [canvasRef, setRenderCallback, prefersReduced, size]);

  if (prefersReduced) {
    return (
      <div
        ref={containerRef}
        style={{ width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
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

export default React.memo(MiniPulseCanvas);
