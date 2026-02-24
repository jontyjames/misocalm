/**
 * sacredShapes — 7 sacred geometry drawing functions + colour palette
 *
 * Pure utility. No React. Each shape draws thin, translucent strokes on canvas.
 * Ethereal, not heavy. Used by GroundingCanvas to paint generative art on tap.
 */

// 13 colours (prime) — solfeggio-adjacent palette
const SACRED_COLORS = [
  'rgba(165,180,252,A)',  // indigo-300
  'rgba(129,140,248,A)',  // indigo-400
  'rgba(196,181,253,A)',  // violet-300
  'rgba(167,139,250,A)',  // violet-400
  'rgba(103,232,249,A)',  // cyan-300
  'rgba(34,211,238,A)',   // cyan-400
  'rgba(253,186,116,A)',  // amber-300
  'rgba(252,211,77,A)',   // amber-200
  'rgba(134,239,172,A)',  // green-300
  'rgba(226,232,240,A)',  // slate-200
  'rgba(241,245,249,A)',  // slate-100
  'rgba(251,191,219,A)',  // pink-300
  'rgba(249,168,212,A)',  // pink-400
];

function colorWithAlpha(colorTemplate, alpha) {
  return colorTemplate.replace('A', alpha.toFixed(3));
}

// ─── Shape 1: Flower of Life ─────────────────────────────────────
// 7 overlapping circles (centre + 6 hexagonal)
function drawFlowerOfLife(ctx, cx, cy, size, color, alpha, rotation) {
  const r = size * 0.35;
  ctx.strokeStyle = colorWithAlpha(color, alpha * 0.6);
  ctx.lineWidth = 0.8;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  // Centre circle
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  // 6 surrounding circles
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Shape 2: Metatron's Cube ────────────────────────────────────
// 13 circles + connecting lines
function drawMetatronsCube(ctx, cx, cy, size, color, alpha, rotation) {
  const r = size * 0.12;
  const outer = size * 0.45;
  const inner = size * 0.22;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = colorWithAlpha(color, alpha * 0.35);
  ctx.lineWidth = 0.5;
  // 13 node positions: centre, 6 inner, 6 outer
  const nodes = [{ x: 0, y: 0 }];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    nodes.push({ x: Math.cos(a) * inner, y: Math.sin(a) * inner });
    nodes.push({ x: Math.cos(a) * outer, y: Math.sin(a) * outer });
  }
  // Connect all nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
    }
  }
  // Draw circles at nodes
  ctx.strokeStyle = colorWithAlpha(color, alpha * 0.5);
  ctx.lineWidth = 0.7;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Shape 3: Sri Yantra ────────────────────────────────────────
// 9 interlocking triangles radiating from centre
function drawSriYantra(ctx, cx, cy, size, color, alpha, rotation) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = colorWithAlpha(color, alpha * 0.55);
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 9; i++) {
    const scale = 0.2 + (i / 9) * 0.8;
    const r = size * 0.45 * scale;
    const pointUp = i % 2 === 0;
    const baseAngle = pointUp ? -Math.PI / 2 : Math.PI / 2;
    const offset = (i * 0.12);
    ctx.beginPath();
    for (let v = 0; v <= 3; v++) {
      const a = baseAngle + (v / 3) * Math.PI * 2 + offset;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (v === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Shape 4: Seed of Life ──────────────────────────────────────
// 7 circles in rosette pattern (tighter than Flower)
function drawSeedOfLife(ctx, cx, cy, size, color, alpha, rotation) {
  const r = size * 0.28;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = colorWithAlpha(color, alpha * 0.55);
  ctx.lineWidth = 0.8;
  // Centre
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  // 6 petals — circles centred on the edge of the centre circle
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Shape 5: Vesica Piscis ─────────────────────────────────────
// 2 overlapping circles with shared radius
function drawVesicaPiscis(ctx, cx, cy, size, color, alpha, rotation) {
  const r = size * 0.38;
  const offset = r * 0.5;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = colorWithAlpha(color, alpha * 0.6);
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.arc(-offset, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(offset, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// ─── Shape 6: Torus Cross-Section ───────────────────────────────
// Concentric ellipses with rotation
function drawTorusCrossSection(ctx, cx, cy, size, color, alpha, rotation) {
  const rings = 7;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = colorWithAlpha(color, alpha * 0.45);
  ctx.lineWidth = 0.6;
  for (let i = 1; i <= rings; i++) {
    const rx = size * 0.45 * (i / rings);
    const ry = size * 0.25 * (i / rings);
    const tilt = (i / rings) * 0.5;
    ctx.save();
    ctx.rotate(tilt);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

// ─── Shape 7: Fibonacci Spiral ──────────────────────────────────
// Golden spiral drawn with arcs
function drawFibonacciSpiral(ctx, cx, cy, size, color, alpha, rotation) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = colorWithAlpha(color, alpha * 0.6);
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  // Fibonacci sequence for arc radii
  const fibs = [1, 1, 2, 3, 5, 8, 13, 21];
  const scale = size * 0.018;
  let x = 0, y = 0;
  for (let i = 0; i < fibs.length; i++) {
    const r = fibs[i] * scale;
    const startAngle = (i * Math.PI) / 2;
    const endAngle = startAngle + Math.PI / 2;
    // Shift centre for each quarter-turn
    const dir = i % 4;
    if (i > 0) {
      if (dir === 0) y -= fibs[i - 1] * scale;
      else if (dir === 1) x += fibs[i - 1] * scale;
      else if (dir === 2) y += fibs[i - 1] * scale;
      else x -= fibs[i - 1] * scale;
    }
    ctx.arc(x, y, r, startAngle + Math.PI, startAngle + Math.PI + Math.PI / 2, false);
  }
  ctx.stroke();
  ctx.restore();
}

// ─── Exports ────────────────────────────────────────────────────

const SACRED_SHAPES = [
  drawFlowerOfLife,
  drawMetatronsCube,
  drawSriYantra,
  drawSeedOfLife,
  drawVesicaPiscis,
  drawTorusCrossSection,
  drawFibonacciSpiral,
];

/**
 * Spawn a sacred shape config with random values.
 * Returns data object — caller creates the SacredForm instance.
 */
function spawnSacredShape(canvasW, canvasH) {
  const padding = 68; // phi-scale margin
  return {
    shapeIndex: Math.floor(Math.random() * SACRED_SHAPES.length),
    colorStr: SACRED_COLORS[Math.floor(Math.random() * SACRED_COLORS.length)],
    x: padding + Math.random() * (canvasW - padding * 2),
    y: padding + Math.random() * (canvasH - padding * 2),
    size: 42 + Math.random() * 68, // phi scale: 42–110
    rotation: Math.random() * Math.PI * 2,
  };
}

export { SACRED_SHAPES, SACRED_COLORS, spawnSacredShape };
