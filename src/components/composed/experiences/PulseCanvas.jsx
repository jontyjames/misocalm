/**
 * PulseCanvas — tap-driven heartbeat visualisation
 *
 * Each tap creates expanding rings of light from centre.
 * Slow fade trail creates a "pulse portrait" — unique to each session.
 * Anticipation ring appears after rhythm lock.
 * "You" dot breathing syncs to detected rhythm.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

const VOID_COLOR = 'rgba(3, 7, 18, 0.03)';
const MAX_TAP_DURATION = 233; // fib-move
const MAX_TAP_MOVEMENT = 10; // px

function consistencyColor(consistency) {
  if (consistency < 0.4) return { r: 165, g: 180, b: 252 }; // indigo (warm, no judgment)
  if (consistency < 0.7) return { r: 196, g: 181, b: 253 }; // violet (mid)
  return { r: 103, g: 232, b: 249 }; // cyan (awakening, clarity)
}

class PulseRing {
  constructor(cx, cy, maxRadius, color) {
    this.cx = cx;
    this.cy = cy;
    this.radius = 6; // phi-1 start
    this.maxRadius = maxRadius;
    this.age = 0;
    this.maxAge = 200;
    this.alive = true;
    this.color = color;
    this.startWidth = 3;
  }

  update() {
    this.age++;
    if (this.age > this.maxAge) { this.alive = false; return; }
    // Ease-out expansion
    const t = this.age / this.maxAge;
    const ease = 1 - (1 - t) * (1 - t);
    this.radius = 6 + (this.maxRadius - 6) * ease;
  }

  draw(ctx) {
    const life = Math.max(0, 1 - this.age / this.maxAge);
    const { r, g, b } = this.color;
    const alpha = 0.6 * life;
    const width = this.startWidth * life + 0.5;

    if (alpha < 0.005) return;

    // Ring stroke
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = width;
    ctx.stroke();

    // Inner glow halo
    const grad = ctx.createRadialGradient(
      this.cx, this.cy, Math.max(0, this.radius - 6),
      this.cx, this.cy, this.radius + 6
    );
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.12})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius + 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawYouDot(ctx, cx, cy, time, rhythmAvg) {
  // Sync breathing to detected rhythm, or default sine wave
  let breathe;
  if (rhythmAvg > 0) {
    const period = rhythmAvg;
    const phase = (time % period) / period;
    breathe = 1 + Math.sin(phase * Math.PI * 2) * 0.2;
  } else {
    breathe = 1 + Math.sin(time * 0.004) * 0.15;
  }
  const radius = 4 * breathe;

  // Centre glow (warm, 42px phi-5 radius)
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 42);
  grad.addColorStop(0, 'rgba(226, 232, 240, 0.08)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 42, 0, Math.PI * 2);
  ctx.fill();

  // Core dot
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(226, 232, 240, ${0.5 + breathe * 0.15})`;
  ctx.fill();

  // Tiny ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(226, 232, 240, ${0.04 + breathe * 0.02})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

function drawAnticipationRing(ctx, cx, cy, lastTapTime, avgInterval, now) {
  if (avgInterval <= 0) return;
  const elapsed = now - lastTapTime;
  const predicted = avgInterval;
  const t = elapsed / predicted;
  if (t < 0 || t > 1.3) return;

  const radius = 6 + (110 - 6) * Math.min(1, t);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(226, 232, 240, 0.08)`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

export default function PulseCanvas({ rhythmData = {}, customColor = null, onTap }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    rings: [],
    startTime: Date.now(),
    lastTapTime: 0,
    tapCount: 0,
  });
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ rhythmData, customColor });
  propsRef.current = { rhythmData, customColor };
  const pointerRef = useRef({ downTime: 0, x: 0, y: 0 });

  const handlePointerDown = useCallback((e) => {
    pointerRef.current = { downTime: Date.now(), x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e) => {
    const { downTime, x, y } = pointerRef.current;
    const elapsed = Date.now() - downTime;
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Valid tap: quick + minimal movement
    if (elapsed > MAX_TAP_DURATION || dist > MAX_TAP_MOVEMENT) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = dprRef.current;
    const cx = canvas.width / dpr / 2;
    const cy = canvas.height / dpr / 2;
    const s = stateRef.current;

    s.tapCount++;
    s.lastTapTime = Date.now();

    // Ring max radius grows with each tap (up to phi-7)
    const maxRadius = Math.min(110, 42 + s.tapCount * 5);
    const color = propsRef.current.customColor
      || consistencyColor(propsRef.current.rhythmData.consistency || 0);

    s.rings.push(new PulseRing(cx, cy, maxRadius, color));

    // Haptic
    if (navigator.vibrate) navigator.vibrate(23); // prime

    onTap?.();
  }, [onTap]);

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
    const elapsed = now - s.startTime;

    // Slow fade trail (rings persist for portrait effect)
    ctx.fillStyle = VOID_COLOR;
    ctx.fillRect(0, 0, W, H);

    // Anticipation ring (after rhythm lock)
    const rd = propsRef.current.rhythmData;
    if (rd.isLocked && s.lastTapTime > 0) {
      drawAnticipationRing(ctx, cx, cy, s.lastTapTime, rd.avg, now);
    }

    // Update and draw rings
    for (let i = s.rings.length - 1; i >= 0; i--) {
      s.rings[i].update();
      if (!s.rings[i].alive) s.rings.splice(i, 1);
    }
    for (const ring of s.rings) {
      ring.draw(ctx);
    }

    // Centre glow pulse on tap (377ms fade)
    if (s.lastTapTime > 0) {
      const tapAge = now - s.lastTapTime;
      if (tapAge < 377) {
        const glowAlpha = 0.15 * (1 - tapAge / 377);
        const color = propsRef.current.customColor
          || consistencyColor(rd.consistency || 0);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 42);
        grad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${glowAlpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 42, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // "You" dot — breathing synced to rhythm if locked
    drawYouDot(ctx, cx, cy, rd.isLocked ? elapsed : elapsed, rd.isLocked ? rd.avg : 0);

    rafRef.current = requestAnimationFrame(render);
  }, []);

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

  useEffect(() => {
    if (prefersReduced) return;
    rafRef.current = requestAnimationFrame(render);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [render, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pulse-canvas"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ position: 'fixed', inset: 0, zIndex: 0, touchAction: 'none', cursor: 'pointer' }}
    />
  );
}
