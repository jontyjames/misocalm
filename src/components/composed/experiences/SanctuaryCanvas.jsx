/**
 * SanctuaryCanvas — full-screen breath-reactive sacred geometry renderer
 *
 * Builds a sanctuary landscape from breath. Three visual layers:
 * - Foundation: curved arcs at the base (bottom third)
 * - Rising: vertical pillars and lines (middle)
 * - Canopy: overhead dome arcs and radial geometry (top)
 *
 * Colour: solfeggio palette from Tree of Life random positions.
 * Breath amplitude controls geometry size, brightness, and complexity.
 * Shapes persist — what you build stays. Capped at 127 (Mersenne prime).
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import SparkBurst from './SparkBurst';
import { createShape, MAX_SHAPES, PHASE_COLOUR_COUNT } from './SanctuaryShapes';

export default function SanctuaryCanvas({ breathCount, breathPhase, treePalette }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ shapes: [], sparks: [], time: 0, lastBreathCount: 0 });
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ breathCount, breathPhase, treePalette });
  propsRef.current = { breathCount, breathPhase, treePalette };

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) { rafRef.current = requestAnimationFrame(render); return; }
    const dpr = dprRef.current;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const cx = W / 2;
    const cy = H / 2;
    const s = stateRef.current;
    const props = propsRef.current;

    s.time++;

    // Clear each frame — shapes manage their own persistence via alpha floor
    ctx.clearRect(0, 0, W, H);

    // Spawn shapes + sparks on each new breath
    if (props.breathCount > s.lastBreathCount) {
      const diff = props.breathCount - s.lastBreathCount;
      const phase = props.breathPhase || 'FOUNDATION';
      const palette = props.treePalette;
      for (let i = 0; i < diff; i++) {
        const amp = 0.3 + Math.random() * 0.7;
        s.shapes.push(createShape(phase, cx, cy, W, H, amp, palette));
        // Add 2 companion shapes for richness (3 total per breath, prime)
        s.shapes.push(createShape(phase, cx, cy, W, H, amp * 0.618, palette));
        s.shapes.push(createShape(phase, cx, cy, W, H, amp * 0.382, palette));
        // Bioluminescent sparks — phase-available colours
        const sparkPhase = phase === 'FREE_PLAY'
          ? ['FOUNDATION', 'RISING', 'CANOPY'][Math.floor(Math.random() * 3)]
          : phase;
        const count = phase === 'FREE_PLAY' ? 5 : (PHASE_COLOUR_COUNT[sparkPhase] || 5);
        const sparkColors = palette ? palette.slice(0, count) : null;
        s.sparks.push(new SparkBurst(W, H, sparkPhase, sparkColors));
      }
      s.lastBreathCount = props.breathCount;
    }

    // Update shapes — they never self-remove, cap enforces limit
    for (const shape of s.shapes) { shape.update(); }
    while (s.shapes.length > MAX_SHAPES) { s.shapes.shift(); }

    // Draw shapes
    for (const shape of s.shapes) {
      shape.draw(ctx, s.time);
    }

    // Update and draw sparks (additive glow)
    for (let i = s.sparks.length - 1; i >= 0; i--) {
      if (!s.sparks[i].update()) { s.sparks.splice(i, 1); continue; }
    }
    if (s.sparks.length > 0) {
      ctx.globalCompositeOperation = 'screen';
      for (const burst of s.sparks) {
        burst.draw(ctx);
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    rafRef.current = requestAnimationFrame(render);
  }, []);

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
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    rafRef.current = requestAnimationFrame(render);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [render, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    />
  );
}
