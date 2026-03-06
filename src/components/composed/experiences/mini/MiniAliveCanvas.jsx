/**
 * MiniAliveCanvas
 * Organic bioluminescent form — breathing dot with radiating tendrils.
 * Alive = slate (396Hz solfeggio). 110x110 default, no interaction.
 */

'use client';

import React, { useEffect } from 'react';
import useCanvasVisibility from '@/hooks/useCanvasVisibility';

const TAU = Math.PI * 2;

function MiniAliveCanvas({ size = 110 }) {
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
      t += 0.01618;

      const breathScale = 0.5 + 0.5 * Math.sin(t * 0.618);

      // Soft radial glow from centre
      const glowR = 30 + breathScale * 8;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      grad.addColorStop(0, `rgba(148,163,184,${0.06 + breathScale * 0.04})`);
      grad.addColorStop(0.618, `rgba(148,163,184,${0.02 + breathScale * 0.01})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, TAU);
      ctx.fill();

      // 3 radiating tendrils with gentle wobble
      for (let i = 0; i < 3; i++) {
        const baseAngle = (i * TAU) / 3 + 0.3; // offset for visual interest
        const wobble = Math.sin(t * 0.8 + i * 2.094) * 0.15;
        const angle = baseAngle + wobble;
        const length = 26 + breathScale * 10;

        const endX = cx + Math.cos(angle) * length;
        const endY = cy + Math.sin(angle) * length;

        // Control point for organic curve
        const perpAngle = angle + Math.PI / 2;
        const cpOffset = Math.sin(t * 0.5 + i * 1.5) * 8;
        const midX = (cx + endX) / 2 + Math.cos(perpAngle) * cpOffset;
        const midY = (cy + endY) / 2 + Math.sin(perpAngle) * cpOffset;

        const alpha = 0.15 + breathScale * 0.15;

        // Halo stroke
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.strokeStyle = `rgba(148,163,184,${alpha * 0.4})`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Core stroke
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Tip glow
        const tipR = 2 + breathScale * 1.5;
        const tipGrad = ctx.createRadialGradient(endX, endY, 0, endX, endY, tipR);
        tipGrad.addColorStop(0, `rgba(148,163,184,${alpha * 0.6})`);
        tipGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(endX, endY, tipR, 0, TAU);
        ctx.fillStyle = tipGrad;
        ctx.fill();
      }

      // Centre breathing dot (larger than before)
      const dotR = 3 + breathScale * 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, TAU);
      ctx.fillStyle = `rgba(148,163,184,${0.4 + breathScale * 0.3})`;
      ctx.fill();

      // Dot halo
      const dotHaloR = dotR * 3;
      const dotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, dotHaloR);
      dotGrad.addColorStop(0, `rgba(148,163,184,${0.08 + breathScale * 0.06})`);
      dotGrad.addColorStop(0.618, `rgba(148,163,184,${0.02 + breathScale * 0.02})`);
      dotGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = dotGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, dotHaloR, 0, TAU);
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

export default React.memo(MiniAliveCanvas);
