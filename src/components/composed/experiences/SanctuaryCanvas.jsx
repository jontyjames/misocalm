/**
 * SanctuaryCanvas — dot-based bioluminescent tree of life
 *
 * 377 glowing dots form a tree silhouette. Each breath reveals more dots.
 * Roots spread at the base, trunk rises through the center, canopy blooms
 * as a cloud of light. Fade trails create memory. Additive blending for glow.
 *
 * Sacred numbers: 377 dots (fib), MAX_DRIFT_SPARKLES=89 (fib),
 * fade trail alpha 0.03, breathing sine period ~4s.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import SparkBurst from './SparkBurst';
import { drawDot, DriftSparkle } from './SanctuaryShapes';
import { MAX_DRIFT_SPARKLES, generateTree, pickDotColor } from './SanctuaryShapeData';

const VOID_COLOR = 'rgba(3, 7, 18, 0.035)';

export default function SanctuaryCanvas({ breathCount, treePalette }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    dots: null,
    dotAges: null,
    dotColors: null,
    sparks: [],
    driftSparkles: [],
    time: 0,
    lastBreathCount: 0,
  });
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
    const s = stateRef.current;
    const props = propsRef.current;

    // Generate dots on first render
    if (!s.dots && W > 0 && H > 0) {
      s.dots = generateTree(W, H);
      s.dotAges = new Array(s.dots.length).fill(-1);
      s.dotColors = s.dots.map(d => pickDotColor(props.treePalette, d.zone));
    }

    s.time++;

    // Fade trail
    ctx.fillStyle = VOID_COLOR;
    ctx.fillRect(0, 0, W, H);

    // On new breath: reveal dots for this breath number + spark burst
    if (props.breathCount > s.lastBreathCount && s.dots) {
      for (let i = 0; i < s.dots.length; i++) {
        if (s.dotAges[i] === -1 && s.dots[i].breath <= props.breathCount) {
          s.dotAges[i] = 0;
        }
      }

      // Spark burst
      const palette = props.treePalette;
      const sparkColors = palette ? palette.slice(0, 5) : null;
      const bn = props.breathCount;
      const phase = bn <= 2 ? 'ROOT' : bn <= 4 ? 'TRUNK' : 'BRANCH';
      s.sparks.push(new SparkBurst(W, H, phase, sparkColors));

      s.lastBreathCount = props.breathCount;
    }

    // Drift sparkles after breath 5
    if (props.breathCount >= 5 && s.driftSparkles.length < MAX_DRIFT_SPARKLES) {
      if (Math.random() < 0.146) {
        s.driftSparkles.push(new DriftSparkle(W, H, props.treePalette));
      }
    }

    // Breathing animation
    const breathe = 0.82 + 0.18 * Math.sin(s.time * 0.012);

    // Draw dots with additive blending
    if (s.dots) {
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < s.dots.length; i++) {
        const age = s.dotAges[i];
        if (age < 0) continue;

        s.dotAges[i]++;
        const dot = s.dots[i];
        const color = s.dotColors[i];

        // Bloom in over ~45 frames
        const bloomT = Math.min(1, age / 45);
        const alpha = bloomT * breathe;

        drawDot(ctx, dot.x, dot.y, dot.size * bloomT, color, alpha);
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    // Drift sparkles
    for (let i = s.driftSparkles.length - 1; i >= 0; i--) {
      if (!s.driftSparkles[i].update()) { s.driftSparkles.splice(i, 1); continue; }
    }
    ctx.globalCompositeOperation = 'screen';
    for (const sparkle of s.driftSparkles) sparkle.draw(ctx);
    ctx.globalCompositeOperation = 'source-over';

    // Spark bursts
    for (let i = s.sparks.length - 1; i >= 0; i--) {
      if (!s.sparks[i].update()) { s.sparks.splice(i, 1); continue; }
    }
    if (s.sparks.length > 0) {
      ctx.globalCompositeOperation = 'screen';
      for (const burst of s.sparks) burst.draw(ctx);
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
      stateRef.current.dots = null;
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
