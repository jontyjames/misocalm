/**
 * SanctuaryShapeData — constants and utilities for bioluminescent tree shapes
 *
 * Sacred numbers: MIN_ALPHA=0.618 (phi), SETTLE_AGE=233 (fib),
 * MAX_SHAPES=127 (Mersenne prime 2^7-1), MAX_DRIFT_SPARKLES=89 (fib).
 * Breath zones use phi-pair weights (0.618 primary, 0.382 secondary).
 * Double-stroke glow: halo at 0.146 (1/phi⁴), core RGB+26 (phi-scale step 4).
 */

const TAU = Math.PI * 2;

const MIN_ALPHA = 0.618;       // alpha floor — phi
const SETTLE_AGE = 233;        // frames to settle — Fibonacci
const MAX_SHAPES = 127;        // array cap — Mersenne prime (2^7-1)
const MAX_DRIFT_SPARKLES = 89; // ambient cap — Fibonacci

const SLATE_FALLBACK = { r: 148, g: 163, b: 184 };

// Warmth multipliers — phi-derived
const TYPE_WARMTH = {
  ROOT: 1.0,
  TRUNK: 1.146,   // 1 + 1/phi⁴ — SNK approved
  BRANCH: 1.236,  // 1 + 1/phi³
  LEAF: 1.382,    // 1 + phi complement
};

// How many palette colours each type reveals — consecutive primes
const TYPE_COLOUR_COUNT = { ROOT: 2, TRUNK: 3, BRANCH: 5, LEAF: 5 };

// Spawn zones (normalised Y: 0=top, 1=bottom)
const SHAPE_ZONES = {
  ROOT:   { minY: 0.70, maxY: 0.90 },  // 0.90 ≈ 1 - 1/phi⁵
  TRUNK:  { minY: 0.30, maxY: 0.75 },
  BRANCH: { minY: 0.090, maxY: 0.50 }, // 0.090 = 1/phi⁵ ceiling — SNK approved
  LEAF:   { minY: 0.090, maxY: 0.45 },
};

// Breath zones — [primary, secondary] per breath number
// Primary spawned at 0.618 probability, secondary at 0.382
const BREATH_ZONES = [
  null,                      // index 0 unused
  ['ROOT', null],            // breath 1: pure root
  ['ROOT', null],            // breath 2: pure root
  ['ROOT', 'TRUNK'],         // breath 3: root + trunk emerge
  ['TRUNK', 'ROOT'],         // breath 4: trunk rises
  ['TRUNK', 'BRANCH'],       // breath 5: trunk + branch
  ['BRANCH', 'TRUNK'],       // breath 6: branch grows
  ['BRANCH', 'LEAF'],        // breath 7: branch + leaf
  ['BRANCH', 'LEAF'],        // breath 8: upper growth
  ['LEAF', 'BRANCH'],        // breath 9: canopy fills
  ['LEAF', 'BRANCH'],        // breath 10: canopy fills
  ['LEAF', 'BRANCH'],        // breath 11: canopy completes
];

function pickTreeColor(palette, shapeType, amplitude, overrideCount) {
  if (!palette) return SLATE_FALLBACK;
  const count = overrideCount || TYPE_COLOUR_COUNT[shapeType] || 5;
  const available = palette.slice(0, count);
  const jitter = Math.random() * 0.618;
  const bias = amplitude * 0.618 + jitter * 0.382;
  const idx = Math.min(available.length - 1, Math.floor(bias * available.length));
  return available[idx];
}

function settleLife(age) {
  const settleT = Math.min(1, age / SETTLE_AGE);
  return MIN_ALPHA + (1 - MIN_ALPHA) * (1 - settleT * settleT);
}

function pickShapeType(breathNumber) {
  if (breathNumber > BREATH_ZONES.length - 1) {
    const types = ['ROOT', 'TRUNK', 'BRANCH', 'LEAF'];
    return types[Math.floor(Math.random() * types.length)];
  }
  const zone = BREATH_ZONES[breathNumber];
  if (!zone) return 'ROOT';
  const [primary, secondary] = zone;
  if (!secondary) return primary;
  return Math.random() < 0.618 ? primary : secondary;
}

// Double-stroke glow — call after ctx.beginPath() + path definition
function glowStroke(ctx, { r, g, b }, alpha, lineWidth) {
  ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.146})`;
  ctx.lineWidth = lineWidth * 5;
  ctx.stroke();
  ctx.strokeStyle = `rgba(${Math.min(255, r + 26)},${Math.min(255, g + 26)},${Math.min(255, b + 26)},${alpha})`;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

export {
  TAU, MIN_ALPHA, SETTLE_AGE, MAX_SHAPES, MAX_DRIFT_SPARKLES,
  SLATE_FALLBACK, TYPE_WARMTH, TYPE_COLOUR_COUNT, SHAPE_ZONES, BREATH_ZONES,
  pickTreeColor, settleLife, pickShapeType, glowStroke,
};
