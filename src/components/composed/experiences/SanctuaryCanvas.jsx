/**
 * SanctuaryCanvas — full-screen breath-reactive bioluminescent tree renderer
 *
 * Builds a Tree of Life from breath. Shape types blend across breaths:
 * roots (1-3) → trunk (3-6) → branches (5-9) → leaves (7-11).
 * Ambient DriftSparkles float between breaths.
 *
 * Double-stroke glow on all shapes. Sparks via SparkBurst (additive).
 * Sacred numbers: MAX_SHAPES=127 (Mersenne prime), MAX_DRIFT_SPARKLES=89 (fib),
 * DPR capped at 2, spawn probability 0.146 (1/phi⁴).
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import SparkBurst from './SparkBurst';
import { createTreeShape, DriftSparkle } from './SanctuaryShapes';
import { MAX_SHAPES, MAX_DRIFT_SPARKLES, pickShapeType } from './SanctuaryShapeData';

export default function SanctuaryCanvas({ breathCount, treePalette }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ shapes: [], sparks: [], driftSparkles: [], time: 0, lastBreathCount: 0 });
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ breathCount, treePalette });
  propsRef.current = { breathCount, treePalette };

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
    ctx.clearRect(0, 0, W, H);

    // Spawn shapes on each new breath
    if (props.breathCount > s.lastBreathCount) {
      const diff = props.breathCount - s.lastBreathCount;
      const palette = props.treePalette;
      for (let i = 0; i < diff; i++) {
        const breathNum = s.lastBreathCount + i + 1;
        const amp = 0.382 + Math.random() * 0.618;
        // 3 shapes per breath (prime) — primary, phi, phi-complement amplitudes
        const ampScales = [1, 0.618, 0.382];
        for (let j = 0; j < 3; j++) {
          const shapeType = pickShapeType(breathNum);
          s.shapes.push(createTreeShape(shapeType, cx, cy, W, H, amp * ampScales[j], palette));
        }
        // Bioluminescent sparks — full palette
        const sparkColors = palette ? palette.slice(0, 5) : null;
        const sparkZone = pickShapeType(breathNum);
        s.sparks.push(new SparkBurst(W, H, sparkZone, sparkColors));
      }
      s.lastBreathCount = props.breathCount;
    }

    // Ambient drift sparkles — spawn when breathing has started
    if (props.breathCount > 0 && s.driftSparkles.length < MAX_DRIFT_SPARKLES) {
      if (Math.random() < 0.146) {
        s.driftSparkles.push(new DriftSparkle(W, H, props.treePalette));
      }
    }

    // Update shapes — persist forever, cap enforces limit
    for (const shape of s.shapes) { shape.update(); }
    while (s.shapes.length > MAX_SHAPES) { s.shapes.shift(); }

    // Draw shapes (tree layer)
    for (const shape of s.shapes) {
      shape.draw(ctx, s.time);
    }

    // Update and draw drift sparkles
    for (let i = s.driftSparkles.length - 1; i >= 0; i--) {
      if (!s.driftSparkles[i].update()) { s.driftSparkles.splice(i, 1); continue; }
    }
    for (const sparkle of s.driftSparkles) {
      sparkle.draw(ctx);
    }

    // Update and draw spark bursts (additive glow)
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
