/**
 * SanctuaryShapes — glowing dot renderer + ambient sparkles
 *
 * Each tree dot is a soft radial gradient — a point of bioluminescent light.
 * No lines, no edges. The tree emerges from density and glow.
 *
 * DriftSparkle provides ambient floating particles after breath 5.
 *
 * Sacred numbers: gradient stops at phi (0.382, 0.618).
 */

import {
  TAU, SETTLE_AGE, SLATE_FALLBACK,
} from './SanctuaryShapeData';

/**
 * Draw a single glowing dot — soft radial gradient.
 */
function drawDot(ctx, x, y, size, color, alpha) {
  if (alpha < 0.005 || size < 0.3) return;
  const { r, g, b } = color;
  const radius = size * 3; // glow extends beyond core

  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  // Bright core
  grad.addColorStop(0, `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},${alpha * 0.7})`);
  // Mid glow
  grad.addColorStop(0.382, `rgba(${r},${g},${b},${alpha * 0.35})`);
  // Outer halo
  grad.addColorStop(0.618, `rgba(${r},${g},${b},${alpha * 0.12})`);
  // Fade out
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fillStyle = grad;
  ctx.fill();
}

class DriftSparkle {
  constructor(W, H, palette) {
    this.age = 0;
    this.x = W * (0.1 + Math.random() * 0.8);
    this.y = H * (0.05 + Math.random() * 0.8);
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = -(0.05 + Math.random() * 0.1);
    this.maxRadius = 1 + Math.random() * 2.5;
    this.color = palette ? palette[Math.floor(Math.random() * palette.length)] : SLATE_FALLBACK;
    this.life = SETTLE_AGE;
  }
  update() {
    this.age++;
    this.x += this.vx;
    this.y += this.vy;
    return this.age < this.life;
  }
  draw(ctx) {
    const t = this.age / this.life;
    const brightness = t < 0.382 ? t / 0.382 : (1 - t) / 0.618;
    const alpha = Math.max(0, brightness) * 0.4;
    const radius = this.maxRadius * Math.max(0, brightness);
    if (radius < 0.3) return;
    const { r, g, b } = this.color;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
    grad.addColorStop(0, `rgba(${Math.min(255, r + 26)},${Math.min(255, g + 26)},${Math.min(255, b + 26)},${alpha})`);
    grad.addColorStop(0.618, `rgba(${r},${g},${b},${alpha * 0.382})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, TAU);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

export { drawDot, DriftSparkle };
