/**
 * SanctuaryShapeData — tree skeleton generator + reveal schedule
 *
 * Generates a structurally connected tree: trunk, roots (+ secondary roots),
 * branches that droop and hang, sub-branches, leaves.
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
  const baseY = H * 0.72;        // trunk base — leaves room for roots below
  const topY = H * 0.22;         // trunk top — canopy fills upper half
  const trunkHeight = baseY - topY;

  // --- TRUNK SPINE (cubic bezier — gentle organic S-curve) ---
  const wobble = W * 0.035;
  const trunk = {
    x0: cx, y0: baseY,
    cp1x: cx + wobble, cp1y: baseY - trunkHeight * 0.35,
    cp2x: cx - wobble * 0.7, cp2y: baseY - trunkHeight * 0.65,
    x3: cx - wobble * 0.2, y3: topY,
  };

  function trunkPoint(t) {
    const u = 1 - t;
    const x = u*u*u*trunk.x0 + 3*u*u*t*trunk.cp1x + 3*u*t*t*trunk.cp2x + t*t*t*trunk.x3;
    const y = u*u*u*trunk.y0 + 3*u*u*t*trunk.cp1y + 3*u*t*t*trunk.cp2y + t*t*t*trunk.y3;
    return { x, y };
  }

  // --- PRIMARY ROOTS (5 curves — spread to full phone width) ---
  const roots = [];
  const rootAngles = [-1.1, -0.55, 0, 0.55, 1.1];
  for (let i = 0; i < 5; i++) {
    const angle = rootAngles[i] + (Math.random() - 0.5) * 0.2;
    // Roots reach toward the edges of the screen
    const len = W * (0.35 + Math.random() * 0.15);
    const startX = cx + (Math.random() - 0.5) * 6;
    const startY = baseY;
    const endX = startX + Math.sin(angle) * len;
    const endY = startY + Math.abs(Math.cos(angle * 0.4)) * len * 0.25 + H * 0.06;
    // Organic curve — roots dip down then spread
    const cpx = startX + Math.sin(angle) * len * 0.5;
    const cpy = startY + H * 0.06 + Math.random() * H * 0.03;
    roots.push({
      x0: startX, y0: startY,
      cpx, cpy,
      x1: Math.max(W * 0.02, Math.min(W * 0.98, endX)), // clamp to screen
      y1: Math.min(endY, H * 0.95),
      lineWidth: 2.5 + Math.random() * 1.5,
    });
  }

  // --- SECONDARY ROOTS (branch off primary roots — 5 more) ---
  for (let i = 0; i < 5; i++) {
    const parent = roots[i];
    // Branch from midpoint of parent root
    const mt = 0.4 + Math.random() * 0.3;
    const mx = parent.x0*(1-mt)*(1-mt) + 2*(1-mt)*mt*parent.cpx + mt*mt*parent.x1;
    const my = parent.y0*(1-mt)*(1-mt) + 2*(1-mt)*mt*parent.cpy + mt*mt*parent.y1;
    const side = parent.x1 > cx ? 1 : -1;
    const subLen = W * (0.1 + Math.random() * 0.12);
    const subEndX = mx + side * subLen * (0.5 + Math.random() * 0.5);
    const subEndY = my + H * (0.03 + Math.random() * 0.04);
    roots.push({
      x0: mx, y0: my,
      cpx: (mx + subEndX) / 2 + (Math.random() - 0.5) * subLen * 0.3,
      cpy: my + H * 0.02 + Math.random() * H * 0.02,
      x1: Math.max(W * 0.02, Math.min(W * 0.98, subEndX)),
      y1: Math.min(subEndY, H * 0.95),
      lineWidth: 1.5 + Math.random() * 1,
    });
  }

  // --- BRANCH POINTS at Fibonacci fractions of trunk ---
  const branchTs = [0.25, 0.40, 0.55, 0.70, 0.88];
  const branches = [];
  const subBranches = [];
  const leaves = [];

  for (let i = 0; i < branchTs.length; i++) {
    const t = branchTs[i];
    const origin = trunkPoint(t);
    // Branches are wide — reach toward screen edges, widest in middle
    const canopyShape = 1 - Math.pow(Math.abs(t - 0.5) * 1.6, 1.5);
    const reach = W * (0.30 + Math.random() * 0.12) * Math.max(0.45, canopyShape);

    for (const side of [-1, 1]) {
      // Branches go outward then DROOP DOWN — like a real tree
      const outward = reach * (0.85 + Math.random() * 0.15);
      const endX = origin.x + side * outward;
      // Lower branches droop more, upper branches less
      const droopAmount = reach * (0.15 + (1 - t) * 0.25 + Math.random() * 0.1);
      const endY = origin.y + droopAmount;

      // Control point — arc up first, then gravity pulls the tip down
      const cpx = origin.x + side * reach * (0.45 + Math.random() * 0.1);
      const cpy = origin.y - reach * (0.15 + t * 0.15 + Math.random() * 0.08);

      const branch = {
        x0: origin.x, y0: origin.y,
        cpx, cpy,
        x1: Math.max(W * 0.03, Math.min(W * 0.97, endX)),
        y1: endY,
        lineWidth: 2.5 - i * 0.2 + Math.random() * 0.5,
        branchIndex: i,
      };
      branches.push(branch);

      // Sub-branch from outer portion — also droops
      if (subBranches.length < 7 && Math.random() < 0.7) {
        const mt = 0.5 + Math.random() * 0.3;
        const mx = branch.x0*(1-mt)*(1-mt) + 2*(1-mt)*mt*branch.cpx + mt*mt*branch.x1;
        const my = branch.y0*(1-mt)*(1-mt) + 2*(1-mt)*mt*branch.cpy + mt*mt*branch.y1;
        const subReach = reach * (0.3 + Math.random() * 0.2);
        const sx1 = mx + side * subReach * (0.4 + Math.random() * 0.4);
        const sy1 = my + subReach * (0.1 + Math.random() * 0.15); // droops
        subBranches.push({
          x0: mx, y0: my,
          cpx: (mx + sx1) / 2 + (Math.random() - 0.5) * subReach * 0.15,
          cpy: my - subReach * 0.05 + Math.random() * subReach * 0.05,
          x1: sx1, y1: sy1,
          lineWidth: 1.2 + Math.random() * 0.6,
        });

        // Leaf at sub-branch tip
        leaves.push({
          cx: sx1, cy: sy1,
          sides: [3, 5, 7][Math.floor(Math.random() * 3)],
          radius: 4 + Math.random() * 5,
          rotation: Math.random() * TAU,
          rotSpeed: (Math.random() - 0.5) * 0.002,
        });
      }

      // Leaf at branch tip (hangs at the droop point)
      leaves.push({
        cx: endX + (Math.random() - 0.5) * 10,
        cy: endY + Math.random() * 8,
        sides: [3, 5, 7][Math.floor(Math.random() * 3)],
        radius: 5 + Math.random() * 6,
        rotation: Math.random() * TAU,
        rotSpeed: (Math.random() - 0.5) * 0.002,
      });

      // Extra leaves along the branch for fullness
      if (Math.random() < 0.75) {
        const lt = 0.55 + Math.random() * 0.3;
        const lx = branch.x0*(1-lt)*(1-lt) + 2*(1-lt)*lt*branch.cpx + lt*lt*branch.x1;
        const ly = branch.y0*(1-lt)*(1-lt) + 2*(1-lt)*lt*branch.cpy + lt*lt*branch.y1;
        leaves.push({
          cx: lx + (Math.random() - 0.5) * 16,
          cy: ly + (Math.random() - 0.5) * 16,
          sides: [3, 5, 7][Math.floor(Math.random() * 3)],
          radius: 4 + Math.random() * 5,
          rotation: Math.random() * TAU,
          rotSpeed: (Math.random() - 0.5) * 0.002,
        });
      }
    }
  }

  // Scatter more leaves through canopy for lush fullness (target 23 — prime)
  while (leaves.length < 23) {
    const b = branches[Math.floor(Math.random() * branches.length)];
    const t = 0.4 + Math.random() * 0.5;
    const lx = b.x0*(1-t)*(1-t) + 2*(1-t)*t*b.cpx + t*t*b.x1;
    const ly = b.y0*(1-t)*(1-t) + 2*(1-t)*t*b.cpy + t*t*b.y1;
    leaves.push({
      cx: lx + (Math.random() - 0.5) * 24,
      cy: ly + (Math.random() - 0.5) * 20,
      sides: [3, 5, 7][Math.floor(Math.random() * 3)],
      radius: 4 + Math.random() * 5,
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
 * Indices that exceed the generated array length are safely skipped in canvas.
 *
 * Breath 1:  3 primary roots (spread to edges)
 * Breath 2:  2 primary roots + 3 secondary roots + trunk base
 * Breath 3:  2 secondary roots + trunk middle + first branch pair
 * Breath 4:  trunk top + second branch pair
 * Breath 5:  third branch pair + sub-branches begin
 * Breath 6:  remaining branches + sub-branches — TREE ALIVE
 * Breath 7:  first wave of leaves
 * Breath 8:  more leaves, canopy fills
 * Breath 9:  remaining leaves, lush canopy
 * Breath 10: extra sparkles (canvas handles)
 * Breath 11: final radiance (canvas handles)
 */
