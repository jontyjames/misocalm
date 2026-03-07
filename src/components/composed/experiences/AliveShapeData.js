/**
 * AliveShapeData — tendril spawning + sector-based coverage
 *
 * Living Light: bioluminescent organism grows from seed dot.
 * 71 tendrils (prime) across 11 breaths. 13 sectors (prime) ensure
 * full-screen coverage. All tendrils radiate from center.
 *
 * Sacred numbers: tendril counts all prime, total 71 (prime),
 * 13 sectors (prime), bloom-in 34 frames (Fibonacci),
 * glow stops at phi (0.382, 0.618).
 */

const TAU = Math.PI * 2;
const MAX_DRIFT_SPARKLES = 89; // Fibonacci
const SLATE_FALLBACK = { r: 148, g: 163, b: 184 };

// Tendril counts per breath — all prime, total 71 (prime)
const TENDRIL_COUNTS = [5, 3, 5, 3, 7, 5, 7, 5, 7, 11, 13];

// 13 sectors (prime) for full-screen coverage
const SECTOR_COUNT = 13;

// Bloom-in duration (Fibonacci)
const BLOOM_FRAMES = 34;

/**
 * Pick angles targeting emptiest sectors.
 * sectorCounts: mutable 13-element array tracking tendrils per sector.
 */
function pickTendrilAngles(count, sectorCounts) {
  const angles = [];
  const sectorWidth = TAU / SECTOR_COUNT;

  for (let i = 0; i < count; i++) {
    let minCount = Infinity;
    let candidates = [];
    for (let s = 0; s < SECTOR_COUNT; s++) {
      if (sectorCounts[s] < minCount) {
        minCount = sectorCounts[s];
        candidates = [s];
      } else if (sectorCounts[s] === minCount) {
        candidates.push(s);
      }
    }
    const sector = candidates[Math.floor(Math.random() * candidates.length)];
    sectorCounts[sector]++;

    const baseAngle = sector * sectorWidth;
    const jitter = (Math.random() - 0.5) * sectorWidth * 0.8;
    angles.push(baseAngle + sectorWidth / 2 + jitter);
  }
  return angles;
}

/**
 * Map breath index (1-11) to palette color index (0-4).
 * 0=grounding, 1=building, 2=transformation, 3=expression, 4=transcendence
 */
function pickTendrilColor(breathIndex, palette) {
  if (!palette || palette.length === 0) return SLATE_FALLBACK;
  const idx = (breathIndex - 1) % palette.length;
  return palette[idx];
}

function pickRingColor(breathIndex, palette) {
  return pickTendrilColor(breathIndex, palette);
}

/**
 * Draw the seed dot — breathing center glow, always on top.
 * baseRadius 8 (was 5), halo radius * 8 (was * 5) for more presence.
 */
function drawSeedDot(ctx, cx, cy, breatheScale, palette, time, freePlay) {
  const color = palette && palette.length > 0 ? palette[0] : SLATE_FALLBACK;
  const { r, g, b } = color;
  const baseRadius = freePlay
    ? 8 + 13 * (0.5 + 0.5 * Math.sin(time * 0.003))
    : 8;
  const radius = baseRadius * (0.8 + 0.4 * breatheScale);

  ctx.globalCompositeOperation = 'source-over';

  // Outer halo
  const haloRadius = radius * 8;
  const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloRadius);
  haloGrad.addColorStop(0, `rgba(${r},${g},${b},${0.15 * breatheScale})`);
  haloGrad.addColorStop(0.382, `rgba(${r},${g},${b},${0.08 * breatheScale})`);
  haloGrad.addColorStop(0.618, `rgba(${r},${g},${b},${0.03 * breatheScale})`);
  haloGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, haloRadius, 0, TAU);
  ctx.fillStyle = haloGrad;
  ctx.fill();

  // Core dot
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  const cR = Math.min(255, r + 50);
  const cG = Math.min(255, g + 50);
  const cB = Math.min(255, b + 50);
  coreGrad.addColorStop(0, `rgba(${cR},${cG},${cB},${0.9 * breatheScale})`);
  coreGrad.addColorStop(0.618, `rgba(${r},${g},${b},${0.5 * breatheScale})`);
  coreGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fillStyle = coreGrad;
  ctx.fill();
}

/**
 * Spawn tendrils for a given breath.
 * Returns array of tendril configs for Tendril class.
 */
function spawnTendrils(breathIndex, cx, cy, W, H, palette, sectorCounts) {
  const idx = breathIndex - 1;
  if (idx < 0) return [];

  const isFreePlay = idx >= TENDRIL_COUNTS.length;
  const count = isFreePlay
    ? TENDRIL_COUNTS[idx % TENDRIL_COUNTS.length]
    : TENDRIL_COUNTS[idx];
  const diagonal = Math.sqrt(W * W + H * H);
  const angles = pickTendrilAngles(count, sectorCounts);
  const configs = [];

  for (let i = 0; i < count; i++) {
    const angle = angles[i];
    // Later breaths reach further (cap at 11 for free play)
    const effectiveBreath = isFreePlay ? ((idx % 11) + 1) : breathIndex;
    const reachScale = 0.6 + (effectiveBreath / 11) * 0.5;
    const maxLength = diagonal * (0.08 + Math.random() * 0.30) * reachScale;
    const color = pickTendrilColor(breathIndex, palette);
    const wobblePhase = Math.random() * TAU;
    const wobbleSpeed = 0.013 + Math.random() * 0.027;
    const wobbleAmp = 8 + Math.random() * 27;

    configs.push({
      startX: cx, startY: cy, angle, maxLength, color,
      wobblePhase, wobbleSpeed, wobbleAmp,
      lifespan: isFreePlay ? 610 : null,
    });
  }
  return configs;
}

export {
  TAU, MAX_DRIFT_SPARKLES, SLATE_FALLBACK, BLOOM_FRAMES,
  SECTOR_COUNT, TENDRIL_COUNTS,
  spawnTendrils, pickTendrilColor, pickRingColor, drawSeedDot,
};
