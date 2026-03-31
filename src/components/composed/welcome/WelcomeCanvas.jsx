/**
 * WelcomeCanvas — renders a single welcome animation variant
 *
 * Standard MisoCalm canvas pattern: DPR-aware, RAF-driven, resize-safe.
 * Receives a variant object with init(W,H) and render(ctx,W,H,time,state).
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';

export default function WelcomeCanvas({ variant }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const timeRef = useRef(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) { rafRef.current = requestAnimationFrame(render); return; }
    const dpr = dprRef.current;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    if (W <= 0 || H <= 0) { rafRef.current = requestAnimationFrame(render); return; }

    timeRef.current++;
    ctx.clearRect(0, 0, W, H);
    variant.render(ctx, W, H, timeRef.current, stateRef.current);

    rafRef.current = requestAnimationFrame(render);
  }, [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      timeRef.current = 0;
      stateRef.current = variant.init(window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [variant, render]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    />
  );
}
