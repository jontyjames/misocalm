/**
 * MiniMandalaCanvas
 * Rotating 5-fold symmetric dots in indigo/violet/cyan.
 * 120x120 default, accepts size prop. Pre-seeded, no interaction.
 */

'use client';

import React, { useEffect } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const COLORS = [
  'rgba(99,102,241,0.7)',   // indigo
  'rgba(139,92,246,0.6)',   // violet
  'rgba(34,211,238,0.5)',   // cyan
];
const FOLDS = 5;
const RINGS = 3;
const TWO_PI = Math.PI * 2;

function MiniMandalaCanvas({ size = 120 }) {
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
    let angle = 0;

    setRenderCallback(() => {
      ctx.clearRect(0, 0, size, size);
      angle += 0.008;

      for (let ring = 1; ring <= RINGS; ring++) {
        const radius = (ring / RINGS) * (size * 0.38);
        const color = COLORS[ring - 1];
        const dotSize = 2 + ring * 0.5;

        for (let f = 0; f < FOLDS; f++) {
          const theta = angle + (f / FOLDS) * TWO_PI;
          const x = cx + Math.cos(theta) * radius;
          const y = cy + Math.sin(theta) * radius;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, TWO_PI);
          ctx.fillStyle = color;
          ctx.fill();
        }
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

export default React.memo(MiniMandalaCanvas);
