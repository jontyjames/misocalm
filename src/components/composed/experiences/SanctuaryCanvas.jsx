/**
 * SanctuaryCanvas — Living Light bioluminescent organism
 *
 * Seed dot at center breathes. Tendrils grow outward with wobbling bezier
 * curves. Rings pulse on each breath. Everything breathes together.
 * Tendrils persist and accumulate — by breath 11, the screen is alive.
 *
 * Render order: fade trail → tendrils → rings → drift sparkles →
 * spark bursts → seed dot (always on top).
 *
 * Sacred numbers: 71 tendrils (prime), fade 0.025, breathe period ~0.008,
 * MAX_DRIFT_SPARKLES 89 (fib).
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import SparkBurst from './SparkBurst';
import { Tendril, BreathRing, DriftSparkle } from './SanctuaryShapes';
import {
  MAX_DRIFT_SPARKLES, SECTOR_COUNT,
  spawnTendrils, pickRingColor, drawSeedDot,
} from './SanctuaryShapeData';

const VOID_COLOR = 'rgba(3, 7, 18, 0.025)';

export default function SanctuaryCanvas({ breathCount, treePalette }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    tendrils: [],
    rings: [],
    sparks: [],
    driftSparkles: [],
    sectorCounts: new Array(SECTOR_COUNT).fill(0),
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
    if (W <= 0 || H <= 0) { rafRef.current = requestAnimationFrame(render); return; }

    const s = stateRef.current;
    const props = propsRef.current;
    const cx = W / 2;
    const cy = H / 2;
    s.time++;

    // 1. Fade trail — tendrils persist strongly, rings ghost away
    ctx.fillStyle = VOID_COLOR;
    ctx.fillRect(0, 0, W, H);

    // 2. Breathing scale — global sine modulates all alphas
    const breatheScale = 0.82 + 0.18 * Math.sin(s.time * 0.008);

    // 3. On new breath: spawn tendrils + ring + SparkBurst
    if (props.breathCount > s.lastBreathCount) {
      const palette = props.treePalette;

      // Catch up all missed breaths (handles resize recovery)
      for (let b = s.lastBreathCount + 1; b <= props.breathCount; b++) {
        const configs = spawnTendrils(
          b, cx, cy, W, H, palette, s.sectorCounts,
        );
        for (const cfg of configs) s.tendrils.push(new Tendril(cfg));

        const ringColor = pickRingColor(b, palette);
        s.rings.push(new BreathRing(cx, cy, ringColor));
      }

      // SparkBurst for current breath only
      const sparkColors = palette ? palette.slice(0, 5) : null;
      const bn = props.breathCount;
      const phase = bn <= 3 ? 'FOUNDATION' : bn <= 7 ? 'RISING' : 'CANOPY';
      s.sparks.push(new SparkBurst(W, H, phase, sparkColors));

      s.lastBreathCount = props.breathCount;
    }

    // 4. Drift sparkles after breath 5
    if (props.breathCount >= 5 && s.driftSparkles.length < MAX_DRIFT_SPARKLES) {
      if (Math.random() < 0.146) {
        s.driftSparkles.push(new DriftSparkle(W, H, props.treePalette));
      }
    }

    // 5. Update & draw tendrils (screen blend)
    ctx.globalCompositeOperation = 'screen';
    for (const tendril of s.tendrils) {
      tendril.update(s.time);
      tendril.draw(ctx, breatheScale);
    }
    ctx.globalCompositeOperation = 'source-over';

    // 6. Update & draw rings (screen blend)
    for (let i = s.rings.length - 1; i >= 0; i--) {
      if (!s.rings[i].update()) { s.rings.splice(i, 1); }
    }
    if (s.rings.length > 0) {
      ctx.globalCompositeOperation = 'screen';
      for (const ring of s.rings) ring.draw(ctx, breatheScale);
      ctx.globalCompositeOperation = 'source-over';
    }

    // 7. Drift sparkles (screen blend)
    for (let i = s.driftSparkles.length - 1; i >= 0; i--) {
      if (!s.driftSparkles[i].update()) { s.driftSparkles.splice(i, 1); }
    }
    if (s.driftSparkles.length > 0) {
      ctx.globalCompositeOperation = 'screen';
      for (const sparkle of s.driftSparkles) sparkle.draw(ctx);
      ctx.globalCompositeOperation = 'source-over';
    }

    // 8. Spark bursts (screen blend)
    for (let i = s.sparks.length - 1; i >= 0; i--) {
      if (!s.sparks[i].update()) { s.sparks.splice(i, 1); }
    }
    if (s.sparks.length > 0) {
      ctx.globalCompositeOperation = 'screen';
      for (const burst of s.sparks) burst.draw(ctx);
      ctx.globalCompositeOperation = 'source-over';
    }

    // 9. Seed dot (source-over, always on top)
    drawSeedDot(ctx, cx, cy, breatheScale, props.treePalette);

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
      // Reset visual state on resize
      const s = stateRef.current;
      s.tendrils = [];
      s.rings = [];
      s.sparks = [];
      s.driftSparkles = [];
      s.sectorCounts = new Array(SECTOR_COUNT).fill(0);
      s.lastBreathCount = 0;
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
