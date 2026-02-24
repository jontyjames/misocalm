/**
 * GroundingCanvas — full-screen sacred geometry renderer for grounding experience
 *
 * Each tap spawns a SacredForm: a translucent geometric shape at a random position.
 * By the end of 15 taps, the user has painted a unique generative art piece.
 * Very slow fade trail so shapes persist nearly the whole experience.
 * Pattern follows SoundCanvas/MandalaCanvas.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import { SACRED_SHAPES } from '@/lib/sacredShapes';

const VOID_FADE = 'rgba(3, 7, 18, 0.008)'; // extremely slow fade — shapes linger
const MAX_FORMS = 37; // prime cap

class SacredForm {
  constructor(x, y, shapeIndex, color, size, rotation) {
    this.x = x;
    this.y = y;
    this.shapeIndex = shapeIndex;
    this.color = color;
    this.size = size;
    this.rotation = rotation;
    this.age = 0;
    this.maxAge = 610; // frames
    this.alive = true;
    this.scale = 0; // scales up from 0
  }

  update() {
    this.age++;
    if (this.age > this.maxAge) {
      this.alive = false;
      return;
    }
    // Scale up over ~23 frames (smooth entrance)
    if (this.scale < 1) {
      this.scale = Math.min(1, this.scale + 0.045);
    }
    // Gentle rotation drift
    this.rotation += 0.001;
  }

  draw(ctx) {
    if (!this.alive) return;
    const life = Math.max(0, 1 - this.age / this.maxAge);
    // Fade curve: hold full alpha for 80% of life, then fade
    const alpha = life > 0.2 ? 0.85 : (life / 0.2) * 0.85;
    const currentSize = this.size * this.scale;
    if (alpha < 0.005 || currentSize < 1) return;

    SACRED_SHAPES[this.shapeIndex](
      ctx,
      this.x,
      this.y,
      currentSize,
      this.color,
      alpha,
      this.rotation,
    );
  }
}

export default function GroundingCanvas({ shapes }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ forms: [], time: 0 });
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const shapesRef = useRef(shapes);
  shapesRef.current = shapes;
  const lastSpawnCountRef = useRef(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = dprRef.current;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const s = stateRef.current;

    s.time++;

    // Very slow fade trail — shapes accumulate visually
    ctx.fillStyle = VOID_FADE;
    ctx.fillRect(0, 0, W, H);

    // Spawn new forms from shapes prop
    const currentShapes = shapesRef.current;
    if (currentShapes.length > lastSpawnCountRef.current) {
      for (let i = lastSpawnCountRef.current; i < currentShapes.length; i++) {
        const sh = currentShapes[i];
        if (s.forms.length >= MAX_FORMS) {
          s.forms.shift();
        }
        s.forms.push(new SacredForm(sh.x, sh.y, sh.shapeIndex, sh.colorStr, sh.size, sh.rotation));
      }
      lastSpawnCountRef.current = currentShapes.length;
    }

    // Update and draw
    for (let i = s.forms.length - 1; i >= 0; i--) {
      s.forms[i].update();
      if (!s.forms[i].alive) s.forms.splice(i, 1);
    }
    for (const form of s.forms) {
      form.draw(ctx);
    }

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
