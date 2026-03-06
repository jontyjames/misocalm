/**
 * SanctuaryShapeData — recursive bioluminescent tree generator
 *
 * Generates a tree using recursive branching with organic noise.
 * Each branch spawns 1-3 children at random angles, getting thinner
 * and more gnarled. The result is an array of segments ordered by depth.
 * Progressive reveal maps breath 1-11 to depth ranges.
 *
 * Glow: multi-layer drawing (4 passes per segment).
 * Fade trails + additive blending for bioluminescence.
 *
 * Sacred numbers: MIN_ALPHA=0.618 (phi), SETTLE_AGE=233 (fib),
 * MAX_DRIFT_SPARKLES=89 (fib).
 */

const TAU = Math.PI * 2;
const MIN_ALPHA = 0.618;
const SETTLE_AGE = 233;
const MAX_DRIFT_SPARKLES = 89;
const SLATE_FALLBACK = { r: 148, g: 163, b: 184 };

function settleLife(age) {
  const settleT = Math.min(1, age / SETTLE_AGE);
  return MIN_ALPHA + (1 - MIN_ALPHA) * (1 - settleT * settleT);
}

function pickTreeColor(palette, depth, maxDepth) {
  if (!palette || palette.length === 0) return SLATE_FALLBACK;
  const t = depth / maxDepth;
  const idx = Math.min(palette.length - 1, Math.floor(t * palette.length));
  return palette[idx];
}

/**
 * Generate the tree — recursive branching with organic noise.
 * Returns a flat array of segments sorted by depth (trunk first, tips last).
 */
function generateTree(W, H) {
  const segments = [];
  const maxDepth = 11; // matches 11 breaths

  function branch(x, y, angle, length, width, depth) {
    if (depth >= maxDepth || width < 0.3 || length < 2) return;

    // Gnarliness — thinner branches twist more
    const gnarliness = 0.6 / (width * 0.15 + 0.3);
    const wobble = (Math.random() - 0.5) * gnarliness;
    const endAngle = angle + wobble;

    // Slight curve via midpoint offset
    const midX = x + Math.cos(endAngle) * length * 0.5;
    const midY = y + Math.sin(endAngle) * length * 0.5;
    const curveOffset = (Math.random() - 0.5) * length * 0.15;
    const cpx = midX + Math.cos(endAngle + Math.PI / 2) * curveOffset;
    const cpy = midY + Math.sin(endAngle + Math.PI / 2) * curveOffset;

    const endX = x + Math.cos(endAngle) * length;
    const endY = y + Math.sin(endAngle) * length;

    segments.push({
      x0: x, y0: y,
      cpx, cpy,
      x1: endX, y1: endY,
      width,
      endWidth: width * (0.55 + Math.random() * 0.15),
      depth,
      order: segments.length,
    });

    // Spawn children — fewer at greater depth
    const maxChildren = depth < 3 ? 3 : depth < 6 ? 2 : (Math.random() < 0.6 ? 2 : 1);
    const childCount = Math.max(1, Math.floor(Math.random() * maxChildren) + 1);

    // Spread children across an angular range
    const spreadBase = 0.4 + Math.random() * 0.3;
    const spread = spreadBase * (1 + depth * 0.08);

    for (let i = 0; i < childCount; i++) {
      // Distribute children across the spread range
      const childAngle = endAngle + (i / (childCount - 1 || 1) - 0.5) * spread * 2
        + (Math.random() - 0.5) * 0.2;
      const childLength = length * (0.62 + Math.random() * 0.18);
      const childWidth = width * (0.55 + Math.random() * 0.15);

      branch(endX, endY, childAngle, childLength, childWidth, depth + 1);
    }
  }

  // Start from bottom center, growing upward
  const startX = W / 2;
  const startY = H * 0.82;
  const trunkLength = H * 0.18;
  const trunkWidth = W * 0.018;

  // Main trunk — slight lean for organic feel
  const trunkAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.06;
  branch(startX, startY, trunkAngle, trunkLength, trunkWidth, 0);

  // Sort by depth so trunk draws first, tips last
  segments.sort((a, b) => a.depth - b.depth || a.order - b.order);

  return segments;
}

/**
 * Get segments to reveal at a given breath number.
 * Breath 1-2: trunk/base (depth 0-2)
 * Breath 3-4: main branches (depth 3-4)
 * Breath 5-6: mid branches (depth 5-6)
 * Breath 7-8: outer branches (depth 7-8)
 * Breath 9-10: fine tips (depth 9-10)
 * Breath 11: everything remaining
 */
function getRevealDepth(breathNumber) {
  if (breathNumber <= 0) return -1;
  if (breathNumber <= 2) return breathNumber;       // 0-1, 0-2
  if (breathNumber <= 4) return breathNumber + 1;   // 0-4, 0-5
  if (breathNumber <= 6) return breathNumber + 1;   // 0-6, 0-7
  if (breathNumber <= 8) return breathNumber + 1;   // 0-8, 0-9
  return 11;                                        // everything
}

export {
  TAU, MIN_ALPHA, SETTLE_AGE, MAX_DRIFT_SPARKLES,
  SLATE_FALLBACK,
  settleLife, pickTreeColor,
  generateTree, getRevealDepth,
};
