/**
 * GroundingCanvas — full-screen sacred geometry mandala renderer
 *
 * Draws a single centred mandala that builds layer by layer as the user taps.
 * Receives a composition (with layers array) and revealedCount.
 * Each layer fades in smoothly. Very subtle breathing and rotation drift
 * give the mandala a living, organic quality.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';

export default function GroundingCanvas({ composition, revealedCount }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ composition, revealedCount });
  propsRef.current = { composition, revealedCount };
  const stateRef = useRef({ alphas: [], time: 0, rotation: 0 });

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) { rafRef.current = requestAnimationFrame(render); return; }
    const dpr = dprRef.current;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const { composition: comp, revealedCount: revealed } = propsRef.current;
    const s = stateRef.current;
    s.time += 16;
    s.rotation += 0.0002; // very slow drift (~0.7 deg/sec)

    ctx.clearRect(0, 0, W, H);

    if (!comp || !comp.layers) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    // Ensure alpha tracking for each revealed layer
    while (s.alphas.length < revealed) {
      s.alphas.push(0);
    }

    // Subtle breathing scale
    const breathe = 1 + Math.sin(s.time * 0.001) * 0.003;
    const currentScale = comp.scale * breathe;

    ctx.save();
    ctx.translate(comp.cx, comp.cy);
    ctx.rotate(s.rotation);

    // Draw each revealed layer
    for (let i = 0; i < revealed && i < comp.layers.length; i++) {
      const layer = comp.layers[i];
      const target = layer.targetAlpha || 0.65;
      s.alphas[i] = Math.min(target, s.alphas[i] + 0.018);
      layer.draw(ctx, 0, 0, currentScale, layer.color, s.alphas[i]);
    }

    // Enhanced centre glow when all 15 layers revealed
    if (revealed >= 15 && comp.layers.length >= 15) {
      const glowBreath = 1 + Math.sin(s.time * 0.003) * 0.15;
      const glowR = currentScale * 0.13 * glowBreath;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
      grad.addColorStop(0, 'rgba(241,245,249,0.07)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    rafRef.current = requestAnimationFrame(render);
  }, []);

  // Canvas resize with DPR scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const displayW = window.innerWidth;
      const displayH = window.innerHeight;
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Animation loop
  useEffect(() => {
    if (prefersReduced) return;
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
