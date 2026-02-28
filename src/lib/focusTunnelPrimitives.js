/**
 * focusTunnelPrimitives.js — drawing primitives and entity classes for Focus tunnel
 *
 * Pure canvas helpers: shape drawing, ring/inscription/ripple/beam classes.
 * All sacred numbers documented. No React.
 *
 * Sacred numbers:
 * - Ring maxAge: 377 (fib-flow)
 * - Inscription maxLife: 610 (fib-ease)
 * - Ripple/beam life: 23 frames (prime)
 * - Neon glow alpha: 1/13, 1/5 (prime fractions)
 * - Zone thresholds: 1/PHI^3, 1/PHI^2, 1/PHI (golden reciprocals)
 * - Polygon sides: [3, 5, 7] (prime)
 * - Star points: [5, 7] (prime)
 * - Mark types: 7 (prime)
 *
 * Companion file: focusTunnelRenderer.js (state management + render loop)
 */

import { PHI } from './constants';

export const TAU = Math.PI * 2;

// Phi-derived depth thresholds (golden ratio reciprocals)
export const PHI_INV  = 1 / PHI;             // 0.618
export const PHI_INV2 = 1 / (PHI * PHI);     // 0.382
export const PHI_INV3 = 1 / (PHI * PHI * PHI); // 0.236

// Solfeggio colour depth zones
const ZONE_CYAN   = { r: 34, g: 211, b: 238 }; // back (741Hz — clarity)
const ZONE_INDIGO = { r: 129, g: 140, b: 248 }; // middle (528Hz — transformation)
const ZONE_VIOLET = { r: 167, g: 139, b: 250 }; // front (852Hz — depth)

// Prime polygon sides for tunnel rings
export const RING_SIDES = [3, 5, 7];
// Star point options (prime)
export const STAR_POINTS = [5, 7];

// 7 sacred inscription mark types (prime count)
export const MARK_TYPES = ['dot', 'circle', 'line', 'angle', 'triangle', 'arc', 'diamond'];

export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// Depth-zone colour: boundaries at phi reciprocals
function zoneColour(t) {
  if (t < PHI_INV3) return ZONE_CYAN;    // back zone (< 0.236)
  if (t < PHI_INV2) return ZONE_INDIGO;  // middle zone (< 0.382)
  return ZONE_VIOLET;                     // front zone
}

function rgba(col, a) {
  return `rgba(${col.r},${col.g},${col.b},${Math.max(0, a).toFixed(3)})`;
}

// ─── Drawing primitives ────────────────────────────────────────────

