/**
 * groundingCompositions — layer-based mandala engine for 5-4-3-2-1 grounding
 *
 * Generates a single centred sacred geometry mandala composed of 15 layers.
 * Each tap reveals the next layer, building one coherent image piece by piece.
 * Three template styles (Celestial, Crystalline, Harmonic), randomly chosen.
 * Per-layer randomness ensures every session produces a structurally unique mandala.
 *
 * Outside -> inside construction mirrors the grounding journey:
 * scattered senses converging to centre, wholeness.
 *
 * Pure utility. No React.
 */

const PI = Math.PI;
const TAU = PI * 2;

// One colour per sense
const SENSE_COLORS = [
  'rgba(129,140,248,A)',  // SEE:   indigo-400
  'rgba(34,211,238,A)',   // TOUCH: cyan-400
  'rgba(167,139,250,A)',  // HEAR:  violet-400
  'rgba(253,186,116,A)',  // SMELL: amber-300
  'rgba(241,245,249,A)',  // TASTE: slate-100
];

// Inner layers glow brighter, drawing the eye to centre
const SENSE_ALPHA = [0.55, 0.6, 0.68, 0.75, 0.85];

// Sacred count pools
const COUNTS_ARC = [6, 8, 12];
const COUNTS_POLY = [3, 6, 8];
const COUNTS_STAR = [5, 6, 7, 8];
const COUNTS_RAY = [6, 8, 12];
const COUNTS_RING = [5, 6, 7, 8];

// -- Randomness helpers --
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function jitter(base, range) { return base + (Math.random() * 2 - 1) * range; }
function jR(base) { return jitter(base, 0.03); }          // radius jitter
function jA(base) { return jitter(base, 0.1); }           // arc-length jitter
function maybe(a, b) { return Math.random() < 0.5 ? a : b; } // coin flip

function c(template, alpha) {
  return template.replace('A', Math.max(0, alpha).toFixed(3));
}

// -- Drawing primitives (line widths bumped ~60%) --

function strokeCircle(ctx, cx, cy, r, color, alpha, lw = 1.2) {
  if (r < 1) return;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = lw; ctx.stroke();
}

function strokePolygon(ctx, cx, cy, r, sides, rot, color, alpha, lw = 1.3) {
  if (r < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * TAU;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = lw; ctx.stroke();
}

function strokeStar(ctx, cx, cy, outerR, innerR, points, rot, color, alpha, lw = 1.1) {
  ctx.beginPath();
  for (let i = 0; i <= points * 2; i++) {
    const a = rot + (i / (points * 2)) * TAU;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = lw; ctx.stroke();
}

function strokeRays(ctx, cx, cy, innerR, outerR, count, rot, color, alpha, lw = 0.8) {
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = lw;
  for (let i = 0; i < count; i++) {
    const a = rot + (i / count) * TAU;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR);
    ctx.lineTo(cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR);
    ctx.stroke();
  }
}

function strokeCirclesOnRing(ctx, cx, cy, ringR, count, circleR, rot, color, alpha, lw = 1.0) {
  for (let i = 0; i < count; i++) {
    const a = rot + (i / count) * TAU;
    strokeCircle(ctx, cx + Math.cos(a) * ringR, cy + Math.sin(a) * ringR, circleR, color, alpha, lw);
  }
}

function strokeArcs(ctx, cx, cy, r, count, arcLen, rot, color, alpha, lw = 1.1) {
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = lw;
  for (let i = 0; i < count; i++) {
    const startA = rot + (i / count) * TAU;
    ctx.beginPath(); ctx.arc(cx, cy, r, startA, startA + arcLen); ctx.stroke();
  }
}

function strokeDotsOnRing(ctx, cx, cy, ringR, count, dotR, rot, color, alpha) {
  ctx.fillStyle = c(color, alpha * 0.7);
  for (let i = 0; i < count; i++) {
    const a = rot + (i / count) * TAU;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * ringR, cy + Math.sin(a) * ringR, dotR, 0, TAU);
    ctx.fill();
  }
}

