/**
 * SanctuaryShapes — bioluminescent Tree of Life shape classes
 *
 * 5 shape types build an organic, glowing tree:
 * - RootCurve: organic bezier curves at the base
 * - TrunkLine: vertical lines with sine wobble
 * - BranchCurve: Fibonacci spiral-inspired arcs
 * - LeafOrnament: sacred geometric shapes at branch tips
 * - DriftSparkle: ambient floating particles
 *
 * Double-stroke glow: halo at 0.146 (1/phi⁴), core RGB+26.
 * Persistence: shapes bloom then settle to MIN_ALPHA=0.618 (phi).
 */

import {
  TAU, MIN_ALPHA, SETTLE_AGE, SLATE_FALLBACK,
  TYPE_WARMTH, SHAPE_ZONES,
  pickTreeColor, settleLife, glowStroke, pickShapeType,
} from './SanctuaryShapeData';

// Golden angle for natural branch distribution — 137.5° in radians
const GOLDEN_ANGLE = 2.399;

class RootCurve {
  constructor(cx, _cy, W, H, amplitude, palette, colorCount, warmth) {
    this.age = 0;
    const zone = SHAPE_ZONES.ROOT;
    const spread = 0.236 + amplitude * 0.618;
    this.x1 = cx + (Math.random() - 0.5) * W * spread;
    this.y1 = H * (zone.minY + Math.random() * (zone.maxY - zone.minY));
    const curveWidth = 42 + amplitude * 68;
    this.cpx = this.x1 + (Math.random() - 0.5) * curveWidth;
    this.cpy = this.y1 - (10 + amplitude * 26);
    this.x2 = this.x1 + (Math.random() - 0.5) * curveWidth * 0.618;
    this.y2 = this.y1 + (Math.random() - 0.5) * 16;
    this.lineWidth = 0.5 + amplitude * 1.618;
    this.color = pickTreeColor(palette, 'ROOT', amplitude, colorCount);
    this.baseAlpha = (0.236 + amplitude * 0.382) * warmth;
  }
  update() { this.age++; return true; }
  draw(ctx) {
    const a = this.baseAlpha * settleLife(this.age);
    if (a < 0.005) return;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.quadraticCurveTo(this.cpx, this.cpy, this.x2, this.y2);
    glowStroke(ctx, this.color, a, this.lineWidth * (0.5 + settleLife(this.age) * 0.5));
  }
}

class TrunkLine {
  constructor(cx, _cy, W, H, amplitude, palette, colorCount, warmth) {
    this.age = 0;
    const zone = SHAPE_ZONES.TRUNK;
    const xSpread = 0.236 + amplitude * 0.236;
    this.x = cx + (Math.random() - 0.5) * W * xSpread;
    this.topY = H * zone.minY + (1 - amplitude) * H * 0.146;
    this.bottomY = H * (zone.maxY - Math.random() * 0.090);
    this.wobbleAmp = 2 + amplitude * 5;
    this.wobbleFreq = 0.01 + Math.random() * 0.01;
    this.wobblePhase = Math.random() * TAU;
    this.lineWidth = 0.236 + amplitude * 1.236;
    this.color = pickTreeColor(palette, 'TRUNK', amplitude, colorCount);
    this.baseAlpha = (0.236 + amplitude * 0.382) * warmth;
  }
  update() { this.age++; return true; }
  draw(ctx, time) {
    const life = settleLife(this.age);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const revealProgress = Math.min(1, this.age / 55);
    const currentTop = this.bottomY - (this.bottomY - this.topY) * revealProgress;
    const segments = 13;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = this.bottomY - (this.bottomY - currentTop) * t;
      const wobble = Math.sin(y * this.wobbleFreq + time * 0.003 + this.wobblePhase) * this.wobbleAmp * t * life;
      i === 0 ? ctx.moveTo(this.x + wobble, y) : ctx.lineTo(this.x + wobble, y);
    }
    glowStroke(ctx, this.color, a, this.lineWidth);
  }
}

