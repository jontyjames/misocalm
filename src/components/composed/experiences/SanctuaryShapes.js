/**
 * SanctuaryShapes — bioluminescent tree rendering
 *
 * Multi-layer glow drawing: each branch segment is drawn 4 times
 * at decreasing widths and increasing brightness, creating a
 * natural bioluminescent halo effect.
 *
 * DriftSparkle provides ambient floating particles.
 *
 * Sacred numbers: SETTLE_AGE=233 (fib), gradient stops at phi.
 */

import {
  TAU, MIN_ALPHA, SETTLE_AGE, SLATE_FALLBACK,
  settleLife, pickTreeColor,
} from './SanctuaryShapeData';

/**
 * Draw a single branch segment with multi-layer glow.
 * 4 passes: wide faint outer → medium → bright core → white-hot center.
 */
function drawGlowSegment(ctx, seg, color, alpha) {
  const { r, g, b } = color;
  const { x0, y0, cpx, cpy, x1, y1, width } = seg;

  const layers = [
    { widthMul: 5,   alphaMul: 0.04 },  // wide outer halo
    { widthMul: 3,   alphaMul: 0.08 },  // medium glow
    { widthMul: 1.5, alphaMul: 0.2  },  // inner glow
    { widthMul: 1,   alphaMul: 0.5  },  // bright core
  ];

  ctx.lineCap = 'round';

  for (const layer of layers) {
    const a = alpha * layer.alphaMul;
    if (a < 0.003) continue;

    // Brighten core layers
    const brighten = layer.alphaMul > 0.3 ? 30 : layer.alphaMul > 0.1 ? 15 : 0;
    const cr = Math.min(255, r + brighten);
    const cg = Math.min(255, g + brighten);
    const cb = Math.min(255, b + brighten);

    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${a})`;
    ctx.lineWidth = width * layer.widthMul;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cpx, cpy, x1, y1);
    ctx.stroke();
  }

  // White-hot center for thick branches
  if (width > 2 && alpha > 0.3) {
    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.15})`;
    ctx.lineWidth = width * 0.3;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cpx, cpy, x1, y1);
    ctx.stroke();
  }
}

/**
 * Draw a leaf glow at a branch tip — soft radial burst.
 */
function drawLeafGlow(ctx, x, y, radius, color, alpha) {
  const { r, g, b } = color;
  if (alpha < 0.01 || radius < 1) return;

  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},${alpha * 0.5})`);
  grad.addColorStop(0.382, `rgba(${r},${g},${b},${alpha * 0.25})`);
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

export { drawGlowSegment, drawLeafGlow, DriftSparkle };
