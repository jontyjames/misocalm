/**
 * MiniGroundingCanvas
 * Seed-of-life circles with gentle rotation drift.
 * 120x120 default, accepts size prop. Pre-seeded, no interaction.
 */

'use client';

import React, { useEffect } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const PETALS = 6;
const TWO_PI = Math.PI * 2;

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
    const petalRadius = size * 0.2;
    let angle = 0;

    setRenderCallback(() => {
      ctx.clearRect(0, 0, size, size);
      angle += 0.005;

      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, petalRadius, 0, TWO_PI);
      ctx.strokeStyle = 'rgba(34,211,238,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Petal circles
      for (let i = 0; i < PETALS; i++) {
        const theta = angle + (i / PETALS) * TWO_PI;
        const px = cx + Math.cos(theta) * petalRadius;
        const py = cy + Math.sin(theta) * petalRadius;
        ctx.beginPath();
        ctx.arc(px, py, petalRadius, 0, TWO_PI);
        ctx.strokeStyle = `rgba(34,211,238,${0.15 + (i % 2) * 0.1})`;
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