const REVEAL_SCHEDULE = [
  null, // 0 unused
  // Breath 1: 3 primary roots spread to edges
  { roots: [0, 1, 2], trunkSegs: [], branches: [], subBranches: [], leaves: [] },
  // Breath 2: 2 primary + 3 secondary roots + trunk base
  { roots: [3, 4, 5, 6, 7], trunkSegs: [0, 1], branches: [], subBranches: [], leaves: [] },
  // Breath 3: 2 secondary roots + trunk middle + first branch pair
  { roots: [8, 9], trunkSegs: [2], branches: [0, 1], subBranches: [], leaves: [] },
  // Breath 4: trunk top + second branch pair
  { roots: [], trunkSegs: [3, 4], branches: [2, 3], subBranches: [], leaves: [] },
  // Breath 5: third branch pair + sub-branches begin
  { roots: [], trunkSegs: [], branches: [4, 5], subBranches: [0, 1, 2], leaves: [] },
  // Breath 6: remaining branches + sub-branches — TREE ALIVE
  { roots: [], trunkSegs: [], branches: [6, 7, 8, 9], subBranches: [3, 4, 5, 6], leaves: [] },
  // Breath 7: first leaves
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [0, 1, 2, 3, 4, 5] },
  // Breath 8: more leaves — canopy fills
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [6, 7, 8, 9, 10, 11, 12] },
  // Breath 9: remaining leaves — lush
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
  // Breath 10: extra sparkles (canvas handles)
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [] },
  // Breath 11: final radiance (canvas handles)
  { roots: [], trunkSegs: [], branches: [], subBranches: [], leaves: [] },
];

export {
  TAU, MIN_ALPHA, SETTLE_AGE, MAX_SHAPES, MAX_DRIFT_SPARKLES,
  SLATE_FALLBACK,
  settleLife, glowStroke, pickTreeColor,
  generateTree, REVEAL_SCHEDULE,
};
