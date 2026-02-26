/**
 * MiniFocusCanvas
 * Expanding concentric rings (tunnel preview) + center breathing dot.
 * Focus = cyan (741Hz solfeggio). 120x120 default, no interaction.
 */

'use client';

import React, { useEffect } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const RING_COUNT = 3; // Tesla's 3
const TWO_PI = Math.PI * 2;

function MiniFocusCanvas({ size = 120 }) {
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

      // Centre breathing dot
      const breathScale = 0.5 + 0.5 * Math.sin(t * 0.6);
      const dotRadius = 3 + breathScale * 3;
      ctx.beginPath();
      ctx.arc(cx, cy, dotRadius, 0, TWO_PI);
      ctx.fillStyle = `rgba(34,211,238,${0.4 + breathScale * 0.4})`;
      ctx.fill();

      // Concentric expanding rings (tunnel effect)
      for (let i = 0; i < RING_COUNT; i++) {
        const phase = (t * 0.5 + i * 2.1) % 6.28;
        const progress = phase / 6.28;
        const radius = 6 + progress * size * 0.42;
        const alpha = (1 - progress) * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, TWO_PI);
        ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Subtle outer ambient ring
      const ambientAlpha = 0.04 + Math.sin(t * 0.3) * 0.02;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.45, 0, TWO_PI);
      ctx.strokeStyle = `rgba(34,211,238,${ambientAlpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
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

export default React.memo(MiniFocusCanvas);