function strokePoly(ctx, cx, cy, r, sides, rot, colour, alpha, lw) {
  if (r < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * TAU;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = rgba(colour, alpha);
  ctx.lineWidth = lw || 1.3;
  ctx.stroke();
}

function strokeStar(ctx, cx, cy, oR, iR, pts, rot, colour, alpha, lw) {
  if (oR < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= pts * 2; i++) {
    const a = rot + (i / (pts * 2)) * TAU;
    const r = i % 2 === 0 ? oR : iR;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = rgba(colour, alpha);
  ctx.lineWidth = lw || 1.1;
  ctx.stroke();
}

function strokeNestedPoly(ctx, cx, cy, r, sides, rot, colour, alpha, lw) {
  strokePoly(ctx, cx, cy, r, sides, rot, colour, alpha, lw);
  strokePoly(ctx, cx, cy, r / PHI, sides, rot + TAU / (sides * 2), colour, alpha / PHI, lw);
}

// Shape wave types: polygon, star, nested polygon (cycle every 5 rings)
export function createRingDrawFn(waveType, sides) {
  switch (waveType) {
    case 0: return (ctx, cx, cy, r, rot, col, a, lw) => strokePoly(ctx, cx, cy, r, sides, rot, col, a, lw);
    case 1: return (ctx, cx, cy, r, rot, col, a, lw) => strokeStar(ctx, cx, cy, r, r * 0.5, sides, rot, col, a, lw);
    case 2: return (ctx, cx, cy, r, rot, col, a, lw) => strokeNestedPoly(ctx, cx, cy, r, sides, rot, col, a, lw);
    default: return (ctx, cx, cy, r, rot, col, a, lw) => strokePoly(ctx, cx, cy, r, sides, rot, col, a, lw);
  }
}

// ─── Tunnel Ring ───────────────────────────────────────────────────

export class TunnelRing {
  constructor(index, waveType, waveSides) {
    this.age = 0;
    this.maxAge = 377; // fib-flow frames (~6.3s at 60fps)
    this.alive = true;
    this.index = index;
    this.fn = createRingDrawFn(waveType, waveSides);
    this.sides = waveSides;
  }

  update(surgeMultiplier) {
    this.age += surgeMultiplier;
    if (this.age > this.maxAge) this.alive = false;
  }

  draw(ctx, cx, cy, maxR, globalRot) {
    if (!this.alive) return;
    const t = this.age / this.maxAge;
    const scale = easeOutCubic(t); // nervous-system-congruent deceleration
    const r = 6 + scale * maxR;    // phi-0 start, easeOutCubic expansion

    // Alpha: phi-derived thresholds. Fade to 0 before easeOutCubic stalls.
    //   0 → 1/PHI^3 (0.236):  fade in  0.1 → 0.4
    //   1/PHI^3 → 1/PHI^2:    peak     0.4
    //   1/PHI^2 → 1/PHI:      fade out 0.4 → 0
    let alpha;
    if (t < PHI_INV3) {
      alpha = 0.1 + (t / PHI_INV3) * 0.3;
    } else if (t < PHI_INV2) {
      alpha = 0.4;
    } else if (t < PHI_INV) {
      alpha = 0.4 * (1 - (t - PHI_INV2) / (PHI_INV - PHI_INV2));
    } else {
      alpha = 0;
    }

    if (alpha < 0.005) return;

    const colour = zoneColour(t);

    // Neon wall glow: three-layer stroke
    // Outer glow (wall): lineWidth 16 / phi-3, alpha / 13 (prime fraction)
    this.fn(ctx, cx, cy, r, globalRot, colour, alpha / 13, 16);
    // Inner glow (neon): lineWidth 6 / phi-0, alpha / 5 (prime fraction)
    this.fn(ctx, cx, cy, r, globalRot, colour, alpha / 5, 6);
    // Core line (structure): crisp, default lineWidth
    this.fn(ctx, cx, cy, r, globalRot, colour, alpha);
  }
}

// ─── Sacred Inscription Mark ───────────────────────────────────────

export class InscriptionMark {
  constructor(ringAge, ringMaxAge, angle, markType) {
    this.birthAge = ringAge;
    this.ringMaxAge = ringMaxAge;
    this.angle = angle;
    this.type = markType;
    this.life = 0;
    this.maxLife = 610; // fib-ease frames (~10s)
    this.alive = true;
    this.size = 6 + Math.random() * 4; // phi-0 to phi-1
  }

  // Constant pace (no surge — nervous system safety)
  update() {
    this.life++;
    if (this.life > this.maxLife) this.alive = false;
  }

  draw(ctx, cx, cy, maxR) {
    if (!this.alive) return;
    const tunnelAge = this.birthAge + this.life;
    const t = Math.min(tunnelAge / this.ringMaxAge, 1);
    const scale = easeOutCubic(t); // matches ring expansion — no drift
    const ringR = 6 + scale * maxR;

    const lifeFrac = this.life / this.maxLife;
    const alpha = lifeFrac < 0.1
      ? 0.6 * (lifeFrac / 0.1)
      : lifeFrac < 0.3
        ? 0.6
        : 0.6 - (lifeFrac - 0.3) / 0.7 * 0.5;

    if (alpha < 0.005 || t >= 1) return;

    const colour = zoneColour(t);
    const mx = cx + Math.cos(this.angle) * ringR;
    const my = cy + Math.sin(this.angle) * ringR;
    const s = this.size;

    ctx.strokeStyle = rgba(colour, alpha);
    ctx.fillStyle = rgba(colour, alpha * 0.5);
    ctx.lineWidth = 0.8;

    switch (this.type) {
      case 'dot':
        ctx.beginPath(); ctx.arc(mx, my, s * 0.4, 0, TAU); ctx.fill();
        break;
      case 'circle':
        ctx.beginPath(); ctx.arc(mx, my, s * 0.5, 0, TAU); ctx.stroke();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(mx - s * 0.4, my); ctx.lineTo(mx + s * 0.4, my);
        ctx.stroke();
        break;
      case 'angle':
        ctx.beginPath();
        ctx.moveTo(mx - s * 0.3, my - s * 0.3);
        ctx.lineTo(mx, my + s * 0.3);
        ctx.lineTo(mx + s * 0.3, my - s * 0.3);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        for (let i = 0; i <= 3; i++) {
          const a = this.angle + (i / 3) * TAU;
          const px = mx + Math.cos(a) * s * 0.4;
          const py = my + Math.sin(a) * s * 0.4;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        break;
      case 'arc':
        ctx.beginPath();
        ctx.arc(mx, my, s * 0.5, 0, Math.PI * 1.2);
        ctx.stroke();
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(mx, my - s * 0.4);
        ctx.lineTo(mx + s * 0.3, my);
        ctx.lineTo(mx, my + s * 0.4);
        ctx.lineTo(mx - s * 0.3, my);
        ctx.closePath();
        ctx.stroke();
        break;
    }
  }
}

// ─── Capture Ripple ────────────────────────────────────────────────

export class CaptureRipple {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.age = 0;
    this.alive = true;
  }

  // Constant pace (no surge — keeps visual calm)
  update() { this.age++; if (this.age > 23) this.alive = false; }

  draw(ctx) {
    if (!this.alive) return;
    const t = this.age / 23;
    const r = t * 68; // phi-6
    const a = 0.35 * (1 - t);
    if (a < 0.005) return;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
    g.addColorStop(0, `rgba(34,211,238,${a})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, TAU); ctx.fill();
  }
}

// ─── Play Beam (free play) ─────────────────────────────────────────

export class PlayBeam {
  constructor(x, y) { this.x = x; this.y = y; this.age = 0; this.alive = true; }

  // Constant pace (no surge)
  update() { this.age++; if (this.age > 23) this.alive = false; }

  draw(ctx, cx, cy) {
    const a = this.alive ? 0.35 * (1 - this.age / 23) : 0;
    if (a < 0.005) return;
    ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(cx, cy);
    ctx.strokeStyle = `rgba(34,211,238,${a})`; ctx.lineWidth = 1; ctx.stroke();
  }
}
