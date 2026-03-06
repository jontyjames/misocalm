/**
 * SanctuaryShapes — Tendril, BreathRing, DriftSparkle
 *
 * Living Light: bioluminescent organism made of wobbling bezier tendrils,
 * expanding breath rings, and ambient drift sparkles.
 *
 * Tendril: quadratic bezier with sine-wave wobble, 3-layer glow (halo,
 * core, tip). Tracks tipX/tipY for branching.
 *
 * BreathRing: expanding ring with inner halo, 144-frame life (Fibonacci).
 *
 * Sacred numbers: bloom-in 34 (fib), ring life 144 (fib),
 * glow stops at phi (0.382, 0.618), sparkle life 233 (fib).
 */

import { TAU, SLATE_FALLBACK, BLOOM_FRAMES } from './SanctuaryShapeData';

const SETTLE_AGE = 233; // Fibonacci — DriftSparkle lifespan

class Tendril {
  constructor(config) {
    this.startX = config.startX;
    this.startY = config.startY;
    this.angle = config.angle;
    this.maxLength = config.maxLength;
    this.color = config.color;
    this.wobblePhase = config.wobblePhase;
    this.wobbleSpeed = config.wobbleSpeed;
    this.wobbleAmp = config.wobbleAmp;
    this.age = 0;
    this.tipX = this.startX;
    this.tipY = this.startY;
    this.width = 1 + Math.random() * 1.5; // 1-2.5px core
    // Bezier state (set in update)
    this.cpX = this.startX;
    this.cpY = this.startY;
    this.endX = this.startX;
    this.endY = this.startY;
  }

  update(time) {
    this.age++;

    // Ease-out growth over ~120 frames (~2s at 60fps)
    const growT = Math.min(1, this.age / 120);
    const easeOut = 1 - (1 - growT) * (1 - growT);
    const currentLength = this.maxLength * easeOut;

    // Endpoint along angle
    const endX = this.startX + Math.cos(this.angle) * currentLength;
    const endY = this.startY + Math.sin(this.angle) * currentLength;

    // Wobble control point perpendicular to curve direction
    const perpAngle = this.angle + Math.PI / 2;
    const wobbleOffset = Math.sin(time * this.wobbleSpeed + this.wobblePhase) * this.wobbleAmp;
    const midX = (this.startX + endX) / 2;
    const midY = (this.startY + endY) / 2;

    this.cpX = midX + Math.cos(perpAngle) * wobbleOffset;
    this.cpY = midY + Math.sin(perpAngle) * wobbleOffset;
    this.endX = endX;
    this.endY = endY;
    this.tipX = endX;
    this.tipY = endY;
  }

  draw(ctx, breatheScale) {
    const { r, g, b } = this.color;
    const bloomT = Math.min(1, this.age / BLOOM_FRAMES);
    const alpha = bloomT * breatheScale;
    if (alpha < 0.005) return;

    // Layer 1: Wide dim halo stroke (5x width, ~15% alpha)
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.quadraticCurveTo(this.cpX, this.cpY, this.endX, this.endY);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.15})`;
    ctx.lineWidth = this.width * 5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Layer 2: Core stroke (1-2.5px, ~35% alpha)
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.quadraticCurveTo(this.cpX, this.cpY, this.endX, this.endY);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.35})`;
    ctx.lineWidth = this.width;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Layer 3: Tip glow — radial gradient at endpoint
    const tipRadius = 3 + this.width * 2;
    const tipGrad = ctx.createRadialGradient(
      this.tipX, this.tipY, 0,
      this.tipX, this.tipY, tipRadius,
    );
    const cR = Math.min(255, r + 40);
    const cG = Math.min(255, g + 40);
    const cB = Math.min(255, b + 40);
    tipGrad.addColorStop(0, `rgba(${cR},${cG},${cB},${alpha * 0.5})`);
    tipGrad.addColorStop(0.382, `rgba(${r},${g},${b},${alpha * 0.25})`);
    tipGrad.addColorStop(0.618, `rgba(${r},${g},${b},${alpha * 0.08})`);
    tipGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.tipX, this.tipY, tipRadius, 0, TAU);
    ctx.fillStyle = tipGrad;
    ctx.fill();
  }
}

class BreathRing {
  constructor(cx, cy, color) {
    this.cx = cx;
    this.cy = cy;
    this.color = color;
    this.age = 0;
    this.life = 144; // Fibonacci
    this.startRadius = 6; // ~phi-1
    this.endRadius = 26 + Math.random() * 84; // 26-110
  }

  update() {
    this.age++;
    return this.age < this.life;
  }

  draw(ctx, breatheScale) {
    const { r, g, b } = this.color;
    const t = this.age / this.life;

    // Ease-out expansion
    const easeT = 1 - (1 - t) * (1 - t);
    const radius = this.startRadius + (this.endRadius - this.startRadius) * easeT;

    // Quadratic fade
    const fadeAlpha = (1 - t) * (1 - t);
    const alpha = fadeAlpha * breatheScale * 0.3;
    if (alpha < 0.005) return;

    // Ring stroke
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, radius, 0, TAU);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 1.5 * (1 - t * 0.5);
    ctx.stroke();

    // Inner glow halo band
    const bandWidth = 8 * (1 - t * 0.618);
    if (bandWidth > 1) {
      const innerR = Math.max(0, radius - bandWidth);
      const outerR = radius + bandWidth;
      const haloGrad = ctx.createRadialGradient(
        this.cx, this.cy, innerR,
        this.cx, this.cy, outerR,
      );
      haloGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      haloGrad.addColorStop(0.382, `rgba(${r},${g},${b},${alpha * 0.5})`);
      haloGrad.addColorStop(0.618, `rgba(${r},${g},${b},${alpha * 0.3})`);
      haloGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, outerR, 0, TAU);
      ctx.fillStyle = haloGrad;
      ctx.fill();
    }
  }
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

export { Tendril, BreathRing, DriftSparkle };