function fillGlow(ctx, cx, cy, r, color, alpha) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  grad.addColorStop(0, c(color, alpha * 0.9));
  grad.addColorStop(0.5, c(color, alpha * 0.3));
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
}

// -- Ring element: arcs or dots (coin-flip substitution) --
function ringElement(ctx, x, y, s, rFactor, count, arcLen, rot, col, a, lw) {
  if (Math.random() < 0.3) {
    strokeDotsOnRing(ctx, x, y, s * rFactor, count, s * 0.015, rot, col, a);
  } else {
    strokeArcs(ctx, x, y, s * rFactor, count, arcLen, rot, col, a, lw);
  }
}

// -- Templates --

function templateCelestial(rot) {
  const ac = () => pick(COUNTS_ARC);
  const rc = () => pick(COUNTS_RING);
  const sc = () => pick(COUNTS_STAR);
  return [
    // SEE (0-4): outer orbital rings and arcs
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.95), col, a, 1.6) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => ringElement(ctx, x, y, s, jR(0.88), ac(), jA(0.32), rot, col, a, 1.1) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.80), col, a, 1.2) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => {
      maybe(strokeDotsOnRing, strokeCirclesOnRing) === strokeDotsOnRing
        ? strokeDotsOnRing(ctx, x, y, s * jR(0.875), rc(), s * 0.015, rot + TAU / 16, col, a)
        : strokeCirclesOnRing(ctx, x, y, s * jR(0.875), rc(), s * 0.04, rot + TAU / 16, col, a * 0.7, 1.0);
    }},
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * jR(0.80), s * jR(0.95), pick(COUNTS_RAY), rot, col, a * 0.6, 0.8) },
    // TOUCH (5-8): hexagonal flower mid-ring
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.618), col, a, 1.2) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.618), pick(COUNTS_POLY), rot, col, a, 1.3) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * jR(0.618), rc(), s * jR(0.15), rot, col, a * 0.7, 1.0) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * jR(0.50), pick(COUNTS_ARC), jA(0.55), rot + PI / 6, col, a * 0.8, 1.1) },
    // HEAR (9-11): inner star structure
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.382), col, a, 1.2) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeStar(ctx, x, y, s * jR(0.382), s * jR(0.19), sc(), rot, col, a, 1.1) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * jR(0.12), s * jR(0.382), pick(COUNTS_RAY), rot + PI / 12, col, a * 0.6, 0.8) },
    // SMELL (12-13): seed of life details
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * jR(0.145), rc(), s * jR(0.09), rot, col, a, 1.0) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.145), col, a, 1.2) },
    // TASTE (14): centre glow
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * jR(0.10), col, a) },
  ];
}

function templateCrystalline(rot) {
  const pc = () => pick(COUNTS_POLY);
  const n8 = () => pick([6, 8]);
  return [
    // SEE (0-4): outer crystal frame
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.95), n8(), rot, col, a, 1.6) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.82), n8(), rot + TAU / 16, col, a, 1.2) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => {
      const sides = n8();
      ctx.strokeStyle = c(col, a * 0.7); ctx.lineWidth = 1.0;
      for (let i = 0; i < sides; i++) {
        const a1 = rot + (i / sides) * TAU;
        const a2 = rot + TAU / (sides * 2) + (i / sides) * TAU;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a1) * s * jR(0.95), y + Math.sin(a1) * s * jR(0.95));
        ctx.lineTo(x + Math.cos(a2) * s * jR(0.82), y + Math.sin(a2) * s * jR(0.82));
        ctx.stroke();
      }
    }},
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.95), col, a * 0.4, 0.8) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => ringElement(ctx, x, y, s, jR(0.88), n8(), jA(0.18), rot + TAU / 16, col, a * 0.7, 1.1) },
    // TOUCH (5-8): Star of David mid-structure
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.618), 3, rot - PI / 2, col, a, 1.3) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.618), 3, rot + PI / 2, col, a, 1.3) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.618), col, a * 0.8, 1.1) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * jR(0.618), s * jR(0.82), pick(COUNTS_RAY), rot, col, a * 0.5, 0.8) },
    // HEAR (9-11): inner dual triangles
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.382), pc(), rot - PI / 2, col, a, 1.3) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.382), pc(), rot + PI / 2, col, a, 1.3) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.382), col, a * 0.7, 1.1) },
    // SMELL (12-13): inner crystal
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.18), pick(COUNTS_POLY), rot, col, a, 1.3) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => {
      maybe(strokeDotsOnRing, strokeCirclesOnRing) === strokeDotsOnRing
        ? strokeDotsOnRing(ctx, x, y, s * jR(0.18), pick(COUNTS_RING), s * 0.02, rot, col, a)
        : strokeCirclesOnRing(ctx, x, y, s * jR(0.18), pick(COUNTS_RING), s * 0.03, rot, col, a, 1.0);
    }},
    // TASTE (14): centre glow
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * jR(0.10), col, a) },
  ];
}

