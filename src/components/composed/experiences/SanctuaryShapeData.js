/**
 * SanctuaryShapeData — dot-based tree of life generator
 *
 * Generates a tree silhouette from hundreds of glowing dots.
 * Trunk = dense tapered column. Canopy = cloud of overlapping circles.
 * Roots = curves spreading from base. Each breath reveals more dots.
 * The tree emerges through density, like a pointillist painting.
 *
 * Sacred numbers: dot count 233 (fib), MAX_DRIFT_SPARKLES=89 (fib),
 * canopy circles 7 (sacred), root curves 5 (prime).
 */

const TAU = Math.PI * 2;
const MIN_ALPHA = 0.618;
const SETTLE_AGE = 233;
const MAX_DRIFT_SPARKLES = 89;
const SLATE_FALLBACK = { r: 148, g: 163, b: 184 };
const TOTAL_DOTS = 377; // Fibonacci — plenty for a lush tree

function settleLife(age) {
  const settleT = Math.min(1, age / SETTLE_AGE);
  return MIN_ALPHA + (1 - MIN_ALPHA) * (1 - settleT * settleT);
}

function pickDotColor(palette, zone) {
  if (!palette || palette.length === 0) return SLATE_FALLBACK;
  const ranges = {
    root: [0, 1],
    trunk: [1, 2],
    canopy: [2, 4],
  };
  const [lo, hi] = ranges[zone] || [0, 4];
  const idx = lo + Math.floor(Math.random() * (hi - lo + 1));
  return palette[Math.min(idx, palette.length - 1)];
}

/**
 * Check if point (px, py) is inside any of the canopy circles.
 */
function inCanopy(px, py, circles) {
  for (const c of circles) {
    const dx = px - c.x;
    const dy = py - c.y;
    if (dx * dx + dy * dy < c.r * c.r) return true;
  }
  return false;
}

/**
 * Generate all dot positions for the tree.
 * Returns array of { x, y, zone, size, breath } sorted by breath.
 */
function generateTree(W, H) {
  const cx = W / 2;
  const dots = [];

  // --- TREE PROPORTIONS ---
  const trunkBaseY = H * 0.78;
  const trunkTopY = H * 0.42;
  const trunkWidth = W * 0.04;
  const canopyCenterY = H * 0.30;
  const canopyRadius = W * 0.35;

  // --- CANOPY SHAPE: 7 overlapping circles (sacred count) ---
  const canopyCircles = [
    { x: cx, y: canopyCenterY, r: canopyRadius * 0.7 },                          // main
    { x: cx - canopyRadius * 0.4, y: canopyCenterY - canopyRadius * 0.1, r: canopyRadius * 0.5 },  // left upper
    { x: cx + canopyRadius * 0.4, y: canopyCenterY - canopyRadius * 0.05, r: canopyRadius * 0.5 }, // right upper
    { x: cx - canopyRadius * 0.25, y: canopyCenterY + canopyRadius * 0.35, r: canopyRadius * 0.45 }, // left lower
    { x: cx + canopyRadius * 0.3, y: canopyCenterY + canopyRadius * 0.3, r: canopyRadius * 0.45 },  // right lower
    { x: cx - canopyRadius * 0.1, y: canopyCenterY - canopyRadius * 0.4, r: canopyRadius * 0.35 },  // top left
    { x: cx + canopyRadius * 0.15, y: canopyCenterY - canopyRadius * 0.35, r: canopyRadius * 0.35 }, // top right
  ];

  // --- SEED (breath 1) ---
  // Small bright cluster at the very bottom — the origin of life
  const seedCount = 13; // prime
  const seedY = H * 0.88;
  for (let i = 0; i < seedCount; i++) {
    const angle = Math.random() * TAU;
    const dist = Math.random() * W * 0.025;
    dots.push({
      x: cx + Math.cos(angle) * dist,
      y: seedY + Math.sin(angle) * dist * 0.6,
      zone: 'root',
      size: 2 + Math.random() * 2.5,
      breath: 1,
    });
  }

  // --- ROOT DOTS (breath 2-3) ---
  // 5 root curves spreading wide from seed
  const rootCount = 34; // Fibonacci
  const rootAngles = [-1.0, -0.5, 0, 0.5, 1.0];
  for (let i = 0; i < rootCount; i++) {
    const curveIdx = i % 5;
    const baseAngle = rootAngles[curveIdx];
    const t = (i / rootCount) * 0.8 + Math.random() * 0.2;
    const angle = baseAngle + (Math.random() - 0.5) * 0.3;
    const reach = W * (0.08 + t * 0.35);
    const x = cx + Math.sin(angle) * reach + (Math.random() - 0.5) * 8;
    const y = seedY + t * H * 0.08 + Math.random() * 6;
    dots.push({
      x, y,
      zone: 'root',
      size: 1.5 + Math.random() * 2,
      breath: i < 17 ? 2 : 3,
    });
  }

  // --- TRUNK DOTS (breath 3-5) ---
  // Grows upward from seed to canopy
  const trunkCount = 55; // Fibonacci
  for (let i = 0; i < trunkCount; i++) {
    const t = i / trunkCount; // 0=base, 1=top
    const taper = 1 - t * 0.5;
    const x = cx + (Math.random() - 0.5) * trunkWidth * taper * 2;
    const y = trunkBaseY - t * (trunkBaseY - trunkTopY);
    const wobble = Math.sin(t * 5 + Math.random()) * trunkWidth * 0.3;
    dots.push({
      x: x + wobble,
      y: y + (Math.random() - 0.5) * 4,
      zone: 'trunk',
      size: 1.5 + (1 - t) * 2 + Math.random() * 1.5,
      breath: t < 0.33 ? 3 : t < 0.66 ? 4 : 5,
    });
  }

  // --- CANOPY DOTS (breath 4-11) ---
  // Scatter dots within canopy circles, denser toward center
  const canopyCount = TOTAL_DOTS - seedCount - rootCount - trunkCount;
  let placed = 0;
  let attempts = 0;
  while (placed < canopyCount && attempts < canopyCount * 5) {
    attempts++;
    // Pick a random point in the canopy bounding box
    const x = cx + (Math.random() - 0.5) * canopyRadius * 2.2;
    const y = canopyCenterY + (Math.random() - 0.5) * canopyRadius * 1.8;

    if (!inCanopy(x, y, canopyCircles)) continue;

    // Distance from canopy center → determines breath and density
    const dx = x - cx;
    const dy = y - canopyCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy) / canopyRadius;

    // Inner dots revealed first, outer dots later
    let breath;
    if (dist < 0.25) breath = 5 + Math.floor(Math.random() * 2);       // 5-6
    else if (dist < 0.45) breath = 6 + Math.floor(Math.random() * 2);  // 6-7
    else if (dist < 0.65) breath = 7 + Math.floor(Math.random() * 2);  // 7-8
    else if (dist < 0.80) breath = 8 + Math.floor(Math.random() * 2);  // 8-9
    else breath = 9 + Math.floor(Math.random() * 2);                   // 9-10

    dots.push({
      x: x + (Math.random() - 0.5) * 3,
      y: y + (Math.random() - 0.5) * 3,
      zone: 'canopy',
      size: 1.5 + Math.random() * 3.5,
      breath: Math.min(breath, 11),
    });
    placed++;
  }

  // Sort by breath number for progressive reveal
  dots.sort((a, b) => a.breath - b.breath);

  return dots;
}

export {
  TAU, MIN_ALPHA, SETTLE_AGE, MAX_DRIFT_SPARKLES,
  SLATE_FALLBACK,
  settleLife, pickDotColor,
  generateTree,
};
