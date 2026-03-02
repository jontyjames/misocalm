/**
 * MandalaCanvas — touch-driven radially symmetric generative art
 *
 * Each touch creates a MandalaForm: particles mirrored N times around centre.
 * Canvas never clears (fade trail at alpha 0.02 — slower than Impermanence).
 * Screen blend mode for additive light mixing.
 * "You cannot make it ugly" — symmetry guarantees harmony.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';

const VOID_COLOR = 'rgba(3, 7, 18, 0.02)';
const MAX_FORMS = 37; // prime cap
const SHAPES = ['circle', 'triangle', 'hexagon', 'petal'];

function distanceColor(dist, maxDist) {
  const t = Math.min(1, dist / maxDist);
  if (t < 0.33) return { r: 165, g: 180, b: 252 }; // indigo (inner)
  if (t < 0.66) return { r: 196, g: 181, b: 253 }; // violet (mid)
  return { r: 103, g: 232, b: 249 }; // cyan (outer)
}

class MandalaForm {
  constructor(cx, cy, touchX, touchY, symmetry, speed, customColor) {
    this.cx = cx;
    this.cy = cy;
    this.symmetry = symmetry;
    this.age = 0;
    this.maxAge = 400;
    this.alive = true;
    this.customColor = customColor;

    const dx = touchX - cx;
    const dy = touchY - cy;
    this.angle = Math.atan2(dy, dx);
    this.dist = Math.sqrt(dx * dx + dy * dy);
    this.speed = speed || 0;

    // Particle count: 34-89 (Fibonacci range)
    const count = 34 + Math.floor(Math.random() * 55);
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const stretch = Math.min(3, 1 + this.speed * 0.01);

    this.particles = [];
    for (let i = 0; i < count; i++) {
      const localAngle = (Math.random() - 0.5) * 0.8;
      const localDist = 6 + Math.random() * 42;
      const pSpeed = 0.3 + Math.random() * 1.2;
      this.particles.push({
        localAngle,
        localDist,
        targetDist: localDist + Math.random() * 26,
        speed: pSpeed,
        size: 2 + Math.random() * 4 * (1 / stretch),
        alpha: 0.2 + Math.random() * 0.2,
        shape,
        stretch,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  update(time) {
    this.age++;
    if (this.age > this.maxAge) { this.alive = false; return; }

    for (const p of this.particles) {
      if (p.localDist < p.targetDist) {
        p.localDist += p.speed;
      }
    }
  }

  draw(ctx, time) {
    const life = Math.max(0, 1 - this.age / this.maxAge);
    const fadeOut = life < 0.3 ? life / 0.3 : 1;
    const breathe = 1 + Math.sin(time * 0.002) * 0.03;
    const maxDist = 110;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let s = 0; s < this.symmetry; s++) {
      const symAngle = this.angle + (s / this.symmetry) * Math.PI * 2;

      for (const p of this.particles) {
        const pAngle = symAngle + p.localAngle;
        const pDist = (this.dist + p.localDist) * breathe;
        const px = this.cx + Math.cos(pAngle) * pDist;
        const py = this.cy + Math.sin(pAngle) * pDist;

        const color = this.customColor || distanceColor(pDist, maxDist);
        const alpha = p.alpha * fadeOut;
        if (alpha < 0.005) continue;

        // Soft particle with radial gradient
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * life * 2);
        grad.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * life * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, p.size * life * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${alpha * 0.4})`;
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

function drawYouDot(ctx, cx, cy, time) {
  const breathe = 1 + Math.sin(time * 0.004) * 0.15;
  const radius = 4 * breathe;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 42);
  grad.addColorStop(0, 'rgba(226, 232, 240, 0.06)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(226, 232, 240, ${0.5 + breathe * 0.15})`;
  ctx.fill();

  ctx.font = '200 11px "Josefin Sans", sans-serif';
  ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
  ctx.letterSpacing = '0.15em';
  ctx.textAlign = 'left';
  ctx.fillText('you', cx + 16, cy + 4);
}

export default function MandalaCanvas({ symmetry = 5, showYouDot = false, customColor = null, onTouch }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ forms: [], time: 0 });
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ symmetry, showYouDot, customColor });
  propsRef.current = { symmetry, showYouDot, customColor };

  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const lastFormTimeRef = useRef(0);

  const spawnForm = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Throttle form creation — one per 89ms (fib) to prevent overload
    const now = Date.now();
    if (now - lastFormTimeRef.current < 89) return;
    lastFormTimeRef.current = now;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const dpr = dprRef.current;
    const cx = canvas.width / dpr / 2;
    const cy = canvas.height / dpr / 2;

    const dt = now - lastPointerRef.current.time;
    const dx = x - lastPointerRef.current.x;
    const dy = y - lastPointerRef.current.y;
    const speed = dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt * 16 : 0;
    lastPointerRef.current = { x, y, time: now };

    const s = stateRef.current;
    if (s.forms.length >= MAX_FORMS) {
      s.forms.shift();
    }
    s.forms.push(new MandalaForm(cx, cy, x, y, propsRef.current.symmetry, speed, propsRef.current.customColor));

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(13);

    onTouch?.({ x, y, speed });
  }, [onTouch]);

  const handlePointerDown = useCallback((e) => {
    // Skip if this is a touch event (handled by onTouchStart)
    if (e.pointerType === 'touch') return;
    spawnForm(e.clientX, e.clientY);
  }, [spawnForm]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault(); // Prevent iOS scroll/zoom
    const touch = e.touches[0];
    if (touch) spawnForm(touch.clientX, touch.clientY);
  }, [spawnForm]);

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

    s.time++;

    // Slower fade trail than Impermanence (mandalas linger)
    ctx.fillStyle = VOID_COLOR;
    ctx.fillRect(0, 0, W, H);

    // Update and draw forms
    for (let i = s.forms.length - 1; i >= 0; i--) {
      s.forms[i].update(s.time);
      if (!s.forms[i].alive) s.forms.splice(i, 1);
    }
    for (const form of s.forms) {
      form.draw(ctx, s.time);
    }

    if (propsRef.current.showYouDot) {
      drawYouDot(ctx, cx, cy, s.time);
    }

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
      className="mandala-canvas"
      onPointerDown={handlePointerDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchStart}
      style={{ position: 'fixed', inset: 0, zIndex: 0, touchAction: 'none', cursor: 'crosshair' }}
    />
  );
}
