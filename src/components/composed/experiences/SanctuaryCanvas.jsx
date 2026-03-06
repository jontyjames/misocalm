/**
 * SanctuaryCanvas — full-screen breath-reactive bioluminescent tree renderer
 *
 * Generates a tree skeleton on mount. Each breath reveals the next layer
 * via REVEAL_SCHEDULE. By breath 6 the tree is alive. By breath 11 it's radiant.
 *
 * Draw order: roots → trunk → branches → leaves → sparkles (bottom to top).
 * Ambient DriftSparkles float after breath 5. SparkBursts on each breath (additive).
 *
 * Sacred numbers: MAX_SHAPES=127 (Mersenne prime), MAX_DRIFT_SPARKLES=89 (fib),
 * DPR capped at 2, drift spawn probability 0.146 (1/phi^4).
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import SparkBurst from './SparkBurst';
import { TreeRoot, TreeTrunk, TreeBranch, TreeLeaf, DriftSparkle } from './SanctuaryShapes';
import { MAX_SHAPES, MAX_DRIFT_SPARKLES, generateTree, REVEAL_SCHEDULE } from './SanctuaryShapeData';

export default function SanctuaryCanvas({ breathCount, treePalette }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    roots: [], trunks: [], branches: [], leaves: [],
    sparks: [], driftSparkles: [],
    time: 0, lastBreathCount: 0, skeleton: null,
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

    // Generate skeleton on first render
    if (!s.skeleton && W > 0 && H > 0) {
      s.skeleton = generateTree(W, H);
    }

    s.time++;
    ctx.clearRect(0, 0, W, H);

    // Spawn shapes on each new breath
    if (props.breathCount > s.lastBreathCount && s.skeleton) {
      const diff = props.breathCount - s.lastBreathCount;
      const palette = props.treePalette;
      for (let i = 0; i < diff; i++) {
        const breathNum = s.lastBreathCount + i + 1;
        const schedule = REVEAL_SCHEDULE[breathNum];
        if (!schedule) continue;

        // Create shapes from schedule (skip indices that exceed generated arrays)
        const sk = s.skeleton;
        for (const idx of schedule.roots) {
          if (idx < sk.roots.length) s.roots.push(new TreeRoot(sk, idx, palette));
        }
        for (const idx of schedule.trunkSegs) {
          if (idx < sk.trunkSegments.length) s.trunks.push(new TreeTrunk(sk, idx, palette));
        }
        for (const idx of schedule.branches) {
          if (idx < sk.branches.length) s.branches.push(new TreeBranch(sk, idx, palette, false));
        }
        for (const idx of schedule.subBranches) {
          if (idx < sk.subBranches.length) s.branches.push(new TreeBranch(sk, idx, palette, true));
        }
        for (const idx of schedule.leaves) {
          if (idx < sk.leaves.length) s.leaves.push(new TreeLeaf(sk, idx, palette));
        }

        // Spark burst near the tree
        const sparkColors = palette ? palette.slice(0, 5) : null;
        const sparkPhase = breathNum <= 2 ? 'ROOT' : breathNum <= 4 ? 'TRUNK' : breathNum <= 6 ? 'BRANCH' : 'LEAF';
        s.sparks.push(new SparkBurst(W, H, sparkPhase, sparkColors));
      }
      s.lastBreathCount = props.breathCount;
    }

    // Ambient drift sparkles after breath 5
    if (props.breathCount >= 5 && s.driftSparkles.length < MAX_DRIFT_SPARKLES) {
      if (Math.random() < 0.146) {
        s.driftSparkles.push(new DriftSparkle(W, H, props.treePalette));
      }
    }

    // Update all layers
    for (const shape of s.roots) shape.update();
    for (const shape of s.trunks) shape.update();
    for (const shape of s.branches) shape.update();
    for (const shape of s.leaves) shape.update();

    // Draw order: roots → trunk → branches → leaves (bottom to top)
    for (const shape of s.roots) shape.draw(ctx, s.time);
    for (const shape of s.trunks) shape.draw(ctx, s.time);
    for (const shape of s.branches) shape.draw(ctx, s.time);
    for (const shape of s.leaves) shape.draw(ctx, s.time);

    // Cap total shapes
    const total = s.roots.length + s.trunks.length + s.branches.length + s.leaves.length;
    if (total > MAX_SHAPES) {
      const excess = total - MAX_SHAPES;
      s.roots.splice(0, Math.min(excess, s.roots.length));
    }

    // Update and draw drift sparkles
    for (let i = s.driftSparkles.length - 1; i >= 0; i--) {
      if (!s.driftSparkles[i].update()) { s.driftSparkles.splice(i, 1); continue; }
    }
    for (const sparkle of s.driftSparkles) sparkle.draw(ctx);

    // Update and draw spark bursts (additive glow)
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
      // Regenerate skeleton on resize
      stateRef.current.skeleton = null;
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
