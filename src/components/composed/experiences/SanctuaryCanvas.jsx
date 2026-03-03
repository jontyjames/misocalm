/**
 * SanctuaryCanvas — full-screen breath-reactive sacred geometry renderer
 *
 * Builds a sanctuary landscape from breath. Three visual layers:
 * - Foundation: curved arcs at the base (bottom third)
 * - Rising: vertical pillars and lines (middle)
 * - Canopy: overhead dome arcs and radial geometry (top)
 *
 * Colour: slate (396Hz solfeggio — liberation from fear).
 * Breath amplitude controls geometry size, brightness, and complexity.
 * Fade trail creates ghostly persistence. No clearing — layers accumulate.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import SparkBurst from './SparkBurst';

const VOID_COLOR = 'rgba(3, 7, 18, 0.02)';
const TAU = Math.PI * 2;

// Slate fallback (used when treePalette is null)
const SLATE_FALLBACK = { r: 148, g: 163, b: 184 }; // slate-400

// How many palette colours each phase reveals — consecutive primes (2, 3, 5)
const PHASE_COLOUR_COUNT = { FOUNDATION: 2, RISING: 3, CANOPY: 5 };

// Alpha warmth multiplier builds across phases — phi-derived
const PHASE_WARMTH = { FOUNDATION: 1.0, RISING: 1.1, CANOPY: 1.236 };

function pickTreeColor(palette, phase, amplitude) {
  if (!palette) return SLATE_FALLBACK;
  const count = PHASE_COLOUR_COUNT[phase] || 5;
  const available = palette.slice(0, count);
  const jitter = Math.random() * 0.618;
  const bias = amplitude * 0.618 + jitter * 0.382;
  const idx = Math.min(available.length - 1, Math.floor(bias * available.length));
  return available[idx];
}

class FoundationArc {
  constructor(cx, cy, W, H, amplitude, palette, phase) {
    this.age = 0;
    this.maxAge = 359; // prime
    const spread = 0.3 + amplitude * 0.618;
    const baseY = H * (0.75 + Math.random() * 0.15);
    this.cx = cx + (Math.random() - 0.5) * W * spread;
    this.cy = baseY;
    this.radius = 42 + amplitude * 68;
    this.startAngle = Math.PI + (Math.random() - 0.5) * 0.618;
    this.endAngle = TAU + (Math.random() - 0.5) * 0.618;
    this.lineWidth = 0.5 + amplitude * 1.5;
    this.color = pickTreeColor(palette, phase, amplitude);
    this.baseAlpha = (0.15 + amplitude * 0.25) * (PHASE_WARMTH[phase] || 1);
  }
  update() { this.age++; return this.age < this.maxAge; }
  draw(ctx) {
    const life = Math.max(0, 1 - this.age / this.maxAge);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const { r, g, b } = this.color;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, this.startAngle, this.endAngle);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineWidth = this.lineWidth * (0.5 + life * 0.5);
    ctx.stroke();
  }
}

class RisingPillar {
  constructor(cx, cy, W, H, amplitude, palette, phase) {
    this.age = 0;
    this.maxAge = 359;
    const xSpread = 0.4 + amplitude * 0.3;
    this.x = cx + (Math.random() - 0.5) * W * xSpread;
    this.topY = H * (0.25 + (1 - amplitude) * 0.2);
    this.bottomY = H * (0.7 + Math.random() * 0.1);
    this.lineWidth = 0.3 + amplitude * 1.2;
    this.color = pickTreeColor(palette, phase, amplitude);
    this.baseAlpha = (0.1 + amplitude * 0.2) * (PHASE_WARMTH[phase] || 1);
    // Small diamond or circle at the top
    this.capSize = 3 + amplitude * 5;
    this.capSides = [3, 5, 7][Math.floor(Math.random() * 3)];
  }
  update() { this.age++; return this.age < this.maxAge; }
  draw(ctx, time) {
    const life = Math.max(0, 1 - this.age / this.maxAge);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const { r, g, b } = this.color;
    // Rising line
    const revealProgress = Math.min(1, this.age / 55);
    const currentTop = this.bottomY - (this.bottomY - this.topY) * revealProgress;
    ctx.beginPath();
    ctx.moveTo(this.x, this.bottomY);
    ctx.lineTo(this.x, currentTop);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
    // Cap shape at top
    if (revealProgress > 0.8) {
      const capAlpha = a * ((revealProgress - 0.8) / 0.2);
      ctx.beginPath();
      for (let i = 0; i <= this.capSides; i++) {
        const angle = (i / this.capSides) * TAU + time * 0.00618;
        const px = this.x + Math.cos(angle) * this.capSize * life;
        const py = currentTop + Math.sin(angle) * this.capSize * life;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},${capAlpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

class CanopyArc {
  constructor(cx, cy, W, H, amplitude, palette, phase) {
    this.age = 0;
    this.maxAge = 359;
    this.cx = cx + (Math.random() - 0.5) * W * 0.3;
    this.cy = H * (0.15 + Math.random() * 0.2);
    this.radius = 68 + amplitude * 110;
    this.startAngle = (Math.random() - 0.5) * 0.618;
    this.endAngle = Math.PI + (Math.random() - 0.5) * 0.618;
    this.lineWidth = 0.3 + amplitude * 1;
    this.color = pickTreeColor(palette, phase, amplitude);
    this.baseAlpha = (0.08 + amplitude * 0.2) * (PHASE_WARMTH[phase] || 1);
    // Radial spokes from arc centre
    this.spokeCount = [3, 5, 7][Math.floor(Math.random() * 3)];
    this.spokeLen = 16 + amplitude * 26;
  }
  update() { this.age++; return this.age < this.maxAge; }
  draw(ctx, time) {
    const life = Math.max(0, 1 - this.age / this.maxAge);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const { r, g, b } = this.color;
    // Main arc
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius * (0.618 + life * 0.382), this.startAngle, this.endAngle);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
    // Radial spokes
    if (this.age > 34) {
      const spokeAlpha = a * 0.618;
      for (let i = 0; i < this.spokeCount; i++) {
        const angle = this.startAngle + (i / (this.spokeCount - 1 || 1)) * (this.endAngle - this.startAngle);
        const innerR = this.radius * 0.618 * life;
        const outerR = innerR + this.spokeLen * life;
        ctx.beginPath();
        ctx.moveTo(this.cx + Math.cos(angle) * innerR, this.cy + Math.sin(angle) * innerR);
        ctx.lineTo(this.cx + Math.cos(angle) * outerR, this.cy + Math.sin(angle) * outerR);
        ctx.strokeStyle = `rgba(${r},${g},${b},${spokeAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function createShape(phase, cx, cy, W, H, amplitude, palette) {
  if (phase === 'FOUNDATION') return new FoundationArc(cx, cy, W, H, amplitude, palette, phase);
  if (phase === 'RISING') return new RisingPillar(cx, cy, W, H, amplitude, palette, phase);
  return new CanopyArc(cx, cy, W, H, amplitude, palette, phase);
}

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
    // Gentle fade trail — sanctuary persists
    ctx.fillStyle = VOID_COLOR;
    ctx.fillRect(0, 0, W, H);

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
        const count = PHASE_COLOUR_COUNT[phase] || 5;
        const sparkColors = palette ? palette.slice(0, count) : null;
        s.sparks.push(new SparkBurst(W, H, phase, sparkColors));
      }
      s.lastBreathCount = props.breathCount;
    }

    // Update and draw shapes
    for (let i = s.shapes.length - 1; i >= 0; i--) {
      if (!s.shapes[i].update()) { s.shapes.splice(i, 1); continue; }
    }
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
