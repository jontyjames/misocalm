/**
 * FocusCanvas — sacred portal tunnel with spatial flashes and inscriptions
 *
 * Thin React shell: DPR-aware canvas + RAF loop.
 * All rendering delegated to src/lib/focusTunnelRenderer.js (pure utility, no React).
 * Ring-based tunnel with colour depth zones, sacred inscriptions, and spatial flash capture.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import { createTunnelState, renderTunnel } from '@/lib/focusTunnelRenderer';

export default function FocusCanvas({
  flashVisible, flashPosition, flashCaptured,
  totalCaptured, phase, complete, playTouch,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();

  const propsRef = useRef({
    flashVisible, flashPosition, flashCaptured,
    totalCaptured, phase, complete, playTouch,
  });
  propsRef.current = {
    flashVisible, flashPosition, flashCaptured,
    totalCaptured, phase, complete, playTouch,
  };

  const stateRef = useRef(createTunnelState());

  // Empty deps: safe — all external state read via propsRef/stateRef (mutable refs)
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = dprRef.current;
    const W = canvas.width / dpr, H = canvas.height / dpr;

    renderTunnel(ctx, W, H, stateRef.current, propsRef.current);

    rafRef.current = requestAnimationFrame(render);
  }, []);

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const dW = window.innerWidth, dH = window.innerHeight;
      canvas.width = dW * dpr;
      canvas.height = dH * dpr;
      canvas.style.width = `${dW}px`;
      canvas.style.height = `${dH}px`;
      canvas.getContext('2d').scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Animation loop
  useEffect(() => {
    if (prefersReduced) return;
    stateRef.current.lastAutoSpawn = Date.now();
    rafRef.current = requestAnimationFrame(render);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [render, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
