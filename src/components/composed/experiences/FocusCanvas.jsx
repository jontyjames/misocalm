/**
 * FocusCanvas — expanding mandala tunnel with peripheral flashes
 *
 * Concentric rings expand outward from centre creating tunnel depth.
 * Flashes appear at peripheral angles for attentional capture.
 * Centre dot breathes on phi rhythm. Max 7 concurrent rings (prime).
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';

const MAX_RINGS = 7; // prime
const RING_SPAWN_INTERVAL = 987; // fib-breathe
const TWO_PI = Math.PI * 2;

class TunnelRing {
  constructor() {
    this.radius = 6; // phi-1 start
    this.age = 0;
    this.maxAge = 300; // ~5s at 60fps
    this.alive = true;
  }

  update() {
    this.age++;
    if (this.age > this.maxAge) { this.alive = false; return; }
    const t = this.age / this.maxAge;
    const ease = 1 - (1 - t) * (1 - t);
    this.radius = 6 + ease * 400;
  }

  draw(ctx, cx, cy) {
    const life = Math.max(0, 1 - this.age / this.maxAge);
    const alpha = 0.25 * life;
    if (alpha < 0.005) return;
    ctx.beginPath();
    ctx.arc(cx, cy, this.radius, 0, TWO_PI);
    ctx.strokeStyle = `rgba(34,211,238,${alpha})`; // cyan-400
    ctx.lineWidth = 1 + life * 0.5;
    ctx.stroke();
  }
}

export default function FocusCanvas({ flashVisible, flashAngle, flashCaptured }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ flashVisible, flashAngle, flashCaptured });
  propsRef.current = { flashVisible, flashAngle, flashCaptured };
  const stateRef = useRef({
    rings: [],
    time: 0,
    lastSpawn: 0,
  });

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = dprRef.current;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const cx = W / 2;
    const cy = H / 2;
    const s = stateRef.current;
    const now = Date.now();
    s.time += 16;

    ctx.clearRect(0, 0, W, H);

    // Spawn new ring periodically
    if (now - s.lastSpawn > RING_SPAWN_INTERVAL) {
      if (s.rings.length < MAX_RINGS) {
        s.rings.push(new TunnelRing());
      }
      s.lastSpawn = now;
    }

    // Update and draw rings
    for (let i = s.rings.length - 1; i >= 0; i--) {
      s.rings[i].update();
      if (!s.rings[i].alive) s.rings.splice(i, 1);
    }
    for (const ring of s.rings) {
      ring.draw(ctx, cx, cy);
    }

    // Centre dot — breathing on phi rhythm
    const breathe = 1 + Math.sin(s.time * 0.003) * 0.3;
    const dotR = 3 * breathe;

    // Centre glow halo
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 42);
    glowGrad.addColorStop(0, 'rgba(226,232,240,0.06)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, TWO_PI);
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(cx, cy, dotR, 0, TWO_PI);
    ctx.fillStyle = `rgba(226,232,240,${0.5 + breathe * 0.2})`;
    ctx.fill();

    // Flash — peripheral glow at angle
    const { flashVisible: fv, flashAngle: fa, flashCaptured: fc } = propsRef.current;
    if (fv) {
      const flashDist = Math.min(W, H) * 0.35;
      const fx = cx + Math.cos(fa) * flashDist;
      const fy = cy + Math.sin(fa) * flashDist;
      const flashR = fc ? 42 : 26; // bigger on capture
      const flashAlpha = fc ? 0.6 : 0.4;

      // Flash glow
      const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, flashR);
      grad.addColorStop(0, `rgba(34,211,238,${flashAlpha})`);
      grad.addColorStop(0.5, `rgba(34,211,238,${flashAlpha * 0.3})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(fx, fy, flashR, 0, TWO_PI);
      ctx.fill();

      // Flash core
      ctx.beginPath();
      ctx.arc(fx, fy, 3, 0, TWO_PI);
      ctx.fillStyle = `rgba(226,232,240,${flashAlpha * 0.8})`;
      ctx.fill();

      // On capture, draw connecting line to centre
      if (fc) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(fx, fy);
        ctx.strokeStyle = 'rgba(34,211,238,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Subtle ambient tunnel depth ring
    const ambientAlpha = 0.03 + Math.sin(s.time * 0.001) * 0.01;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(W, H) * 0.45, 0, TWO_PI);
    ctx.strokeStyle = `rgba(34,211,238,${ambientAlpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    rafRef.current = requestAnimationFrame(render);
  }, []);

  // Canvas resize with DPR scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
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
    stateRef.current.lastSpawn = Date.now();
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
