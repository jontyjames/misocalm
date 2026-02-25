/**
 * groundingCompositions — layer-based mandala engine for 5-4-3-2-1 grounding
 *
 * Generates a single centred sacred geometry mandala composed of 15 layers.
 * Each tap reveals the next layer, building one coherent image piece by piece.
 * Three template styles (Celestial, Crystalline, Harmonic), randomly chosen.
 *
 * Outside → inside construction mirrors the grounding journey:
 * scattered senses converging to centre, wholeness.
 *
 * Pure utility. No React.
 */

const PI = Math.PI;
const TAU = PI * 2;

// One colour per sense — shifts as the mandala builds inward
const SENSE_COLORS = [
  'rgba(129,140,248,A)',  // SEE:   indigo-400
  'rgba(34,211,238,A)',   // TOUCH: cyan-400
  'rgba(167,139,250,A)',  // HEAR:  violet-400
  'rgba(253,186,116,A)',  // SMELL: amber-300
  'rgba(241,245,249,A)',  // TASTE: slate-100
];

// Inner layers glow brighter, drawing the eye to centre
const SENSE_ALPHA = [0.55, 0.6, 0.68, 0.75, 0.85];

function c(template, alpha) {
  return template.replace('A', Math.max(0, alpha).toFixed(3));
}

// ── Drawing primitives ─────────────────────────────────────────

function strokeCircle(ctx, cx, cy, r, color, alpha, lw = 0.8) {
  if (r < 1) return;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.strokeStyle = c(color, alpha);
  ctx.lineWidth = lw;
  ctx.stroke();
}

function strokePolygon(ctx, cx, cy, r, sides, rot, color, alpha, lw = 0.8) {
  if (r < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * TAU;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = c(color, alpha);
  ctx.lineWidth = lw;
  ctx.stroke();
}

function strokeStar(ctx, cx, cy, outerR, innerR, points, rot, color, alpha, lw = 0.7) {
  ctx.beginPath();
  for (let i = 0; i <= points * 2; i++) {
    const a = rot + (i / (points * 2)) * TAU;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = c(color, alpha);
  ctx.lineWidth = lw;
  ctx.stroke();
}

function strokeRays(ctx, cx, cy, innerR, outerR, count, rot, color, alpha, lw = 0.5) {
  ctx.strokeStyle = c(color, alpha);
  ctx.lineWidth = lw;
  for (let i = 0; i < count; i++) {
    const a = rot + (i / count) * TAU;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR);
    ctx.lineTo(cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR);
    ctx.stroke();
  }
}

function strokeCirclesOnRing(ctx, cx, cy, ringR, count, circleR, rot, color, alpha, lw = 0.7) {
  for (let i = 0; i < count; i++) {
    const a = rot + (i / count) * TAU;
    strokeCircle(ctx, cx + Math.cos(a) * ringR, cy + Math.sin(a) * ringR, circleR, color, alpha, lw);
  }
}

function strokeArcs(ctx, cx, cy, r, count, arcLen, rot, color, alpha, lw = 0.7) {
  ctx.strokeStyle = c(color, alpha);
  ctx.lineWidth = lw;
  for (let i = 0; i < count; i++) {
    const startA = rot + (i / count) * TAU;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startA, startA + arcLen);
    ctx.stroke();
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
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.fill();
}

// ── Templates ──────────────────────────────────────────────────
// Each returns 15 layers: { draw(ctx, cx, cy, scale, color, alpha), sense: 0-4 }
// Layers build outside → inside. Sense mapping: SEE(5), TOUCH(4), HEAR(3), SMELL(2), TASTE(1)

function templateCelestial(rot) {
  return [
    // SEE (5): outer orbital rings and arcs
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.95, col, a, 1.0) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * 0.88, 8, 0.32, rot, col, a, 0.8) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.80, col, a, 0.8) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeDotsOnRing(ctx, x, y, s * 0.875, 8, s * 0.015, rot + TAU / 16, col, a) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * 0.80, s * 0.95, 16, rot, col, a * 0.6, 0.5) },

    // TOUCH (4): hexagonal flower mid-ring
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.618, col, a, 0.9) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.618, 6, rot, col, a, 0.8) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * 0.618, 6, s * 0.15, rot, col, a * 0.7, 0.7) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * 0.50, 6, 0.55, rot + PI / 6, col, a * 0.8, 0.7) },

    // HEAR (3): inner star structure
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.382, col, a, 0.8) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeStar(ctx, x, y, s * 0.382, s * 0.19, 6, rot, col, a, 0.7) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * 0.12, s * 0.382, 12, rot + PI / 12, col, a * 0.6, 0.5) },

    // SMELL (2): seed of life details
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * 0.145, 6, s * 0.09, rot, col, a, 0.8) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.145, col, a, 0.9) },

    // TASTE (1): centre glow
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * 0.10, col, a) },
  ];
}