class BranchCurve {
  constructor(cx, _cy, W, H, amplitude, palette, colorCount, warmth) {
    this.age = 0;
    const zone = SHAPE_ZONES.BRANCH;
    const angle = Math.random() * TAU;
    const goldenOffset = Math.floor(Math.random() * 7) * GOLDEN_ANGLE;
    this.cx = cx + Math.cos(goldenOffset) * W * 0.146;
    this.cy = H * (zone.minY + Math.random() * (zone.maxY - zone.minY));
    const reach = 42 + amplitude * 68;
    const branchAngle = angle + goldenOffset;
    this.cpx = this.cx + Math.cos(branchAngle) * reach * 0.618;
    this.cpy = this.cy + Math.sin(branchAngle) * reach * 0.382 - reach * 0.236;
    this.ex = this.cx + Math.cos(branchAngle) * reach;
    this.ey = this.cy + Math.sin(branchAngle) * reach * 0.618 - reach * 0.382;
    this.lineWidth = 0.236 + amplitude * 1;
    this.color = pickTreeColor(palette, 'BRANCH', amplitude, colorCount);
    this.baseAlpha = (0.236 + amplitude * 0.382) * warmth;
  }
  update() { this.age++; return true; }
  draw(ctx) {
    const life = settleLife(this.age);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const reveal = Math.min(1, this.age / 42);
    ctx.beginPath();
    ctx.moveTo(this.cx, this.cy);
    const mx = this.cx + (this.cpx - this.cx) * reveal;
    const my = this.cy + (this.cpy - this.cy) * reveal;
    const ex = this.cx + (this.ex - this.cx) * reveal;
    const ey = this.cy + (this.ey - this.cy) * reveal;
    ctx.quadraticCurveTo(mx, my, ex, ey);
    glowStroke(ctx, this.color, a, this.lineWidth);
  }
}

class LeafOrnament {
  constructor(cx, _cy, W, H, amplitude, palette, colorCount, warmth) {
    this.age = 0;
    const zone = SHAPE_ZONES.LEAF;
    this.cx = cx + (Math.random() - 0.5) * W * 0.618;
    this.cy = H * (zone.minY + Math.random() * (zone.maxY - zone.minY));
    this.sides = [3, 5, 7][Math.floor(Math.random() * 3)];
    this.radius = 3 + amplitude * 7;
    this.rotation = Math.random() * TAU;
    this.rotSpeed = (Math.random() - 0.5) * 0.003;
    this.color = pickTreeColor(palette, 'LEAF', amplitude, colorCount);
    this.baseAlpha = (0.236 + amplitude * 0.382) * warmth;
    this.lineWidth = 0.5 + amplitude * 0.5;
  }
  update() { this.age++; return true; }
  draw(ctx, time) {
    const life = settleLife(this.age);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const r = this.radius * Math.min(1, this.age / 34);
    const rot = this.rotation + time * this.rotSpeed;
    ctx.beginPath();
    for (let i = 0; i <= this.sides; i++) {
      const angle = (i / this.sides) * TAU + rot;
      const px = this.cx + Math.cos(angle) * r * life;
      const py = this.cy + Math.sin(angle) * r * life;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    glowStroke(ctx, this.color, a, this.lineWidth);
    // Core glow dot
    if (r > 2) {
      const { r: cr, g: cg, b: cb } = this.color;
      const dotR = r * 0.382;
      const grad = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, dotR);
      grad.addColorStop(0, `rgba(${Math.min(255, cr + 26)},${Math.min(255, cg + 26)},${Math.min(255, cb + 26)},${a * 0.618})`);
      grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, dotR, 0, TAU);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }
}

class DriftSparkle {
  constructor(W, H, palette) {
    this.age = 0;
    this.x = W * (0.146 + Math.random() * 0.708);
    this.y = H * (0.090 + Math.random() * 0.764);
    this.vx = (Math.random() - 0.5) * 0.146;
    this.vy = -(0.056 + Math.random() * 0.090);
    this.maxRadius = 1 + Math.random() * 2;
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
    const alpha = Math.max(0, brightness) * 0.382;
    const radius = this.maxRadius * Math.max(0, brightness);
    if (radius < 0.236) return;
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

function createTreeShape(shapeType, cx, cy, W, H, amplitude, palette) {
  const warmth = TYPE_WARMTH[shapeType] || 1;
  const colorCount = null; // use type defaults
  switch (shapeType) {
    case 'TRUNK': return new TrunkLine(cx, cy, W, H, amplitude, palette, colorCount, warmth);
    case 'BRANCH': return new BranchCurve(cx, cy, W, H, amplitude, palette, colorCount, warmth);
    case 'LEAF': return new LeafOrnament(cx, cy, W, H, amplitude, palette, colorCount, warmth);
    default: return new RootCurve(cx, cy, W, H, amplitude, palette, colorCount, warmth);
  }
}

export { createTreeShape, DriftSparkle };
