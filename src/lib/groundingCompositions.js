/**
 * groundingCompositions — layer-based mandala engine for 5-4-3-2-1 grounding
 *
 * Generates a single centred sacred geometry mandala composed of 15 layers.
 * Each tap reveals the next layer, building one coherent image piece by piece.
 * Three template styles (Celestial, Crystalline, Harmonic), randomly chosen.
 * Per-layer randomness ensures every session produces a structurally unique mandala.
 *
 * IMPORTANT: All randomness is computed at generation time, NOT inside draw()
 * functions. Draw functions run 60fps — any Math.random() inside them causes
 * the mandala to vibrate/flicker wildly.
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

// -- Randomness helpers (ONLY call at generation time, never inside draw) --
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function jitter(base, range) { return base + (Math.random() * 2 - 1) * range; }
function jR(base) { return jitter(base, 0.03); }
function jA(base) { return jitter(base, 0.1); }

function c(template, alpha) {
  return template.replace('A', Math.max(0, alpha).toFixed(3));
}

// -- Drawing primitives --

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

// -- Templates (all random values pre-computed, closures capture fixed numbers) --

function templateCelestial(rot) {
  // Pre-compute all random values
  const r0 = jR(0.95), r1 = jR(0.88), r2 = jR(0.80), r3 = jR(0.875), r4a = jR(0.80), r4b = jR(0.95);
  const r5 = jR(0.618), r6 = jR(0.618), r7 = jR(0.618), r7c = jR(0.15), r8 = jR(0.50);
  const r9 = jR(0.382), r10a = jR(0.382), r10b = jR(0.19), r11a = jR(0.12), r11b = jR(0.382);
  const r12r = jR(0.145), r12c = jR(0.09), r13 = jR(0.145), r14 = jR(0.10);
  const n1 = pick(COUNTS_ARC), al1 = jA(0.32), useDots1 = Math.random() < 0.3;
  const n3 = pick(COUNTS_RING), useDots3 = Math.random() < 0.5;
  const n4 = pick(COUNTS_RAY), n6 = pick(COUNTS_POLY), n7 = pick(COUNTS_RING);
  const n8 = pick(COUNTS_ARC), al8 = jA(0.55), n10 = pick(COUNTS_STAR);
  const n11 = pick(COUNTS_RAY), n12 = pick(COUNTS_RING);

  return [
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r0, col, a, 1.6) },
    { sense: 0, draw: useDots1
      ? (ctx, x, y, s, col, a) => strokeDotsOnRing(ctx, x, y, s * r1, n1, s * 0.015, rot, col, a)
      : (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * r1, n1, al1, rot, col, a, 1.1) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r2, col, a, 1.2) },
    { sense: 0, draw: useDots3
      ? (ctx, x, y, s, col, a) => strokeDotsOnRing(ctx, x, y, s * r3, n3, s * 0.015, rot + TAU / 16, col, a)
      : (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * r3, n3, s * 0.04, rot + TAU / 16, col, a * 0.7, 1.0) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * r4a, s * r4b, n4, rot, col, a * 0.6, 0.8) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r5, col, a, 1.2) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r6, n6, rot, col, a, 1.3) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * r7, n7, s * r7c, rot, col, a * 0.7, 1.0) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * r8, n8, al8, rot + PI / 6, col, a * 0.8, 1.1) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r9, col, a, 1.2) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeStar(ctx, x, y, s * r10a, s * r10b, n10, rot, col, a, 1.1) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * r11a, s * r11b, n11, rot + PI / 12, col, a * 0.6, 0.8) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * r12r, n12, s * r12c, rot, col, a, 1.0) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r13, col, a, 1.2) },
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * r14, col, a) },
  ];
}

function templateCrystalline(rot) {
  const sides0 = pick([6, 8]), sides1 = pick([6, 8]), sides2 = pick([6, 8]);
  const r0 = jR(0.95), r1 = jR(0.82), r2a = jR(0.95), r2b = jR(0.82);
  const r3 = jR(0.95), r4 = jR(0.88), n4 = pick([6, 8]), al4 = jA(0.18);
  const useDots4 = Math.random() < 0.3;
  const r5 = jR(0.618), r6 = jR(0.618), r7 = jR(0.618);
  const r8a = jR(0.618), r8b = jR(0.82), n8 = pick(COUNTS_RAY);
  const r9 = jR(0.382), n9 = pick(COUNTS_POLY), r10 = jR(0.382), n10 = pick(COUNTS_POLY);
  const r11 = jR(0.382), r12 = jR(0.18), n12 = pick(COUNTS_POLY);
  const r13 = jR(0.18), n13 = pick(COUNTS_RING), useDots13 = Math.random() < 0.5;
  const r14 = jR(0.10);

  return [
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r0, sides0, rot, col, a, 1.6) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r1, sides1, rot + TAU / 16, col, a, 1.2) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => {
      ctx.strokeStyle = c(col, a * 0.7); ctx.lineWidth = 1.0;
      for (let i = 0; i < sides2; i++) {
        const a1 = rot + (i / sides2) * TAU;
        const a2 = rot + TAU / (sides2 * 2) + (i / sides2) * TAU;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a1) * s * r2a, y + Math.sin(a1) * s * r2a);
        ctx.lineTo(x + Math.cos(a2) * s * r2b, y + Math.sin(a2) * s * r2b);
        ctx.stroke();
      }
    }},
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r3, col, a * 0.4, 0.8) },
    { sense: 0, draw: useDots4
      ? (ctx, x, y, s, col, a) => strokeDotsOnRing(ctx, x, y, s * r4, n4, s * 0.015, rot + TAU / 16, col, a)
      : (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * r4, n4, al4, rot + TAU / 16, col, a * 0.7, 1.1) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r5, 3, rot - PI / 2, col, a, 1.3) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r6, 3, rot + PI / 2, col, a, 1.3) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r7, col, a * 0.8, 1.1) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * r8a, s * r8b, n8, rot, col, a * 0.5, 0.8) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r9, n9, rot - PI / 2, col, a, 1.3) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r10, n10, rot + PI / 2, col, a, 1.3) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r11, col, a * 0.7, 1.1) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r12, n12, rot, col, a, 1.3) },
    { sense: 3, draw: useDots13
      ? (ctx, x, y, s, col, a) => strokeDotsOnRing(ctx, x, y, s * r13, n13, s * 0.02, rot, col, a)
      : (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * r13, n13, s * 0.03, rot, col, a, 1.0) },
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * r14, col, a) },
  ];
}

function templateHarmonic(rot) {
  const r0 = jR(0.95), r1 = jR(0.85), n1 = pick(COUNTS_ARC), al1 = jA(0.20);
  const r2 = jR(0.618), n2 = pick(COUNTS_RING), r2c = jR(0.30);
  const r3 = jR(0.75), r4 = jR(0.618), n4 = pick(COUNTS_ARC), al4 = jA(0.55);
  const useDots4 = Math.random() < 0.3;
  const r5 = jR(0.382), n5 = pick(COUNTS_RING), r5c = jR(0.20);
  const r6 = jR(0.52), r7 = jR(0.45), n7 = pick(COUNTS_POLY), r8 = jR(0.382);
  const r9 = jR(0.33), n9 = pick(COUNTS_POLY), r10 = jR(0.33), n10 = pick(COUNTS_POLY);
  const r11 = jR(0.28);
  const r12 = jR(0.13), n12 = pick(COUNTS_RING), r12c = jR(0.13), r13 = jR(0.13);
  const r14 = jR(0.08);

  return [
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r0, col, a, 1.6) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * r1, n1, al1, rot, col, a * 0.7, 1.1) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * r2, n2, s * r2c, rot, col, a * 0.55, 1.0) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r3, col, a * 0.5, 1.0) },
    { sense: 0, draw: useDots4
      ? (ctx, x, y, s, col, a) => strokeDotsOnRing(ctx, x, y, s * r4, n4, s * 0.015, rot + PI / 6, col, a)
      : (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * r4, n4, al4, rot + PI / 6, col, a * 0.6, 1.0) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * r5, n5, s * r5c, rot + PI / 6, col, a * 0.6, 1.0) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r6, col, a * 0.7, 1.1) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r7, n7, rot, col, a * 0.6, 1.0) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r8, col, a, 1.2) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r9, n9, rot - PI / 2, col, a, 1.3) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * r10, n10, rot + PI / 2, col, a, 1.3) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r11, col, a * 0.8, 1.1) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * r12, n12, s * r12c, rot, col, a * 0.8, 1.2) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * r13, col, a, 1.2) },
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * r14, col, a) },
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

  for (const layer of layers) {
    layer.color = SENSE_COLORS[layer.sense];
    layer.targetAlpha = SENSE_ALPHA[layer.sense];
  }

  return { cx, cy, scale, layers };
}

// -- Play mode layer generator (all random values pre-computed) --

export function generatePlayLayer() {
  const rot = Math.random() * TAU;
  const rFactor = jitter(0.5, 0.35);
  const color = pick(SENSE_COLORS);
  const sides = pick(COUNTS_POLY);
  const points = pick(COUNTS_STAR);
  const arcCount = pick(COUNTS_ARC);
  const arcLen = jA(0.4);
  const ringCount = pick(COUNTS_RING);
  const ringCircleR = jR(0.08);
  const rayCount = pick(COUNTS_RAY);

  const primitives = [
    (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * rFactor, col, a, 1.2),
    (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * rFactor, sides, rot, col, a, 1.3),
    (ctx, x, y, s, col, a) => strokeStar(ctx, x, y, s * rFactor, s * rFactor * 0.5, points, rot, col, a, 1.1),
    (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * rFactor, arcCount, arcLen, rot, col, a, 1.1),
    (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * rFactor, ringCount, s * ringCircleR, rot, col, a, 1.0),
    (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * rFactor * 0.3, s * rFactor, rayCount, rot, col, a, 0.8),
  ];
  return { sense: Math.floor(Math.random() * 5), color, targetAlpha: jitter(0.6, 0.15), draw: pick(primitives) };
}
