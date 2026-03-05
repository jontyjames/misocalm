/**
 * SanctuaryShapes — shape classes for the Sanctuary Tree of Life
 *
 * Extracted from SanctuaryCanvas. Three shape types build the tree:
 * - FoundationArc: curved arcs at the base (roots)
 * - RisingPillar: vertical pillars with cap shapes (trunk)
 * - CanopyArc: overhead domes with radial spokes (crown)
 *
 * Persistence model: shapes bloom in, then settle to a ghostly alpha floor.
 * They never fully disappear — what you build stays.
 *
 * Sacred numbers: MIN_ALPHA=0.618 (phi), SETTLE_AGE=233 (fib),
 * MAX_SHAPES=127 (Mersenne prime 2^7-1), geoLife floor=0.618 (phi).
 */

const TAU = Math.PI * 2;

// Persistence constants
const MIN_ALPHA = 0.618;   // alpha floor — phi
const SETTLE_AGE = 233;    // frames to reach persistent state — Fibonacci
const MAX_SHAPES = 127;    // array cap — Mersenne prime (2^7-1)

// Slate fallback (used when treePalette is null)
const SLATE_FALLBACK = { r: 148, g: 163, b: 184 }; // slate-400

// How many palette colours each phase reveals — consecutive primes (2, 3, 5)
const PHASE_COLOUR_COUNT = { FOUNDATION: 2, RISING: 3, CANOPY: 5 };

// Alpha warmth multiplier builds across phases — phi-derived
const PHASE_WARMTH = { FOUNDATION: 1.0, RISING: 1.1, CANOPY: 1.236 };

function pickTreeColor(palette, phase, amplitude, overrideCount) {
  if (!palette) return SLATE_FALLBACK;
  const count = overrideCount || PHASE_COLOUR_COUNT[phase] || 5;
  const available = palette.slice(0, count);
  const jitter = Math.random() * 0.618;
  const bias = amplitude * 0.618 + jitter * 0.382;
  const idx = Math.min(available.length - 1, Math.floor(bias * available.length));
  return available[idx];
}

// Settle-based life: fast bloom fade, then holds at MIN_ALPHA forever
function settleLife(age) {
  const settleT = Math.min(1, age / SETTLE_AGE);
  return MIN_ALPHA + (1 - MIN_ALPHA) * (1 - settleT * settleT);
}

// Geometry life for CanopyArc: settles at phi instead of collapsing
function geoLife(age) {
  const settleT = Math.min(1, age / SETTLE_AGE);
  return 0.618 + 0.382 * (1 - settleT);
}

class FoundationArc {
  constructor(cx, cy, W, H, amplitude, palette, phase, colorCount) {
    this.age = 0;
    const spread = 0.3 + amplitude * 0.618;
    const baseY = H * (0.75 + Math.random() * 0.15);
    this.cx = cx + (Math.random() - 0.5) * W * spread;
    this.cy = baseY;
    this.radius = 42 + amplitude * 68;
    this.startAngle = Math.PI + (Math.random() - 0.5) * 0.618;
    this.endAngle = TAU + (Math.random() - 0.5) * 0.618;
    this.lineWidth = 0.5 + amplitude * 1.5;
    this.color = pickTreeColor(palette, phase, amplitude, colorCount);
    this.baseAlpha = (0.3 + amplitude * 0.382) * (PHASE_WARMTH[phase] || 1);
  }
  update() { this.age++; return true; }
  draw(ctx) {
    const life = settleLife(this.age);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const { r, g, b } = this.color;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, this.startAngle, this.endAngle);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineWidth = this.lineWidth * (0.5 + life * 0.5);
    ctx.stroke();
  }
}

