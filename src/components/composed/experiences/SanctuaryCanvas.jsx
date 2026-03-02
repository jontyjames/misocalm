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

const VOID_COLOR = 'rgba(3, 7, 18, 0.02)';
const TAU = Math.PI * 2;

// Slate 396Hz palette — warm greys with soft blue undertone
const SLATE = {
  bright: { r: 203, g: 213, b: 225 }, // slate-300
  mid:    { r: 148, g: 163, b: 184 }, // slate-400
  dim:    { r: 100, g: 116, b: 139 }, // slate-500
};

class FoundationArc {
  constructor(cx, cy, W, H, amplitude) {
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
    const c = amplitude > 0.6 ? SLATE.bright : SLATE.mid;
    this.color = c;
    this.baseAlpha = 0.15 + amplitude * 0.25;
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
  constructor(cx, cy, W, H, amplitude) {
    this.age = 0;
    this.maxAge = 359;
    const xSpread = 0.4 + amplitude * 0.3;
    this.x = cx + (Math.random() - 0.5) * W * xSpread;
    this.topY = H * (0.25 + (1 - amplitude) * 0.2);
    this.bottomY = H * (0.7 + Math.random() * 0.1);
    this.lineWidth = 0.3 + amplitude * 1.2;
    const c = amplitude > 0.7 ? SLATE.bright : SLATE.mid;
    this.color = c;
    this.baseAlpha = 0.1 + amplitude * 0.2;
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
  constructor(cx, cy, W, H, amplitude) {
    this.age = 0;
    this.maxAge = 359;
    this.cx = cx + (Math.random() - 0.5) * W * 0.3;
    this.cy = H * (0.15 + Math.random() * 0.2);
    this.radius = 68 + amplitude * 110;
    this.startAngle = (Math.random() - 0.5) * 0.618;
    this.endAngle = Math.PI + (Math.random() - 0.5) * 0.618;
    this.lineWidth = 0.3 + amplitude * 1;
    const c = amplitude > 0.5 ? SLATE.bright : SLATE.mid;
    this.color = c;
    this.baseAlpha = 0.08 + amplitude * 0.2;
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

function createShape(phase, cx, cy, W, H, amplitude) {
  if (phase === 'FOUNDATION') return new FoundationArc(cx, cy, W, H, amplitude);
  if (phase === 'RISING') return new RisingPillar(cx, cy, W, H, amplitude);
  return new CanopyArc(cx, cy, W, H, amplitude);
}

export default function SanctuaryCanvas({ breathCount, breathPhase, audioLevel = 0 }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ shapes: [], time: 0, smoothLevel: 0, lastBreathCount: 0 });
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ breathCount, breathPhase, audioLevel });
  propsRef.current = { breathCount, breathPhase, audioLevel };

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
    // Smooth audio for ambient glow
    s.smoothLevel += (props.audioLevel - s.smoothLevel) * 0.1;

    // Spawn shapes on each new breath
    if (props.breathCount > s.lastBreathCount) {
      const diff = props.breathCount - s.lastBreathCount;
      for (let i = 0; i < diff; i++) {
        const amp = 0.3 + Math.random() * 0.7;
        const shape = createShape(props.breathPhase || 'FOUNDATION', cx, cy, W, H, amp);
        s.shapes.push(shape);
        // Add 2 companion shapes for richness (3 total per breath, prime)
        s.shapes.push(createShape(props.breathPhase || 'FOUNDATION', cx, cy, W, H, amp * 0.618));
        s.shapes.push(createShape(props.breathPhase || 'FOUNDATION', cx, cy, W, H, amp * 0.382));
      }
      s.lastBreathCount = props.breathCount;
    }

    // Update and draw
    for (let i = s.shapes.length - 1; i >= 0; i--) {
      if (!s.shapes[i].update()) { s.shapes.splice(i, 1); continue; }
    }
    for (const shape of s.shapes) {
      shape.draw(ctx, s.time);
    }

    // Ambient breath glow at centre bottom (the hearth)
    if (s.smoothLevel > 0.01) {
      const glowR = 42 + s.smoothLevel * 68;
      const hearthY = H * 0.85;
      const grad = ctx.createRadialGradient(cx, hearthY, 0, cx, hearthY, glowR);
      grad.addColorStop(0, `rgba(148,163,184,${s.smoothLevel * 0.08})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, hearthY, glowR, 0, TAU);
      ctx.fill();
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
