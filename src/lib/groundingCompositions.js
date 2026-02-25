/**
 * groundingCompositions — composition engine for 5-4-3-2-1 grounding
 *
 * Generates 15 pre-computed positions that form a sacred geometry
 * composition when revealed one at a time through tapping.
 * Two modes: Convergence (concentric rings) and Spiral (golden spiral).
 *
 * Pure utility. No React.
 */

import { SACRED_SHAPES, SACRED_COLORS } from './sacredShapes';

// Sense-specific colour palettes (subsets of the full 13)
const SENSE_COLORS = [
  // SEE (indigo family)
  ['rgba(165,180,252,A)', 'rgba(129,140,248,A)'],
  // TOUCH (cyan family)
  ['rgba(103,232,249,A)', 'rgba(34,211,238,A)'],
  // HEAR (violet family)
  ['rgba(196,181,253,A)', 'rgba(167,139,250,A)'],
  // SMELL (warm family)
  ['rgba(253,186,116,A)', 'rgba(252,211,77,A)'],
  // TASTE (light/white family)
  ['rgba(241,245,249,A)', 'rgba(226,232,240,A)'],
];

// Sense boundaries: SEE 5, TOUCH 4, HEAR 3, SMELL 2, TASTE 1
const SENSE_BOUNDS = [
  { start: 0, end: 5, senseIndex: 0 },
  { start: 5, end: 9, senseIndex: 1 },
  { start: 9, end: 12, senseIndex: 2 },
  { start: 12, end: 14, senseIndex: 3 },
  { start: 14, end: 15, senseIndex: 4 },
];

// ─── Ring layout ────────────────────────────────────────────────

function generateConvergence(cx, cy, maxRadius) {
  const rings = [
    { count: 5, radiusFactor: 0.854 },  // SEE:   phi^(-1/3)
    { count: 4, radiusFactor: 0.618 },  // TOUCH: phi complement
    { count: 3, radiusFactor: 0.382 },  // HEAR:  1 - phi complement
    { count: 2, radiusFactor: 0.236 },  // SMELL: phi complement squared
    { count: 1, radiusFactor: 0 },      // TASTE: dead centre
  ];

  const positions = [];

  for (const ring of rings) {
    if (ring.count === 1) {
      positions.push({ x: cx, y: cy });
      continue;
    }
    const r = maxRadius * ring.radiusFactor;
    const offset = Math.random() * Math.PI * 2;
    for (let i = 0; i < ring.count; i++) {
      const angle = offset + (i / ring.count) * Math.PI * 2
        + (Math.random() - 0.5) * 0.288; // +/- 0.144 rad jitter (Fibonacci 144)
      positions.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      });
    }
  }

  return positions;
}

// ─── Golden spiral layout ───────────────────────────────────────

function generateSpiral(cx, cy, maxRadius) {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const startAngle = Math.random() * Math.PI * 2;
  const positions = [];

  for (let i = 0; i < 15; i++) {
    const t = 1 - i / 14; // 1 (outer) to 0 (centre)
    const r = maxRadius * 0.85 * Math.pow(t, 0.7);
    const angle = startAngle + i * goldenAngle;
    positions.push({
      x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 12,
      y: cy + Math.sin(angle) * r + (Math.random() - 0.5) * 12,
    });
  }

  return positions;
}

// ─── Main composition generator ─────────────────────────────────

export function generateComposition(width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) * 0.382; // phi complement (1 - 0.618)

  const mode = Math.random() < 0.5 ? 'convergence' : 'spiral';

  const rawPositions = mode === 'convergence'
    ? generateConvergence(cx, cy, maxRadius)
    : generateSpiral(cx, cy, maxRadius);

  const positions = rawPositions.map((pos, i) => {
    const sense = SENSE_BOUNDS.find(s => i >= s.start && i < s.end);
    const senseIndex = sense.senseIndex;
    const palette = SENSE_COLORS[senseIndex];
    const colorStr = palette[Math.floor(Math.random() * palette.length)];

    // Outer positions larger, inner smaller; TASTE keystone is medium
    const ringProgress = i / 14;
    const baseSize = senseIndex === 4
      ? 110                                // TASTE keystone: phi-7 (110px)
      : 110 + (1 - ringProgress) * 140;
    const size = baseSize + (Math.random() - 0.5) * 40;

    return {
      x: pos.x,
      y: pos.y,
      senseIndex,
      shapeIndex: Math.floor(Math.random() * SACRED_SHAPES.length),
      colorStr,
      size: Math.max(80, size),
      rotation: Math.random() * Math.PI * 2,
    };
  });

  return { mode, positions };
}

// ─── Connection lines ───────────────────────────────────────────

export function findConnections(positions, revealedCount) {
  const connections = [];

  for (let i = 1; i < revealedCount; i++) {
    const cur = positions[i];
    const distances = [];
    for (let j = 0; j < i; j++) {
      const dx = cur.x - positions[j].x;
      const dy = cur.y - positions[j].y;
      distances.push({ index: j, dist: Math.sqrt(dx * dx + dy * dy) });
    }
    distances.sort((a, b) => a.dist - b.dist);
    for (const c of distances.slice(0, 2)) {
      connections.push([c.index, i]);
    }
  }

  return connections;
}
