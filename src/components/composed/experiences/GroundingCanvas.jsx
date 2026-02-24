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

const MAX_FORMS = 37; // prime cap

class SacredForm {
  constructor(x, y, shapeIndex, color, size, rotation) {
    this.x = x;
    this.y = y;
    this.shapeIndex = shapeIndex;
    this.color = color;
    this.size = size;
    this.rotation = rotation;
    this.alive = true;
    this.scale = 0; // scales up from 0
  }

  update() {
    // Scale up over ~23 frames (smooth entrance)
    if (this.scale < 1) {
      this.scale = Math.min(1, this.scale + 0.045);
    }
    // Gentle rotation drift
    this.rotation += 0.001;
  }

  draw(ctx) {
    const currentSize = this.size * this.scale;
    if (currentSize < 1) return;

    SACRED_SHAPES[this.shapeIndex](
      ctx,
      this.x,
      this.y,
      currentSize,
      this.color,
      0.85,
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

    // Clear canvas each frame (shapes are permanent, redrawn fresh)
    ctx.clearRect(0, 0, W, H);

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

    // Update and draw (shapes are permanent, never removed)
    for (const form of s.forms) {
      form.update();
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
