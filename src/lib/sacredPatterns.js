/**
 * Sacred Geometry SVG Patterns for MantraOverlay
 * 7 patterns (prime), each a minimal SVG with thin strokes.
 * These render behind mantra text as soft, glowing geometry.
 */

const SIZE = 340;
const HALF = SIZE / 2;
const R = 68; // phi-6 from sacred scale

/** Flower of Life - 7 overlapping circles in hexagonal arrangement */
function FlowerOfLife({ color }) {
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
      <circle cx={HALF} cy={HALF} r={R} fill="none" stroke={color} strokeWidth={1.2} />
      {angles.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const cx = HALF + R * Math.cos(rad);
        const cy = HALF + R * Math.sin(rad);
        return <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={1.2} />;
      })}
    </svg>
  );
}

/** Sri Yantra - nested triangles pointing up and down */
function SriYantra({ color }) {
  const layers = [
    { r: 110, up: true },
    { r: 89, up: false },
    { r: 68, up: true },
    { r: 50, up: false },
    { r: 34, up: true },
  ];
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
      {layers.map(({ r, up }, i) => {
        const h = r * (Math.sqrt(3) / 2);
        const y1 = up ? HALF - h * 0.67 : HALF + h * 0.67;
        const y2 = up ? HALF + h * 0.33 : HALF - h * 0.33;
        const pts = up
          ? `${HALF},${y1} ${HALF - r},${y2} ${HALF + r},${y2}`
          : `${HALF},${y1} ${HALF - r},${y2} ${HALF + r},${y2}`;
        return <polygon key={i} points={pts} fill="none" stroke={color} strokeWidth={1} />;
      })}
      <circle cx={HALF} cy={HALF} r={110} fill="none" stroke={color} strokeWidth={0.8} />
    </svg>
  );
}

/** Metatron's Cube - 13 circles connected by lines */
function MetatronsCube({ color }) {
  const centres = [{ x: HALF, y: HALF }];
  const innerR = 42;
  const outerR = 89;
  for (let a = 0; a < 360; a += 60) {
    const rad = (a * Math.PI) / 180;
    centres.push({ x: HALF + innerR * Math.cos(rad), y: HALF + innerR * Math.sin(rad) });
    centres.push({ x: HALF + outerR * Math.cos(rad), y: HALF + outerR * Math.sin(rad) });
  }
  const lines = [];
  for (let i = 0; i < centres.length; i++) {
    for (let j = i + 1; j < centres.length; j++) {
      lines.push({ x1: centres[i].x, y1: centres[i].y, x2: centres[j].x, y2: centres[j].y });
    }
  }
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
      {lines.map((l, i) => (
        <line key={`l${i}`} {...l} stroke={color} strokeWidth={0.4} />
      ))}
      {centres.map((c, i) => (
        <circle key={`c${i}`} cx={c.x} cy={c.y} r={10} fill="none" stroke={color} strokeWidth={1} />
      ))}
    </svg>
  );
}

/** Seed of Life - 7 overlapping circles, tighter than Flower */
function SeedOfLife({ color }) {
  const r = 42;
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
      <circle cx={HALF} cy={HALF} r={r} fill="none" stroke={color} strokeWidth={1.3} />
      {angles.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={HALF + r * Math.cos(rad)}
            cy={HALF + r * Math.sin(rad)}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={1.3}
          />
        );
      })}
      <circle cx={HALF} cy={HALF} r={r * 2.1} fill="none" stroke={color} strokeWidth={0.8} />
    </svg>
  );
}

/** Torus - concentric ellipses suggesting toroidal flow */
function Torus({ color }) {
  const rings = [0.3, 0.5, 0.7, 0.85, 1.0];
  const crossRings = 7;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
      {/* Horizontal ellipses (cross-sections) */}
      {rings.map((s, i) => (
        <ellipse
          key={`h${i}`}
          cx={HALF}
          cy={HALF}
          rx={110 * s}
          ry={42 * s}
          fill="none"
          stroke={color}
          strokeWidth={1}
        />
      ))}
      {/* Vertical cross-rings */}
      {Array.from({ length: crossRings }).map((_, i) => {
        const angle = (i * 180) / crossRings;
        const rad = (angle * Math.PI) / 180;
        const rx = 42;
        const ry = 110;
        return (
          <ellipse
            key={`v${i}`}
            cx={HALF}
            cy={HALF}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={color}
            strokeWidth={0.7}
            transform={`rotate(${angle} ${HALF} ${HALF})`}
            style={{ transformOrigin: `${HALF}px ${HALF}px` }}
          />
        );
      })}
    </svg>
  );
}

/** Vesica Piscis - two overlapping circles creating the sacred almond */
function VesicaPiscis({ color }) {
  const r = 89;
  const offset = r * 0.5;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
      <circle cx={HALF - offset} cy={HALF} r={r} fill="none" stroke={color} strokeWidth={1.2} />
      <circle cx={HALF + offset} cy={HALF} r={r} fill="none" stroke={color} strokeWidth={1.2} />
      {/* Outer containing circle */}
      <circle cx={HALF} cy={HALF} r={r + offset * 0.5} fill="none" stroke={color} strokeWidth={0.6} />
      {/* Inner almond highlight */}
      <ellipse cx={HALF} cy={HALF} rx={r * 0.37} ry={r * 0.78} fill="none" stroke={color} strokeWidth={0.8} />
    </svg>
  );
}

/** Golden Spiral - Fibonacci spiral approximation from centre outward */
function GoldenSpiral({ color }) {
  // Build spiral as a series of quarter-circle arcs using fibonacci radii
  const fibs = [5, 8, 13, 21, 34, 55, 89];
  let path = `M ${HALF} ${HALF}`;
  let cx = HALF;
  let cy = HALF;
  // Each quarter turn, the centre shifts and radius grows
  const directions = [
    { dx: 1, dy: 0, sweep: 1 },
    { dx: 0, dy: 1, sweep: 1 },
    { dx: -1, dy: 0, sweep: 1 },
    { dx: 0, dy: -1, sweep: 1 },
  ];
  let x = HALF;
  let y = HALF;
  fibs.forEach((r, i) => {
    const d = directions[i % 4];
    const endX = x + d.dx * r + d.dy * r;
    const endY = y + d.dy * r - d.dx * r;
    // Use the actual arc command for smooth quarter circles
    path += ` A ${r} ${r} 0 0 ${d.sweep} ${endX} ${endY}`;
    x = endX;
    y = endY;
  });

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
      <path d={path} fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Golden rectangle guides */}
      {fibs.slice(2).map((r, i) => (
        <rect
          key={i}
          x={HALF - r}
          y={HALF - r}
          width={r * 2}
          height={r * 2}
          fill="none"
          stroke={color}
          strokeWidth={0.4}
          rx={2}
          transform={`rotate(${i * 90} ${HALF} ${HALF})`}
        />
      ))}
    </svg>
  );
}

/** All 7 patterns (prime count) */
export const SACRED_PATTERNS = [
  { name: 'Flower of Life', Component: FlowerOfLife },
  { name: 'Sri Yantra', Component: SriYantra },
  { name: "Metatron's Cube", Component: MetatronsCube },
  { name: 'Seed of Life', Component: SeedOfLife },
  { name: 'Torus', Component: Torus },
  { name: 'Vesica Piscis', Component: VesicaPiscis },
  { name: 'Golden Spiral', Component: GoldenSpiral },
];
