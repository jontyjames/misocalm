/**
 * focusTunnelRenderer.js — pure canvas rendering for the Focus sacred portal tunnel
 *
 * Ring-based tunnel: rings spawn at the far vanishing point (small, near centre)
 * and expand toward the viewer over their lifetime. Sacred geometric cross-sections.
 * Colour depth zones: cyan (back) -> indigo (middle) -> violet (front).
 * Sacred inscriptions appear along tunnel walls when flashes are captured.
 * Max 13 rings (prime). Shape waves change every 5 rings (prime).
 *
 * No React. Pure utility functions and classes.
 */

import { PHI, FIBONACCI_TIMING } from './constants';

const TAU = Math.PI * 2;
const MAX_RINGS = 13; // prime

// Solfeggio colour depth zones
const ZONE_CYAN   = { r: 34, g: 211, b: 238 }; // back (clarity, light ahead)
const ZONE_INDIGO = { r: 129, g: 140, b: 248 }; // middle (transformation)
const ZONE_VIOLET = { r: 167, g: 139, b: 250 }; // front (depth, passage)

// Prime polygon sides for tunnel rings
const RING_SIDES = [3, 5, 7];
// Star point options (prime)
const STAR_POINTS = [5, 7];

// Constant tunnel pace — steady travelling speed, never fluctuates
const TUNNEL_SPAWN_INTERVAL = FIBONACCI_TIMING.breathe; // 987ms (~6-7 rings visible)

