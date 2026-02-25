/**
 * GroundingCanvas — full-screen sacred geometry renderer for grounding experience
 *
 * Renders a pre-computed composition. Receives a `composition` object (with positions
 * array) and `revealedCount` (how many positions to show). Connecting lines drawn
 * between nearby shapes using additive screen blending.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';
import { SACRED_SHAPES } from '@/lib/sacredShapes';
import { findConnections } from '@/lib/groundingCompositions';

function extractRgb(colorTemplate) {
  const match = colorTemplate.match(/rgba\((\d+),(\d+),(\d+),/);
  if (!match) return '150,150,150';
  return `${match[1]},${match[2]},${match[3]}`;
}

class SacredForm {
  constructor(x, y, shapeIndex, color, size, rotation) {
    this.x = x;
    this.y = y;
    this.shapeIndex = shapeIndex;
    this.color = color;
    this.size = size;
    this.rotation = rotation;
    this.scale = 0;
    this.alpha = 0;
    this.targetAlpha = 0.85;
  }

  update() {
    if (this.scale < 1) {
      this.scale = Math.min(1, this.scale + 0.035);
    }
    if (this.alpha < this.targetAlpha) {
      this.alpha = Math.min(this.targetAlpha, this.alpha + 0.025);
    }
    this.rotation += 0.0008;
  }

  draw(ctx, time) {
    const breathe = 1 + Math.sin(time * 0.003) * 0.015; // very subtle, barely perceptible
    const currentSize = this.size * this.scale * breathe;
    if (currentSize < 1 || this.alpha < 0.005) return;
    SACRED_SHAPES[this.shapeIndex](ctx, this.x, this.y, currentSize, this.color, this.alpha, this.rotation);
  }
}

export default function GroundingCanvas({ composition, revealedCount }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ forms: [], time: 0 });
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ composition, revealedCount });
  propsRef.current = { composition, revealedCount };
  const lastSpawnCountRef = useRef(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = dprRef.current;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const s = stateRef.current;
    const { composition: comp, revealedCount: revealed } = propsRef.current;
    s.time += 16; // ~60fps frame time

    ctx.clearRect(0, 0, W, H);

    // Spawn new forms when revealedCount increases
    if (comp && revealed > lastSpawnCountRef.current) {
      for (let i = lastSpawnCountRef.current; i < revealed; i++) {
        const p = comp.positions[i];
        if (!p) continue;
        s.forms.push(new SacredForm(p.x, p.y, p.shapeIndex, p.colorStr, p.size, p.rotation));
      }
      lastSpawnCountRef.current = revealed;
    }

    // Draw connecting lines (behind shapes)
    if (comp && revealed > 1) {
      const conns = findConnections(comp.positions, revealed);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const [fi, ti] of conns) {
        const from = comp.positions[fi];
        const to = comp.positions[ti];
        const rgb = extractRgb(from.colorStr);
        // Curved connection — control point offset perpendicular to midpoint
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const offset = dist * 0.15;
        // Perpendicular offset (alternates direction based on index sum)
        const sign = (fi + ti) % 2 === 0 ? 1 : -1;
        const nx = -dy / dist * offset * sign;
        const ny = dx / dist * offset * sign;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(mx + nx, my + ny, to.x, to.y);
        ctx.strokeStyle = `rgba(${rgb},0.12)`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Update and draw all forms
    for (const form of s.forms) {
      form.update();
      form.draw(ctx, s.time);
    }

    // Keystone glow for the final central shape
    if (revealed >= 15 && comp.positions.length >= 15) {
      const keystone = comp.positions[14];
      const glowBreath = 1 + Math.sin(s.time * 0.004) * 0.2;
      const grad = ctx.createRadialGradient(keystone.x, keystone.y, 0, keystone.x, keystone.y, 60 * glowBreath);
      grad.addColorStop(0, 'rgba(241,245,249,0.08)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(keystone.x, keystone.y, 60 * glowBreath, 0, Math.PI * 2);
      ctx.fill();
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
