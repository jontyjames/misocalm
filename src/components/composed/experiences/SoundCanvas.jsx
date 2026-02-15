/**
 * SoundCanvas — full ink-bloom renderer for Impermanence
 *
 * Ported from the standalone HTML experience. Key visual ingredients:
 * - Fade trails (never clears canvas, old particles ghost away)
 * - Bloom class with ink tendrils + particles + central splash
 * - Continuous bloom spawning while sound persists
 * - "You" dot drawn on canvas (warm white, breathing glow, tiny ring)
 * - Pitch-weighted solfeggio colouring
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

const LOUD_THRESHOLD = 0.06;
const VOID_COLOR = 'rgba(3, 7, 18, 0.06)';

function pitchToColor(pitch) {
  if (pitch < 0.33) return { r: 165, g: 180, b: 252 }; // indigo
  if (pitch < 0.66) return { r: 196, g: 181, b: 253 }; // violet
  return { r: 103, g: 232, b: 249 }; // cyan
}

class Bloom {
  constructor(cx, cy, intensity, pitch, customColor) {
    this.cx = cx;
    this.cy = cy;
    this.intensity = intensity;
    this.age = 0;
    this.maxAge = 300 + intensity * 200;
    this.alive = true;

    this.color = customColor || pitchToColor(pitch);

    // Ink particles
    const count = 60 + Math.floor(intensity * 120);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random() * 2) * (0.5 + intensity * 1.5);
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5 * intensity,
        maxDist: 50 + intensity * 200 + Math.random() * 80,
        alpha: 0.3 + Math.random() * 0.5,
        drag: 0.97 + Math.random() * 0.02,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.04,
      });
    }

    // Ink tendrils
    const tendrilCount = 5 + Math.floor(intensity * 8);
    this.tendrils = [];
    for (let i = 0; i < tendrilCount; i++) {
      const angle = (i / tendrilCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      this.tendrils.push({
        angle,
        length: 0,
        maxLength: 60 + intensity * 150 + Math.random() * 60,
        speed: 1 + Math.random() * 2,
        width: 1 + Math.random() * 2,
        wobble: 0.02 + Math.random() * 0.05,
        alpha: 0.15 + Math.random() * 0.2,
      });
    }
  }

  update(time) {
    this.age++;
    const life = 1 - this.age / this.maxAge;
    if (life <= 0) { this.alive = false; return; }

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vx += Math.sin(time * p.wobbleSpeed + p.wobblePhase) * 0.03;
      p.vy += Math.cos(time * p.wobbleSpeed + p.wobblePhase) * 0.03;
    }

    for (const t of this.tendrils) {
      if (t.length < t.maxLength) t.length += t.speed;
    }
  }

  draw(ctx, time) {
    const life = Math.max(0, 1 - this.age / this.maxAge);
    const fadeOut = life < 0.4 ? life / 0.4 : 1;
    const { r, g, b } = this.color;

    // Tendrils
    for (const t of this.tendrils) {
      const wobble = Math.sin(time * t.wobble + t.angle) * 20 * life;
      const endX = this.cx + Math.cos(t.angle + wobble * 0.01) * t.length * life;
      const endY = this.cy + Math.sin(t.angle + wobble * 0.01) * t.length * life;
      const midX = this.cx + Math.cos(t.angle) * t.length * 0.5 * life + wobble;
      const midY = this.cy + Math.sin(t.angle) * t.length * 0.5 * life + wobble * 0.5;

      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.strokeStyle = `rgba(${r},${g},${b},${t.alpha * fadeOut})`;
      ctx.lineWidth = t.width * life;
      ctx.stroke();
    }

    // Particles
    for (const p of this.particles) {
      const dist = Math.sqrt((p.x - this.cx) ** 2 + (p.y - this.cy) ** 2);
      const distFade = dist > p.maxDist * 0.7
        ? 1 - (dist - p.maxDist * 0.7) / (p.maxDist * 0.3)
        : 1;
      const alpha = p.alpha * fadeOut * Math.max(0, distFade);
      if (alpha < 0.005) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.6})`;
      ctx.fill();

      // Outer glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * life * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.06})`;
      ctx.fill();
    }

    // Central splash (bright core, fades fast)
    if (this.age < 60) {
      const splashLife = 1 - this.age / 60;
      const splashR = 30 + this.intensity * 40;
      const grad = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, splashR * splashLife);
      grad.addColorStop(0, `rgba(${r},${g},${b},${splashLife * 0.15})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, splashR * splashLife, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawYouDot(ctx, cx, cy, time, showLabel) {
  const breathe = 1 + Math.sin(time * 0.004) * 0.15;
  const radius = 4 * breathe;

  // Warm constant glow
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
  grad.addColorStop(0, 'rgba(226, 232, 240, 0.06)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
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

  // "you" label
  if (showLabel) {
    ctx.font = '200 11px "Josefin Sans", sans-serif';
    ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
    ctx.letterSpacing = '0.15em';
    ctx.textAlign = 'left';
    ctx.fillText('you', cx + 16, cy + 4);
  }
}

export default function SoundCanvas({ audioLevel = 0, pitch = 0.5, customColor = null, showYouDot = false, showYouLabel = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    blooms: [],
    time: 0,
    smoothLevel: 0,
    hasBeenLoud: false,
    spawnCounter: 0,
  });
  const rafRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ audioLevel, pitch, customColor, showYouDot, showYouLabel });
  propsRef.current = { audioLevel, pitch, customColor, showYouDot, showYouLabel };

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const s = stateRef.current;
    const props = propsRef.current;

    s.time++;

    // Fade trail (the magic ingredient)
    ctx.fillStyle = VOID_COLOR;
    ctx.fillRect(0, 0, W, H);

    // Smoothed audio level
    s.smoothLevel += (props.audioLevel - s.smoothLevel) * 0.15;

    // Spawn blooms on loud sounds
    if (s.smoothLevel > LOUD_THRESHOLD) {
      if (!s.hasBeenLoud) {
        s.hasBeenLoud = true;
        s.blooms.push(new Bloom(cx, cy, Math.min(1, s.smoothLevel * 3), props.pitch, props.customColor));
      }
      // Continuous smaller blooms while sound persists
      s.spawnCounter++;
      if (s.spawnCounter % 15 === 0 && s.smoothLevel > LOUD_THRESHOLD * 0.7) {
        s.blooms.push(new Bloom(cx, cy, Math.min(0.6, s.smoothLevel * 2), props.pitch, props.customColor));
      }
    } else {
      s.hasBeenLoud = false;
      s.spawnCounter = 0;
    }

    // Update and draw blooms
    for (let i = s.blooms.length - 1; i >= 0; i--) {
      s.blooms[i].update(s.time);
      if (!s.blooms[i].alive) s.blooms.splice(i, 1);
    }
    for (const bloom of s.blooms) {
      bloom.draw(ctx, s.time);
    }

    // "You" dot always on top
    if (props.showYouDot) {
      drawYouDot(ctx, cx, cy, s.time, props.showYouLabel);
    }

    rafRef.current = requestAnimationFrame(render);
  }, []);

  // Canvas resize (no DPR scaling to match original 1:1 pixel look)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Animation loop
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