function templateHarmonic(rot) {
  const rc = () => pick(COUNTS_RING);
  const ac = () => pick(COUNTS_ARC);
  return [
    // SEE (0-4): outer flower boundary with overlapping circles
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.95), col, a, 1.6) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * jR(0.85), ac(), jA(0.20), rot, col, a * 0.7, 1.1) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * jR(0.618), rc(), s * jR(0.30), rot, col, a * 0.55, 1.0) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.75), col, a * 0.5, 1.0) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => ringElement(ctx, x, y, s, jR(0.618), ac(), jA(0.55), rot + PI / 6, col, a * 0.6, 1.0) },
    // TOUCH (5-8): inner flower layer
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * jR(0.382), rc(), s * jR(0.20), rot + PI / 6, col, a * 0.6, 1.0) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.52), col, a * 0.7, 1.1) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.45), pick(COUNTS_POLY), rot, col, a * 0.6, 1.0) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.382), col, a, 1.2) },
    // HEAR (9-11): triangular harmony
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.33), pick(COUNTS_POLY), rot - PI / 2, col, a, 1.3) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * jR(0.33), pick(COUNTS_POLY), rot + PI / 2, col, a, 1.3) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.28), col, a * 0.8, 1.1) },
    // SMELL (12-13): Seed of Life centre
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * jR(0.13), rc(), s * jR(0.13), rot, col, a * 0.8, 1.2) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * jR(0.13), col, a, 1.2) },
    // TASTE (14): centre glow
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * jR(0.08), col, a) },
  ];
}

// -- Main composition generator --

export function generateComposition(width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.44;
  const rotation = Math.random() * TAU;

  const templates = [templateCelestial, templateCrystalline, templateHarmonic];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const layers = template(rotation);

  // Assign sense colours and target alphas
  for (const layer of layers) {
    layer.color = SENSE_COLORS[layer.sense];
    layer.targetAlpha = SENSE_ALPHA[layer.sense];
  }

  return { cx, cy, scale, layers };
}

// -- Play mode layer generator (free-form creative taps) --

export function generatePlayLayer() {
  const rot = Math.random() * TAU;
  const rFactor = jitter(0.5, 0.35);
  const color = pick(SENSE_COLORS);
  const primitives = [
    (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * rFactor, col, a, 1.2),
    (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * rFactor, pick(COUNTS_POLY), rot, col, a, 1.3),
    (ctx, x, y, s, col, a) => strokeStar(ctx, x, y, s * rFactor, s * rFactor * 0.5, pick(COUNTS_STAR), rot, col, a, 1.1),
    (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * rFactor, pick(COUNTS_ARC), jA(0.4), rot, col, a, 1.1),
    (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * rFactor, pick(COUNTS_RING), s * jR(0.08), rot, col, a, 1.0),
    (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * rFactor * 0.3, s * rFactor, pick(COUNTS_RAY), rot, col, a, 0.8),
  ];
  return { sense: Math.floor(Math.random() * 5), color, targetAlpha: jitter(0.6, 0.15), draw: pick(primitives) };
}
