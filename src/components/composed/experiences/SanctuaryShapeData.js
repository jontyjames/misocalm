/**
 * SanctuaryShapeData — tree skeleton generator + reveal schedule
 *
 * Generates a structurally connected tree: trunk, roots, branches, sub-branches, leaves.
 * Every element is positioned relative to the trunk spine. REVEAL_SCHEDULE maps
 * breath 1-11 to which elements appear. By breath 6 the tree is alive.
 * By breath 11 it's radiant.
 *
 * Sacred numbers: MIN_ALPHA=0.618 (phi), SETTLE_AGE=233 (fib),
 * MAX_SHAPES=127 (Mersenne prime 2^7-1), MAX_DRIFT_SPARKLES=89 (fib).
 */

const TAU = Math.PI * 2;

const MIN_ALPHA = 0.618;
const SETTLE_AGE = 233;
const MAX_SHAPES = 127;
const MAX_DRIFT_SPARKLES = 89;

const SLATE_FALLBACK = { r: 148, g: 163, b: 184 };

function settleLife(age) {
  const settleT = Math.min(1, age / SETTLE_AGE);
  return MIN_ALPHA + (1 - MIN_ALPHA) * (1 - settleT * settleT);
}

function glowStroke(ctx, { r, g, b }, alpha, lineWidth) {
  ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.146})`;
  ctx.lineWidth = lineWidth * 5;
  ctx.stroke();
  ctx.strokeStyle = `rgba(${Math.min(255, r + 26)},${Math.min(255, g + 26)},${Math.min(255, b + 26)},${alpha})`;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function pickTreeColor(palette, layer) {
  if (!palette || palette.length === 0) return SLATE_FALLBACK;
  const ranges = {
    ROOT: [0, 1],
    TRUNK: [1, 2],
    BRANCH: [2, 3],
    LEAF: [3, 4],
  };
  const [lo, hi] = ranges[layer] || [0, 4];
  const idx = lo + Math.floor(Math.random() * (hi - lo + 1));
  return palette[Math.min(idx, palette.length - 1)];
}

/**
 * Generate the tree skeleton — called once on mount.
 * Returns arrays of positioned elements for each layer.
 */
function generateTree(W, H) {
  const cx = W / 2;
  const baseY = H * 0.85;
  const topY = H * 0.12;
  const trunkHeight = baseY - topY;

  // --- TRUNK SPINE (cubic bezier control points for gentle S-curve) ---
  const wobble = W * 0.03;
  const trunk = {
    x0: cx, y0: baseY,
    cp1x: cx + wobble, cp1y: baseY - trunkHeight * 0.33,
    cp2x: cx - wobble, cp2y: baseY - trunkHeight * 0.66,
    x3: cx, y3: topY,
  };

  // Helper: get point on trunk at t (0=base, 1=top)
  function trunkPoint(t) {
    const u = 1 - t;
    const x = u*u*u*trunk.x0 + 3*u*u*t*trunk.cp1x + 3*u*t*t*trunk.cp2x + t*t*t*trunk.x3;
    const y = u*u*u*trunk.y0 + 3*u*u*t*trunk.cp1y + 3*u*t*t*trunk.cp2y + t*t*t*trunk.y3;
    return { x, y };
  }

  // --- ROOTS (5 curves from base, spreading outward/downward) ---
  const roots = [];
  const rootAngles = [-0.7, -0.35, 0, 0.35, 0.7]; // spread
  for (let i = 0; i < 5; i++) {
    const angle = rootAngles[i] + (Math.random() - 0.5) * 0.15;
    const len = H * (0.08 + Math.random() * 0.06);
    const startX = cx + (Math.random() - 0.5) * 4;
    const startY = baseY;
    const endX = startX + Math.sin(angle) * len;
    const endY = startY + Math.cos(Math.abs(angle) * 0.5) * len * 0.7 + len * 0.3;
    const cpx = (startX + endX) / 2 + Math.sin(angle) * len * 0.3;
    const cpy = startY + len * 0.5;
    roots.push({
      x0: startX, y0: startY,
      cpx, cpy,
      x1: endX, y1: Math.min(endY, H * 0.97),
      lineWidth: 2 + Math.random() * 1.5,
    });
  }

  // --- BRANCH POINTS at Fibonacci fractions of trunk ---
  const branchTs = [0.382, 0.5, 0.618, 0.764, 0.854];
  const branches = [];
  const subBranches = [];
  const leaves = [];

  for (let i = 0; i < branchTs.length; i++) {
    const t = branchTs[i];
    const origin = trunkPoint(t);
    const reach = W * (0.12 + Math.random() * 0.08) * (0.7 + t * 0.5);

    // Two branches per point: left and right
    for (const side of [-1, 1]) {
      const angle = side * (0.3 + Math.random() * 0.4) + (t - 0.5) * 0.3;
      const endX = origin.x + Math.cos(angle - Math.PI / 2 * side) * reach * side;
      const endY = origin.y - Math.sin(0.3 + Math.random() * 0.3) * reach * 0.6;
      const cpx = origin.x + (endX - origin.x) * 0.5 + (Math.random() - 0.5) * reach * 0.2;
      const cpy = origin.y + (endY - origin.y) * 0.3 - reach * 0.15;

      const branch = {
        x0: origin.x, y0: origin.y,
        cpx, cpy,
        x1: endX, y1: endY,
        lineWidth: 2 + Math.random() * 1,
        branchIndex: i,
      };
      branches.push(branch);

      // Sub-branch from midpoint of this branch (50% chance, up to 5 total)
      if (subBranches.length < 5 && Math.random() < 0.6) {
        const mt = 0.5 + Math.random() * 0.3;
        const mx = branch.x0 * (1-mt)*(1-mt) + 2*(1-mt)*mt*branch.cpx + mt*mt*branch.x1;
        const my = branch.y0 * (1-mt)*(1-mt) + 2*(1-mt)*mt*branch.cpy + mt*mt*branch.y1;
        const subReach = reach * (0.3 + Math.random() * 0.2);
        const subAngle = angle * 0.5 + side * (0.2 + Math.random() * 0.3);
        const sx1 = mx + Math.cos(subAngle - Math.PI / 2 * side) * subReach * side;
        const sy1 = my - Math.abs(Math.sin(subAngle)) * subReach * 0.4;
        subBranches.push({
          x0: mx, y0: my,
          cpx: (mx + sx1) / 2 + (Math.random() - 0.5) * subReach * 0.3,
          cpy: my + (sy1 - my) * 0.4,
          x1: sx1, y1: sy1,
          lineWidth: 1 + Math.random() * 0.8,
        });

        // Leaf at sub-branch tip
        leaves.push({
          cx: sx1, cy: sy1,
          sides: [3, 5, 7][Math.floor(Math.random() * 3)],
          radius: 3 + Math.random() * 4,
          rotation: Math.random() * TAU,
          rotSpeed: (Math.random() - 0.5) * 0.002,
        });
      }

      // Leaf at branch tip
      leaves.push({
        cx: endX, cy: endY,
        sides: [3, 5, 7][Math.floor(Math.random() * 3)],
        radius: 3 + Math.random() * 5,
        rotation: Math.random() * TAU,
        rotSpeed: (Math.random() - 0.5) * 0.002,
      });
    }
  }

  // A few extra leaves along upper branches for fullness
  while (leaves.length < 13) {
    const b = branches[Math.floor(Math.random() * branches.length)];
    const t = 0.6 + Math.random() * 0.3;
    const lx = b.x0*(1-t)*(1-t) + 2*(1-t)*t*b.cpx + t*t*b.x1;
    const ly = b.y0*(1-t)*(1-t) + 2*(1-t)*t*b.cpy + t*t*b.y1;
    leaves.push({
      cx: lx + (Math.random() - 0.5) * 12,
      cy: ly + (Math.random() - 0.5) * 12,
      sides: [3, 5, 7][Math.floor(Math.random() * 3)],
      radius: 3 + Math.random() * 4,
      rotation: Math.random() * TAU,
      rotSpeed: (Math.random() - 0.5) * 0.002,
    });
  }

  // Trunk segments: split trunk into pieces for progressive reveal
  const trunkSegments = [];
  const segCount = 5;
  for (let i = 0; i < segCount; i++) {
    const t0 = i / segCount;
    const t1 = (i + 1) / segCount;
    trunkSegments.push({ t0, t1, lineWidth: 5 - i * 0.4 });
  }

  return { trunk, trunkPoint, trunkSegments, roots, branches, subBranches, leaves };
}

/**
 * REVEAL_SCHEDULE — which tree elements to create at each breath.
 * Returns array of { type, index } for the skeleton arrays.
 *
 * Breath 1:  3 roots
 * Breath 2:  2 roots + trunk base (segments 0-1)
 * Breath 3:  trunk segment 2 + first 2 branches
 * Breath 4:  trunk segments 3-4 + 2 branches
 * Breath 5:  2 branches + 2 sub-branches
 * Breath 6:  2 branches + 3 sub-branches — TREE ALIVE
 * Breath 7:  first 3 leaves
 * Breath 8:  next 4 leaves
 * Breath 9:  remaining leaves
 * Breath 10: sparkle density up (handled in canvas)
 * Breath 11: final glow (handled in canvas)
 */
const REVEAL_SCHEDULE = [
  null, // 0 unused
  // Breath 1: 3 roots
  { roots: [0, 1, 2], trunkSegs: [], branches: [], subBranches: [], leaves: [] },
  // Breath 2: 2 roots + trunk base
  { roots: [3, 4], trunkSegs: [0, 1], branches: [], subBranches: [], leaves: [] },
  // Breath 3: trunk middle + first branch pair
  { roots: [], trunkSegs: [2], branches: [0, 1], subBranches: [], leaves: [] },
  // Breath 4: trunk top + second branch pair
  { roots: [], trunkSegs: [3, 4], branches: [2, 3], subBranches: [], leaves: [] },
  // Breath 5: third branch pair + sub-branches begin
  { roots: [], trunkSegs: [], branches: [4, 5], subBranches: [0, 1], leaves: [] },
  // Breath 6: remaining branches + sub-branches — TREE ALIVE
  { roots: [], trunkSegs: [], branches: [6, 7, 8, 9], subBranches: [2, 3, 4], leaves: [] },
  // Breath 7: first leaves
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [0, 1, 2] },
  // Breath 8: more leaves
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [3, 4, 5, 6] },
  // Breath 9: remaining leaves
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [7, 8, 9, 10, 11, 12] },
  // Breath 10: extra sparkles (canvas handles)
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [] },
  // Breath 11: final glow (canvas handles)
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [] },
];

export {
  TAU, MIN_ALPHA, SETTLE_AGE, MAX_SHAPES, MAX_DRIFT_SPARKLES,
  SLATE_FALLBACK,
  settleLife, glowStroke, pickTreeColor,
  generateTree, REVEAL_SCHEDULE,
};
