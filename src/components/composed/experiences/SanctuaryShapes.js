/**
 * SanctuaryShapes — structure-anchored bioluminescent tree shape classes
 *
 * 4 tree classes + 1 ambient:
 * - TreeRoot: bezier curve from trunk base outward/downward
 * - TreeTrunk: bezier segment along the trunk spine, grows upward
 * - TreeBranch: bezier curve from branch point outward
 * - TreeLeaf: sacred geometric shape at branch/sub-branch tip
 * - DriftSparkle: ambient floating particles
 *
 * Every shape takes its position from the pre-generated tree skeleton.
 * Double-stroke glow: halo at 0.146 (1/phi^4), core RGB+26.
 * Shapes bloom then settle to MIN_ALPHA=0.618 (phi).
 *
 * Sacred numbers: SETTLE_AGE=233 (fib), leaf bloom=34 frames (fib),
 * branch reveal=55 frames (fib), trunk reveal=89 frames (fib).
 */

import {
  TAU, MIN_ALPHA, SETTLE_AGE, SLATE_FALLBACK,
  pickTreeColor, settleLife, glowStroke,
} from './SanctuaryShapeData';

class TreeRoot {
  constructor(skeleton, index, palette) {
    this.age = 0;
    const def = skeleton.roots[index];
    if (!def) return;
    this.x0 = def.x0; this.y0 = def.y0;
    this.cpx = def.cpx; this.cpy = def.cpy;
    this.x1 = def.x1; this.y1 = def.y1;
    this.lineWidth = def.lineWidth;
    this.color = pickTreeColor(palette, 'ROOT');
    this.valid = true;
  }
  update() { this.age++; return true; }
  draw(ctx) {
    if (!this.valid) return;
    const life = settleLife(this.age);
    const a = 0.8 * life;
    if (a < 0.005) return;
    const reveal = Math.min(1, this.age / 55);
    ctx.beginPath();
    ctx.moveTo(this.x0, this.y0);
    const mx = this.x0 + (this.cpx - this.x0) * reveal;
    const my = this.y0 + (this.cpy - this.y0) * reveal;
    const ex = this.x0 + (this.x1 - this.x0) * reveal;
    const ey = this.y0 + (this.y1 - this.y0) * reveal;
    ctx.quadraticCurveTo(mx, my, ex, ey);
    glowStroke(ctx, this.color, a, this.lineWidth * (0.5 + life * 0.5));
  }
}

class TreeTrunk {
  constructor(skeleton, segIndex, palette) {
    this.age = 0;
    const seg = skeleton.trunkSegments[segIndex];
    if (!seg) return;
    this.trunkPoint = skeleton.trunkPoint;
    this.t0 = seg.t0;
    this.t1 = seg.t1;
    this.lineWidth = seg.lineWidth;
    this.color = pickTreeColor(palette, 'TRUNK');
    this.valid = true;
  }
  update() { this.age++; return true; }
  draw(ctx) {
    if (!this.valid) return;
    const life = settleLife(this.age);
    const a = 0.85 * life;
    if (a < 0.005) return;
    const reveal = Math.min(1, this.age / 89);
    const steps = 8;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const localT = i / steps;
      const visibleT = localT * reveal;
      const globalT = this.t0 + (this.t1 - this.t0) * visibleT;
      const p = this.trunkPoint(globalT);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    glowStroke(ctx, this.color, a, this.lineWidth * (0.6 + life * 0.4));
  }
}

class TreeBranch {
  constructor(skeleton, index, palette, isSub) {
    this.age = 0;
    const arr = isSub ? skeleton.subBranches : skeleton.branches;
    const def = arr[index];
    if (!def) return;
    this.x0 = def.x0; this.y0 = def.y0;
    this.cpx = def.cpx; this.cpy = def.cpy;
    this.x1 = def.x1; this.y1 = def.y1;
    this.lineWidth = def.lineWidth;
    this.isSub = isSub;
    this.color = pickTreeColor(palette, 'BRANCH');
    this.valid = true;
  }
  update() { this.age++; return true; }
  draw(ctx) {
    if (!this.valid) return;
    const life = settleLife(this.age);
    const a = (this.isSub ? 0.7 : 0.8) * life;
    if (a < 0.005) return;
    const reveal = Math.min(1, this.age / 55);
    ctx.beginPath();
    ctx.moveTo(this.x0, this.y0);
    const mx = this.x0 + (this.cpx - this.x0) * reveal;
    const my = this.y0 + (this.cpy - this.y0) * reveal;
    const ex = this.x0 + (this.x1 - this.x0) * reveal;
    const ey = this.y0 + (this.y1 - this.y0) * reveal;
    ctx.quadraticCurveTo(mx, my, ex, ey);
    glowStroke(ctx, this.color, a, this.lineWidth * (0.5 + life * 0.5));
  }
}

class TreeLeaf {
  constructor(skeleton, index, palette) {
    this.age = 0;
    const def = skeleton.leaves[index];
    if (!def) return;
    this.cx = def.cx; this.cy = def.cy;
    this.sides = def.sides;
    this.radius = def.radius;
    this.rotation = def.rotation;
    this.rotSpeed = def.rotSpeed;
    this.color = pickTreeColor(palette, 'LEAF');
    this.lineWidth = 0.8;
    this.valid = true;
  }
  update() { this.age++; return true; }
  draw(ctx, time) {
    if (!this.valid) return;
    const life = settleLife(this.age);
    const a = 0.75 * life;
    if (a < 0.005) return;
    const bloom = Math.min(1, this.age / 34);
    const r = this.radius * bloom;
    const rot = this.rotation + (time || 0) * this.rotSpeed;

    // Sacred geometric shape
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

export { TreeRoot, TreeTrunk, TreeBranch, TreeLeaf, DriftSparkle };