// 7 sacred inscription mark types (prime count)
const MARK_TYPES = ['dot', 'circle', 'line', 'angle', 'triangle', 'arc', 'diamond'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// Get depth-zone colour based on expansion progress t (0=back, 1=front)
function zoneColour(t) {
  if (t < 0.33) return ZONE_CYAN;
  if (t < 0.66) return ZONE_INDIGO;
  return ZONE_VIOLET;
}

function rgba(col, a) {
  return `rgba(${col.r},${col.g},${col.b},${Math.max(0, a).toFixed(3)})`;
}

// ─── Drawing primitives ────────────────────────────────────────────

function strokePoly(ctx, cx, cy, r, sides, rot, colour, alpha) {
  if (r < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * TAU;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = rgba(colour, alpha);
  ctx.lineWidth = 1.3;
  ctx.stroke();
}

function strokeStar(ctx, cx, cy, oR, iR, pts, rot, colour, alpha) {
  if (oR < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= pts * 2; i++) {
    const a = rot + (i / (pts * 2)) * TAU;
    const r = i % 2 === 0 ? oR : iR;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = rgba(colour, alpha);
  ctx.lineWidth = 1.1;
  ctx.stroke();
}

function strokeNestedPoly(ctx, cx, cy, r, sides, rot, colour, alpha) {
  strokePoly(ctx, cx, cy, r, sides, rot, colour, alpha);
  strokePoly(ctx, cx, cy, r / PHI, sides, rot + TAU / (sides * 2), colour, alpha / PHI);
}

// ─── Tunnel Ring ───────────────────────────────────────────────────

// Shape wave types: polygon, star, nested polygon (cycle every 5 rings)
function createRingDrawFn(waveType, sides) {
  switch (waveType) {
    case 0: return (ctx, cx, cy, r, rot, col, a) => strokePoly(ctx, cx, cy, r, sides, rot, col, a);
    case 1: return (ctx, cx, cy, r, rot, col, a) => strokeStar(ctx, cx, cy, r, r * 0.5, sides, rot, col, a);
    case 2: return (ctx, cx, cy, r, rot, col, a) => strokeNestedPoly(ctx, cx, cy, r, sides, rot, col, a);
    default: return (ctx, cx, cy, r, rot, col, a) => strokePoly(ctx, cx, cy, r, sides, rot, col, a);
  }
}

class TunnelRing {
  constructor(index, waveType, waveSides) {
    this.age = 0;
    this.maxAge = 377; // fib-flow frames (~6.3s at 60fps)
    this.alive = true;
    this.index = index;
    this.baseRot = (index * TAU) / (waveSides * PHI); // phi-spiral twist between rings
    this.fn = createRingDrawFn(waveType, waveSides);
    this.sides = waveSides;
  }

  update() {
    this.age++;
    if (this.age > this.maxAge) this.alive = false;
  }

  draw(ctx, cx, cy, maxR) {
    if (!this.alive) return;
    const t = this.age / this.maxAge; // 0=back(far), 1=front(near)
    const scale = easeOutCubic(t);
    const r = 6 + scale * maxR; // 6px at back (phi-1), maxR at front

    // Opacity: faint at back (0.1), brightest at middle (~0.4), fade at front (0.1)
    let alpha;
    if (t < 0.33) {
      alpha = 0.1 + (t / 0.33) * 0.3; // 0.1 -> 0.4
    } else if (t < 0.66) {
      alpha = 0.4; // peak
    } else {
      alpha = 0.4 - ((t - 0.66) / 0.34) * 0.3; // 0.4 -> 0.1
    }

    const colour = zoneColour(t);
    this.fn(ctx, cx, cy, r, this.baseRot, colour, alpha);
  }
}

// ─── Sacred Inscription Mark ───────────────────────────────────────

class InscriptionMark {
  constructor(ringAge, ringMaxAge, angle, markType) {
    this.birthAge = ringAge; // tunnel depth when created
    this.ringMaxAge = ringMaxAge;
    this.angle = angle; // position around ring circumference
    this.type = markType;
    this.life = 0;
    this.maxLife = 610; // fib-ease frames (~10s, persists into free play)
    this.alive = true;
    this.size = 6 + Math.random() * 4; // phi-0 to phi-1 (6–10px)
  }

  update() {
    this.life++;
    if (this.life > this.maxLife) this.alive = false;
  }

  // Draw at current tunnel position (scrolls with tunnel)
  draw(ctx, cx, cy, maxR) {
    if (!this.alive) return;
    // The mark was born at a certain tunnel depth. As time passes, it scrolls forward.
    const tunnelAge = this.birthAge + this.life;
    const t = Math.min(tunnelAge / this.ringMaxAge, 1);
    const scale = easeOutCubic(t);
    const ringR = 6 + scale * maxR;

    // Fade: bright on appearance (0.6), then dim persistence (0.1)
    const lifeFrac = this.life / this.maxLife;
    const alpha = lifeFrac < 0.1
      ? 0.6 * (lifeFrac / 0.1) // fade in
      : lifeFrac < 0.3
        ? 0.6 // bright
        : 0.6 - (lifeFrac - 0.3) / 0.7 * 0.5; // 0.6 -> 0.1

    if (alpha < 0.005 || t >= 1) return;

    const colour = zoneColour(t);
    const mx = cx + Math.cos(this.angle) * ringR;
    const my = cy + Math.sin(this.angle) * ringR;
    const s = this.size;

    ctx.strokeStyle = rgba(colour, alpha);
    ctx.fillStyle = rgba(colour, alpha * 0.5);
    ctx.lineWidth = 0.8;

    switch (this.type) {
      case 'dot':
        ctx.beginPath(); ctx.arc(mx, my, s * 0.4, 0, TAU); ctx.fill();
        break;
      case 'circle':
        ctx.beginPath(); ctx.arc(mx, my, s * 0.5, 0, TAU); ctx.stroke();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(mx - s * 0.4, my); ctx.lineTo(mx + s * 0.4, my);
        ctx.stroke();
        break;
      case 'angle':
        ctx.beginPath();
        ctx.moveTo(mx - s * 0.3, my - s * 0.3);
        ctx.lineTo(mx, my + s * 0.3);
        ctx.lineTo(mx + s * 0.3, my - s * 0.3);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        for (let i = 0; i <= 3; i++) {
          const a = this.angle + (i / 3) * TAU;
          const px = mx + Math.cos(a) * s * 0.4;
          const py = my + Math.sin(a) * s * 0.4;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        break;
      case 'arc':
        ctx.beginPath();
        ctx.arc(mx, my, s * 0.5, 0, Math.PI * 1.2);
        ctx.stroke();
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(mx, my - s * 0.4);
        ctx.lineTo(mx + s * 0.3, my);
        ctx.lineTo(mx, my + s * 0.4);
        ctx.lineTo(mx - s * 0.3, my);
        ctx.closePath();
        ctx.stroke();
        break;
    }
  }
}

// ─── Capture Ripple ────────────────────────────────────────────────

class CaptureRipple {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.age = 0;
    this.alive = true;
  }

  update() { this.age++; if (this.age > 23) this.alive = false; }

  draw(ctx) {
    if (!this.alive) return;
    const t = this.age / 23; // ~377ms at 60fps
    const r = t * 68; // expand to phi-6
    const a = 0.35 * (1 - t);
    if (a < 0.005) return;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
    g.addColorStop(0, `rgba(34,211,238,${a})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, TAU); ctx.fill();
  }
}

// ─── Play Beam (free play) ─────────────────────────────────────────

class PlayBeam {
  constructor(x, y) { this.x = x; this.y = y; this.age = 0; this.alive = true; }
  update() { this.age++; if (this.age > 23) this.alive = false; }
  draw(ctx, cx, cy) {
    const a = this.alive ? 0.35 * (1 - this.age / 23) : 0;
    if (a < 0.005) return;
    ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(cx, cy);
    ctx.strokeStyle = `rgba(34,211,238,${a})`; ctx.lineWidth = 1; ctx.stroke();
  }
}

// ─── Tunnel State (mutable, owned by ref in React) ─────────────────

export function createTunnelState() {
  return {
    rings: [],
    inscriptions: [],
    ripples: [],
    beams: [],
    time: 0,
    lastAutoSpawn: 0,
    lastCapturedCount: 0,
    bloomStart: -1,
    lastPlayTouchId: 0,
    ringCounter: 0,       // total rings spawned (for wave tracking)
    waveType: 0,          // current shape wave type (0=poly, 1=star, 2=nested)
    waveSides: pick(RING_SIDES),
  };
}

function advanceWave(state) {
  // Change shape every 5 rings (prime)
  const waveTypes = [0, 1, 2];
  state.waveType = waveTypes[(waveTypes.indexOf(state.waveType) + 1) % waveTypes.length];
  state.waveSides = pick(state.waveType === 1 ? STAR_POINTS : RING_SIDES);
}

function spawnRing(state) {
  const ring = new TunnelRing(state.ringCounter, state.waveType, state.waveSides);
  // All rings same maxAge (377) — newer rings can NEVER overtake older ones
  state.rings.push(ring);
  state.ringCounter++;

  // Advance wave every 5 rings (prime)
  if (state.ringCounter % 5 === 0) advanceWave(state);

  // Enforce max 13 rings (prime)
  while (state.rings.length > MAX_RINGS) state.rings.shift();
}

function spawnInscriptions(state, flashPositionPx, cx, cy, maxR) {
  // Find the closest ring to compute depth
  const nearestRing = state.rings.length > 0 ? state.rings[state.rings.length - 1] : null;
  const birthAge = nearestRing ? nearestRing.age : 0;
  const ringMaxAge = nearestRing ? nearestRing.maxAge : 377;

  // Angle from centre to flash position
  const baseAngle = Math.atan2(flashPositionPx.y - cy, flashPositionPx.x - cx);

  // 3-5 marks per capture (prime range)
  const count = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
  const actualCount = count === 4 ? 3 : count; // keep prime: 3 or 5

  for (let i = 0; i < actualCount; i++) {
    const angle = baseAngle + (i - (actualCount - 1) / 2) * 0.3; // spread around capture point
    const markType = pick(MARK_TYPES);
    state.inscriptions.push(new InscriptionMark(birthAge, ringMaxAge, angle, markType));
  }
}

// ─── Main render function ──────────────────────────────────────────

export function renderTunnel(ctx, W, H, state, props) {
  const cx = W / 2, cy = H / 2;
  // Rings must expand past all screen edges (tunnel you travel through)
  const maxR = Math.max(W, H) * 0.8;
  const now = Date.now();
  state.time += 16;

  ctx.clearRect(0, 0, W, H);

  const { flashVisible, flashPosition, flashCaptured, totalCaptured, complete, playTouch } = props;

  // ── Capture: ring + inscriptions + ripple ──
  if (totalCaptured > state.lastCapturedCount) {
    spawnRing(state);
    // Spawn inscriptions at flash position
    if (flashPosition) {
      const fpx = { x: (flashPosition.x / 100) * W, y: (flashPosition.y / 100) * H };
      spawnInscriptions(state, fpx, cx, cy, maxR);
      state.ripples.push(new CaptureRipple(fpx.x, fpx.y));
    }
    state.lastCapturedCount = totalCaptured;
  }

  // ── Constant auto-spawn — steady tunnel pace ──
  if (now - state.lastAutoSpawn > TUNNEL_SPAWN_INTERVAL && state.rings.length < MAX_RINGS) {
    spawnRing(state);
    state.lastAutoSpawn = now;
  }

  // ── Play touch: beam + ripple + ring + inscriptions ──
  if (playTouch && playTouch.id > state.lastPlayTouchId) {
    state.lastPlayTouchId = playTouch.id;
    state.beams.push(new PlayBeam(playTouch.x, playTouch.y));
    state.ripples.push(new CaptureRipple(playTouch.x, playTouch.y));
    spawnRing(state);
    // Sacred inscriptions continue in free play
    spawnInscriptions(state, { x: playTouch.x, y: playTouch.y }, cx, cy, maxR);
  }

  // ── Update + garbage collect ──
  for (let i = state.rings.length - 1; i >= 0; i--) {
    state.rings[i].update();
    if (!state.rings[i].alive) state.rings.splice(i, 1);
  }
  for (let i = state.inscriptions.length - 1; i >= 0; i--) {
    state.inscriptions[i].update();
    if (!state.inscriptions[i].alive) state.inscriptions.splice(i, 1);
  }
  for (let i = state.ripples.length - 1; i >= 0; i--) {
    state.ripples[i].update();
    if (!state.ripples[i].alive) state.ripples.splice(i, 1);
  }
  for (let i = state.beams.length - 1; i >= 0; i--) {
    state.beams[i].update();
    if (!state.beams[i].alive) state.beams.splice(i, 1);
  }

  // ── Draw rings (oldest=back first) ──
  for (const ring of state.rings) ring.draw(ctx, cx, cy, maxR);

  // ── Draw inscriptions ──
  for (const mark of state.inscriptions) mark.draw(ctx, cx, cy, maxR);

  // ── Draw capture ripples + play beams ──
  for (const rp of state.ripples) rp.draw(ctx);
  for (const bm of state.beams) bm.draw(ctx, cx, cy);

  // ── Bloom detection (completion) ──
  if (complete && state.bloomStart < 0) state.bloomStart = state.time;
  const bloom = state.bloomStart >= 0 ? state.time - state.bloomStart : -1;

  // ── Centre vanishing point ──
  const breathe = 1 + Math.sin(state.time * 0.003) * 0.3;
  let dotR = 6 * breathe; // phi-0 base
  if (bloom >= 0) {
    if (bloom < 987) { const t = bloom / 987; dotR += t * t * (10 - dotR); }
    else if (bloom < 2584) { dotR = 10; } // phi-1 peak
    else if (bloom < 4181) { dotR = 10 - ((bloom - 2584) / 1597) * (10 - 6 * breathe); }
  }

  // Radial glow around vanishing point
  const glowR = bloom >= 0 && bloom < 2584 ? 42 + (bloom / 2584) * 26 : 42;
  const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
  gg.addColorStop(0, 'rgba(226,232,240,0.06)');
  gg.addColorStop(1, 'transparent');
  ctx.fillStyle = gg;
  ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, TAU); ctx.fill();

  // Centre dot
  ctx.beginPath(); ctx.arc(cx, cy, dotR, 0, TAU);
  ctx.fillStyle = `rgba(226,232,240,${(0.5 + breathe * 0.2).toFixed(3)})`;
  ctx.fill();

  // ── Flash — bright orb at spatial position ──
  if (flashVisible && flashPosition) {
    const fx = (flashPosition.x / 100) * W;
    const fy = (flashPosition.y / 100) * H;
    const fR = flashCaptured ? 42 : 26; // phi-5 / phi-4
    const fA = flashCaptured ? 0.6 : 0.45;

    // Outer glow
    const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fR);
    fg.addColorStop(0, `rgba(34,211,238,${fA})`);
    fg.addColorStop(0.4, `rgba(34,211,238,${fA * 0.4})`);
    fg.addColorStop(1, 'transparent');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.arc(fx, fy, fR, 0, TAU); ctx.fill();

    // Bright core
    ctx.beginPath(); ctx.arc(fx, fy, 6, 0, TAU); // phi-0 core
    ctx.fillStyle = `rgba(226,232,240,${(fA * 0.9).toFixed(3)})`;
    ctx.fill();

    // Connection line to centre on capture
    if (flashCaptured) {
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(fx, fy);
      ctx.strokeStyle = 'rgba(34,211,238,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
