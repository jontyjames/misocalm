/**
 * MiniSanctuaryCanvas
 * Stylized sanctuary horizon with arcs and rising lines.
 * Sanctuary = slate (396Hz solfeggio). 110x110 default, no interaction.
 */

'use client';

import React, { useEffect } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const TAU = Math.PI * 2;

function MiniSanctuaryCanvas({ size = 110 }) {
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
    let t = 0;

    setRenderCallback(() => {
      ctx.clearRect(0, 0, size, size);
      t += 0.01618;

      const breathScale = 0.5 + 0.5 * Math.sin(t * 0.618);

      // Foundation arcs (bottom)
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.382 + i * 2.094) % TAU;
        const progress = phase / TAU;
        const arcY = size * 0.75;
        const arcX = cx + (i - 1) * size * 0.236;
        const r = 16 + progress * 10;
        const alpha = (1 - progress) * 0.3;
        ctx.beginPath();
        ctx.arc(arcX, arcY, r, Math.PI, TAU);
        ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Rising pillars (middle)
      for (let i = 0; i < 3; i++) {
        const x = cx + (i - 1) * size * 0.236;
        const topY = size * (0.3 + breathScale * 0.05);
        const botY = size * 0.72;
        const alpha = 0.15 + breathScale * 0.1;
        ctx.beginPath();
        ctx.moveTo(x, botY);
        ctx.lineTo(x, topY);
        ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Canopy arc (top)
      const canopyAlpha = 0.1 + breathScale * 0.15;
      const canopyR = size * 0.35 + breathScale * 5;
      ctx.beginPath();
      ctx.arc(cx, size * 0.25, canopyR, 0.2, Math.PI - 0.2);
      ctx.strokeStyle = `rgba(148,163,184,${canopyAlpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Centre breathing dot (hearth)
      const dotR = 2 + breathScale * 2;
      ctx.beginPath();
      ctx.arc(cx, size * 0.75, dotR, 0, TAU);
      ctx.fillStyle = `rgba(148,163,184,${0.3 + breathScale * 0.3})`;
      ctx.fill();

      // Ambient glow
      const grad = ctx.createRadialGradient(cx, size * 0.75, 0, cx, size * 0.75, 26);
      grad.addColorStop(0, `rgba(148,163,184,${0.04 + breathScale * 0.03})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, size * 0.75, 26, 0, TAU);
      ctx.fill();
    });
  }, [canvasRef, setRenderCallback, prefersReduced, size]);

  if (prefersReduced) {
    return (
      <div
        ref={containerRef}
        style={{ width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle, rgba(148,163,184,0.2) 0%, transparent 70%)' }}
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

export default React.memo(MiniSanctuaryCanvas);