function templateCrystalline(rot) {
  return [
    // SEE (5): outer crystal frame — dual octagons with connections
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.95, 8, rot, col, a, 1.0) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.82, 8, rot + TAU / 16, col, a, 0.8) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => {
      ctx.strokeStyle = c(col, a * 0.7);
      ctx.lineWidth = 0.6;
      for (let i = 0; i < 8; i++) {
        const a1 = rot + (i / 8) * TAU;
        const a2 = rot + TAU / 16 + (i / 8) * TAU;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a1) * s * 0.95, y + Math.sin(a1) * s * 0.95);
        ctx.lineTo(x + Math.cos(a2) * s * 0.82, y + Math.sin(a2) * s * 0.82);
        ctx.stroke();
      }
    }},
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.95, col, a * 0.4, 0.5) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * 0.88, 8, 0.18, rot + TAU / 16, col, a * 0.7, 0.7) },

    // TOUCH (4): Star of David mid-structure
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.618, 3, rot - PI / 2, col, a, 0.9) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.618, 3, rot + PI / 2, col, a, 0.9) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.618, col, a * 0.8, 0.7) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeRays(ctx, x, y, s * 0.618, s * 0.82, 6, rot, col, a * 0.5, 0.5) },

    // HEAR (3): inner dual triangles
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.382, 3, rot - PI / 2, col, a, 0.8) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.382, 3, rot + PI / 2, col, a, 0.8) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.382, col, a * 0.7, 0.7) },

    // SMELL (2): inner crystal
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.18, 6, rot, col, a, 0.9) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeDotsOnRing(ctx, x, y, s * 0.18, 6, s * 0.02, rot, col, a) },

    // TASTE (1): centre glow
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * 0.10, col, a) },
  ];
}

function templateHarmonic(rot) {
  return [
    // SEE (5): outer flower boundary with overlapping circles
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.95, col, a, 1.0) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * 0.85, 12, 0.20, rot, col, a * 0.7, 0.7) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * 0.618, 6, s * 0.30, rot, col, a * 0.55, 0.6) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.75, col, a * 0.5, 0.6) },
    { sense: 0, draw: (ctx, x, y, s, col, a) => strokeArcs(ctx, x, y, s * 0.618, 6, 0.55, rot + PI / 6, col, a * 0.6, 0.6) },

    // TOUCH (4): inner flower layer
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * 0.382, 6, s * 0.20, rot + PI / 6, col, a * 0.6, 0.6) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.52, col, a * 0.7, 0.7) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.45, 6, rot, col, a * 0.6, 0.6) },
    { sense: 1, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.382, col, a, 0.8) },

    // HEAR (3): triangular harmony
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.33, 3, rot - PI / 2, col, a, 0.8) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokePolygon(ctx, x, y, s * 0.33, 3, rot + PI / 2, col, a, 0.8) },
    { sense: 2, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.28, col, a * 0.8, 0.7) },

    // SMELL (2): Seed of Life centre
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCirclesOnRing(ctx, x, y, s * 0.13, 6, s * 0.13, rot, col, a * 0.8, 0.8) },
    { sense: 3, draw: (ctx, x, y, s, col, a) => strokeCircle(ctx, x, y, s * 0.13, col, a, 0.9) },

    // TASTE (1): centre glow
    { sense: 4, draw: (ctx, x, y, s, col, a) => fillGlow(ctx, x, y, s * 0.08, col, a) },
  ];
}

// ── Main composition generator ─────────────────────────────────

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
