/**
 * MiniFocusCanvas
 * Sacred geometry shapes expanding from centre (tunnel preview).
 * Focus = cyan (741Hz solfeggio). 120x120 default, no interaction.
 */

'use client';

import React, { useEffect } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const TAU = Math.PI * 2;
const SHAPE_COUNT = 3;

function strokePolygon(ctx, cx, cy, r, sides, rot, alpha) {
  if (r < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * TAU;
    i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
            : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

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

    // Pre-computed shape configs (sides vary for visual interest)
    const shapes = [
      { sides: 5, rotOffset: 0 },
      { sides: 7, rotOffset: TAU / 3 },
      { sides: 3, rotOffset: (TAU * 2) / 3 },
    ];

    setRenderCallback(() => {
      ctx.clearRect(0, 0, size, size);
      t += 0.02;

      // Centre breathing dot
      const breathScale = 0.5 + 0.5 * Math.sin(t * 0.6);
      const dotRadius = 3 + breathScale * 3;
      ctx.beginPath();
      ctx.arc(cx, cy, dotRadius, 0, TAU);
      ctx.fillStyle = `rgba(34,211,238,${0.4 + breathScale * 0.4})`;
      ctx.fill();

      // Expanding sacred geometry shapes
      for (let i = 0; i < SHAPE_COUNT; i++) {
        const phase = (t * 0.4 + i * 2.1) % TAU;
        const progress = phase / TAU;
        const radius = 6 + progress * size * 0.4;
        const alpha = (1 - progress) * 0.45;
        const rotation = shapes[i].rotOffset + t * 0.15;
        strokePolygon(ctx, cx, cy, radius, shapes[i].sides, rotation, alpha);
      }

      // Subtle ambient ring
      const ambientAlpha = 0.04 + Math.sin(t * 0.3) * 0.02;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.45, 0, TAU);
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
