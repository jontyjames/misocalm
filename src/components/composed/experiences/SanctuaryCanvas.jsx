/**
 * SanctuaryCanvas — bioluminescent tree of life renderer
 *
 * Recursive tree generated on mount. Each breath reveals deeper branches.
 * Multi-layer glow per segment. Fade trails for memory. Additive blending.
 * Gentle breathing animation — the tree pulses with life.
 *
 * Sacred numbers: MAX_DRIFT_SPARKLES=89 (fib), fade trail alpha=0.03,
 * DPR capped at 2, drift spawn probability 0.146 (1/phi^4).
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import SparkBurst from './SparkBurst';
import { drawGlowSegment, drawLeafGlow, DriftSparkle } from './SanctuaryShapes';
import { MAX_DRIFT_SPARKLES, generateTree, getRevealDepth, pickTreeColor } from './SanctuaryShapeData';

const VOID_COLOR = 'rgba(3, 7, 18, 0.04)'; // slow fade trail

export default function SanctuaryCanvas({ breathCount, treePalette }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    segments: null,
    revealedDepth: -1,
    sparks: [],
    driftSparkles: [],
    time: 0,
    lastBreathCount: 0,
    segmentAges: null,    // age per segment for bloom animation
    segmentColors: null,  // pre-picked color per segment
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

    // Generate tree on first render
    if (!s.segments && W > 0 && H > 0) {
      s.segments = generateTree(W, H);
      s.segmentAges = new Array(s.segments.length).fill(-1); // -1 = not revealed
      s.segmentColors = s.segments.map(seg =>
        pickTreeColor(props.treePalette, seg.depth, 11)
      );
    }

    s.time++;

    // Fade trail — don't clear fully, let old frames ghost
    ctx.fillStyle = VOID_COLOR;
    ctx.fillRect(0, 0, W, H);

    // On new breath: reveal more depth + spark burst
    if (props.breathCount > s.lastBreathCount && s.segments) {
      const newDepth = getRevealDepth(props.breathCount);
      if (newDepth > s.revealedDepth) {
        // Mark newly revealed segments
        for (let i = 0; i < s.segments.length; i++) {
          if (s.segmentAges[i] === -1 && s.segments[i].depth <= newDepth) {
            s.segmentAges[i] = 0;
          }
        }
        s.revealedDepth = newDepth;
      }

      // Spark burst
      const palette = props.treePalette;
      const sparkColors = palette ? palette.slice(0, 5) : null;
      const breathNum = props.breathCount;
      const sparkPhase = breathNum <= 2 ? 'ROOT' : breathNum <= 4 ? 'TRUNK' : breathNum <= 6 ? 'BRANCH' : 'LEAF';
      s.sparks.push(new SparkBurst(W, H, sparkPhase, sparkColors));

      s.lastBreathCount = props.breathCount;
    }

    // Ambient drift sparkles after breath 5
    if (props.breathCount >= 5 && s.driftSparkles.length < MAX_DRIFT_SPARKLES) {
      if (Math.random() < 0.146) {
        s.driftSparkles.push(new DriftSparkle(W, H, props.treePalette));
      }
    }

    // Breathing animation — subtle global pulse
    const breathe = 0.85 + 0.15 * Math.sin(s.time * 0.015);

    // Draw tree segments with multi-layer glow
    if (s.segments) {
      // Use additive blending for bioluminescent glow
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < s.segments.length; i++) {
        const age = s.segmentAges[i];
        if (age < 0) continue; // not revealed yet

        s.segmentAges[i]++;
        const seg = s.segments[i];
        const color = s.segmentColors[i];

        // Bloom in: fade from 0 to full over ~60 frames
        const bloomT = Math.min(1, age / 60);
        const alpha = bloomT * breathe;

        drawGlowSegment(ctx, seg, color, alpha);

        // Leaf glow at tips (segments with no children at deepest revealed depth)
        if (seg.depth >= s.revealedDepth - 1 && seg.depth >= 5 && bloomT > 0.5) {
          const leafAlpha = (bloomT - 0.5) * 2 * breathe * 0.6;
          const leafRadius = 6 + (seg.depth - 5) * 2;
          drawLeafGlow(ctx, seg.x1, seg.y1, leafRadius, color, leafAlpha);
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    // Update and draw drift sparkles
    for (let i = s.driftSparkles.length - 1; i >= 0; i--) {
      if (!s.driftSparkles[i].update()) { s.driftSparkles.splice(i, 1); continue; }
    }
    ctx.globalCompositeOperation = 'screen';
    for (const sparkle of s.driftSparkles) sparkle.draw(ctx);
    ctx.globalCompositeOperation = 'source-over';

    // Update and draw spark bursts
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
      // Regenerate tree on resize
      stateRef.current.segments = null;
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
