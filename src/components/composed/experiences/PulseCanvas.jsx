/**
 * PulseCanvas — tap-driven heartbeat visualisation
 *
 * Each tap creates expanding rings of light from centre.
 * Three visual tiers build as rhythm consistency deepens:
 *   Tier 1–2: indigo → violet rings, phi-7 cap (110px)
 *   Tier 3 (rhythm lock): phi-8 cap (178px), corona halo,
 *     particle echoes, colour deepening, breathing edges
 * Slow fade trail creates a "pulse portrait" unique to each session.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import {
  PulseRing, Particle, consistencyColor, deepColor,
  drawYouDot, drawAnticipationRing,
} from './PulseEffects';

const VOID_COLOR = 'rgba(3, 7, 18, 0.03)';
const MAX_TAP_DURATION = 233; // fib-move
const MAX_TAP_MOVEMENT = 10; // px

export default function PulseCanvas({ rhythmData = {}, customColor = null, onTap }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    rings: [],
    particles: [],
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

  const registerTapDown = useCallback((clientX, clientY) => {
    pointerRef.current = { downTime: Date.now(), x: clientX, y: clientY };
  }, []);

  const registerTapUp = useCallback((clientX, clientY) => {
    const { downTime, x, y } = pointerRef.current;
    const elapsed = Date.now() - downTime;
    const dx = clientX - x;
    const dy = clientY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (elapsed > MAX_TAP_DURATION || dist > MAX_TAP_MOVEMENT) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = dprRef.current;
    const cx = canvas.width / dpr / 2;
    const cy = canvas.height / dpr / 2;
    const s = stateRef.current;
    const rd = propsRef.current.rhythmData;
    const isLocked = rd.isLocked;

    s.tapCount++;
    s.lastTapTime = Date.now();

    // Tier 3: cap lifts to phi-8 (178) after rhythm lock
    const cap = isLocked ? 178 : 110; // phi-8 / phi-7
    const maxRadius = Math.min(cap, 42 + s.tapCount * 5);

    // Colour deepening at tier 3
    const color = propsRef.current.customColor
      || (isLocked ? deepColor(rd.consistency || 0) : consistencyColor(rd.consistency || 0));

    s.rings.push(new PulseRing(cx, cy, maxRadius, color));

    // Particles at tier 3 — 7 per ring (prime), soft cap at 199 (prime)
    if (isLocked && maxRadius > 110 && s.particles.length < 199) {
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 * i / 7) + Math.random() * 0.3;
        s.particles.push(new Particle(cx, cy, angle, maxRadius * 0.6, color));
      }
    }

    if (navigator.vibrate) navigator.vibrate(23); // prime
    onTap?.();
  }, [onTap]);

  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    registerTapDown(e.clientX, e.clientY);
  }, [registerTapDown]);

  const handlePointerUp = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    registerTapUp(e.clientX, e.clientY);
  }, [registerTapUp]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) registerTapDown(touch.clientX, touch.clientY);
  }, [registerTapDown]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    if (touch) registerTapUp(touch.clientX, touch.clientY);
  }, [registerTapUp]);

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
    const now = Date.now();
    const elapsed = now - s.startTime;

    // Slow fade trail (rings persist for portrait effect)
    ctx.fillStyle = VOID_COLOR;
    ctx.fillRect(0, 0, W, H);

    // Anticipation ring (after rhythm lock)
    const rd = propsRef.current.rhythmData;
    if (rd.isLocked && s.lastTapTime > 0) {
      drawAnticipationRing(ctx, cx, cy, s.lastTapTime, rd.avg, now, rd.isLocked);
    }

    // Update and draw rings
    for (let i = s.rings.length - 1; i >= 0; i--) {
      s.rings[i].update();
      if (!s.rings[i].alive) s.rings.splice(i, 1);
    }
    for (const ring of s.rings) ring.draw(ctx);

    // Update and draw particles
    for (let i = s.particles.length - 1; i >= 0; i--) {
      s.particles[i].update();
      if (!s.particles[i].alive) s.particles.splice(i, 1);
    }
    for (const p of s.particles) p.draw(ctx);

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
    drawYouDot(ctx, cx, cy, elapsed, rd.isLocked ? rd.avg : 0);

    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const displayW = window.innerWidth;
      const displayH = window.innerHeight;
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before re-scaling (resize resets canvas buffer but not transform)
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'fixed', inset: 0, zIndex: 0, touchAction: 'none', cursor: 'pointer' }}
    />
  );
}