class RisingPillar {
  constructor(cx, cy, W, H, amplitude, palette, phase, colorCount) {
    this.age = 0;
    const xSpread = 0.4 + amplitude * 0.3;
    this.x = cx + (Math.random() - 0.5) * W * xSpread;
    this.topY = H * (0.25 + (1 - amplitude) * 0.2);
    this.bottomY = H * (0.7 + Math.random() * 0.1);
    this.lineWidth = 0.3 + amplitude * 1.2;
    this.color = pickTreeColor(palette, phase, amplitude, colorCount);
    this.baseAlpha = (0.25 + amplitude * 0.382) * (PHASE_WARMTH[phase] || 1);
    this.capSize = 3 + amplitude * 5;
    this.capSides = [3, 5, 7][Math.floor(Math.random() * 3)];
  }
  update() { this.age++; return true; }
  draw(ctx, time) {
    const life = settleLife(this.age);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const { r, g, b } = this.color;
    const revealProgress = Math.min(1, this.age / 55);
    const currentTop = this.bottomY - (this.bottomY - this.topY) * revealProgress;
    ctx.beginPath();
    ctx.moveTo(this.x, this.bottomY);
    ctx.lineTo(this.x, currentTop);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
    if (revealProgress > 0.8) {
      const capAlpha = a * ((revealProgress - 0.8) / 0.2);
      ctx.beginPath();
      for (let i = 0; i <= this.capSides; i++) {
        const angle = (i / this.capSides) * TAU + time * 0.00618;
        const px = this.x + Math.cos(angle) * this.capSize * life;
        const py = currentTop + Math.sin(angle) * this.capSize * life;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},${capAlpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

class CanopyArc {
  constructor(cx, cy, W, H, amplitude, palette, phase, colorCount) {
    this.age = 0;
    this.cx = cx + (Math.random() - 0.5) * W * 0.3;
    this.cy = H * (0.15 + Math.random() * 0.2);
    this.radius = 68 + amplitude * 110;
    this.startAngle = (Math.random() - 0.5) * 0.618;
    this.endAngle = Math.PI + (Math.random() - 0.5) * 0.618;
    this.lineWidth = 0.3 + amplitude * 1;
    this.color = pickTreeColor(palette, phase, amplitude, colorCount);
    this.baseAlpha = (0.2 + amplitude * 0.382) * (PHASE_WARMTH[phase] || 1);
    this.spokeCount = [3, 5, 7][Math.floor(Math.random() * 3)];
    this.spokeLen = 16 + amplitude * 26;
  }
  update() { this.age++; return true; }
  draw(ctx, time) {
    const life = settleLife(this.age);
    const gl = geoLife(this.age);
    const a = this.baseAlpha * life;
    if (a < 0.005) return;
    const { r, g, b } = this.color;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius * (0.618 + gl * 0.382), this.startAngle, this.endAngle);
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
    if (this.age > 34) {
      const spokeAlpha = a * 0.618;
      for (let i = 0; i < this.spokeCount; i++) {
        const angle = this.startAngle + (i / (this.spokeCount - 1 || 1)) * (this.endAngle - this.startAngle);
        const innerR = this.radius * 0.618 * gl;
        const outerR = innerR + this.spokeLen * gl;
        ctx.beginPath();
        ctx.moveTo(this.cx + Math.cos(angle) * innerR, this.cy + Math.sin(angle) * innerR);
        ctx.lineTo(this.cx + Math.cos(angle) * outerR, this.cy + Math.sin(angle) * outerR);
        ctx.strokeStyle = `rgba(${r},${g},${b},${spokeAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

const FREE_PLAY_ZONES = ['FOUNDATION', 'RISING', 'CANOPY'];

function createShape(phase, cx, cy, W, H, amplitude, palette) {
  let effectivePhase = phase;
  let colorCount;

  if (phase === 'FREE_PLAY') {
    effectivePhase = FREE_PLAY_ZONES[Math.floor(Math.random() * 3)];
    colorCount = 5; // full palette in free play
  }

  if (effectivePhase === 'FOUNDATION') return new FoundationArc(cx, cy, W, H, amplitude, palette, effectivePhase, colorCount);
  if (effectivePhase === 'RISING') return new RisingPillar(cx, cy, W, H, amplitude, palette, effectivePhase, colorCount);
  return new CanopyArc(cx, cy, W, H, amplitude, palette, effectivePhase, colorCount);
}

export { createShape, MAX_SHAPES, PHASE_COLOUR_COUNT };
