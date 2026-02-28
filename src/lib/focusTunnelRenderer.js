/**
 * focusTunnelRenderer.js — state management and render loop for Focus tunnel
 *
 * Rings spawn at centre, expand toward viewer with easeOutCubic depth curve.
 * Neon wall glow, capture surge, sacred inscriptions.
 *
 * Sacred numbers:
 * - MAX_RINGS: 13 (prime)
 * - Spawn interval: 987ms (fib-breathe)
 * - Rotation: one revolution per 21s (21 = Fibonacci)
 * - Surge: PHI multiplier for 55 frames (fib-fast)
 * - maxR: max(W,H) / PHI (golden section of screen)
 * - Wave change: every 5 rings (prime)
 *
 * Drawing primitives in: focusTunnelPrimitives.js
 */

import { PHI, FIBONACCI_TIMING } from './constants';
import {
  TAU, pick,
  RING_SIDES, STAR_POINTS, MARK_TYPES,
  TunnelRing, InscriptionMark, CaptureRipple, PlayBeam,
} from './focusTunnelPrimitives';

const MAX_RINGS = 13; // prime

// One full revolution per 21 seconds (21 = Fibonacci)
const TUNNEL_ROT_RATE = TAU / 21000;

// Spawn pace: nervous-system breathe rhythm
const TUNNEL_SPAWN_INTERVAL = FIBONACCI_TIMING.breathe; // 987ms

// ─── Tunnel State ──────────────────────────────────────────────────

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
    ringCounter: 0,
    waveType: 0,
    waveSides: pick(RING_SIDES),
    surgeFrames: 0,
    surgeMultiplier: 1,
  };
}

function advanceWave(state) {
  const waveTypes = [0, 1, 2];
  state.waveType = waveTypes[(waveTypes.indexOf(state.waveType) + 1) % waveTypes.length];
  state.waveSides = pick(state.waveType === 1 ? STAR_POINTS : RING_SIDES);
}

function spawnRing(state) {
  state.rings.push(new TunnelRing(state.ringCounter, state.waveType, state.waveSides));
  state.ringCounter++;
  if (state.ringCounter % 5 === 0) advanceWave(state); // prime wave cycle
  while (state.rings.length > MAX_RINGS) state.rings.shift();
}

function spawnInscriptions(state, fpx, cx, cy) {
  const nearestRing = state.rings.length > 0 ? state.rings[state.rings.length - 1] : null;
  const birthAge = nearestRing ? nearestRing.age : 0;
  const ringMaxAge = nearestRing ? nearestRing.maxAge : 377;
  const baseAngle = Math.atan2(fpx.y - cy, fpx.x - cx);
  const count = 3 + Math.floor(Math.random() * 3);
  const actualCount = count === 4 ? 3 : count; // keep prime: 3 or 5

  for (let i = 0; i < actualCount; i++) {
    const angle = baseAngle + (i - (actualCount - 1) / 2) * 0.3;
    state.inscriptions.push(new InscriptionMark(birthAge, ringMaxAge, angle, pick(MARK_TYPES)));
  }
}

// ─── Main render function ──────────────────────────────────────────

export function renderTunnel(ctx, W, H, state, props) {
  const cx = W / 2, cy = H / 2;
  const maxR = Math.max(W, H) / PHI; // golden section — rings exit before curve stalls
  const now = Date.now();
  state.time += 16;

  ctx.clearRect(0, 0, W, H);

  // Global tunnel rotation — constant pace, not affected by surge
  const globalRot = state.time * TUNNEL_ROT_RATE;

  // Surge decay: PHI multiplier for fib-fast frames
  if (state.surgeFrames > 0) {
    state.surgeFrames--;
    state.surgeMultiplier = PHI;
    if (state.surgeFrames === 0) state.surgeMultiplier = 1;
  }

  const { flashVisible, flashPosition, flashCaptured, totalCaptured, complete, playTouch } = props;

  // ── Capture: ring + inscriptions + ripple + surge ──
  if (totalCaptured > state.lastCapturedCount) {
    spawnRing(state);
    if (flashPosition) {
      const fpx = { x: (flashPosition.x / 100) * W, y: (flashPosition.y / 100) * H };
      spawnInscriptions(state, fpx, cx, cy);
      state.ripples.push(new CaptureRipple(fpx.x, fpx.y));
    }
    state.lastCapturedCount = totalCaptured;
    state.surgeFrames = FIBONACCI_TIMING.fast; // 55 frames
  }

  // ── Constant auto-spawn — breathe rhythm ──
  if (now - state.lastAutoSpawn > TUNNEL_SPAWN_INTERVAL && state.rings.length < MAX_RINGS) {
    spawnRing(state);
    state.lastAutoSpawn = now;
  }

  // ── Play touch: beam + ripple + ring + inscriptions + surge ──
  if (playTouch && playTouch.id > state.lastPlayTouchId) {
    state.lastPlayTouchId = playTouch.id;
    state.beams.push(new PlayBeam(playTouch.x, playTouch.y));
    state.ripples.push(new CaptureRipple(playTouch.x, playTouch.y));
    spawnRing(state);
    spawnInscriptions(state, { x: playTouch.x, y: playTouch.y }, cx, cy);
    state.surgeFrames = FIBONACCI_TIMING.fast; // 55 frames
  }

  // ── Update: surge ONLY affects rings (nervous system safety) ──
  const sm = state.surgeMultiplier;
  for (let i = state.rings.length - 1; i >= 0; i--) {
    state.rings[i].update(sm);
    if (!state.rings[i].alive) state.rings.splice(i, 1);
  }
  for (let i = state.inscriptions.length - 1; i >= 0; i--) {
    state.inscriptions[i].update(); // constant pace
    if (!state.inscriptions[i].alive) state.inscriptions.splice(i, 1);
  }
  for (let i = state.ripples.length - 1; i >= 0; i--) {
    state.ripples[i].update(); // constant pace
    if (!state.ripples[i].alive) state.ripples.splice(i, 1);
  }
  for (let i = state.beams.length - 1; i >= 0; i--) {
    state.beams[i].update(); // constant pace
    if (!state.beams[i].alive) state.beams.splice(i, 1);
  }

  // ── Draw rings (oldest=back first, all share globalRot) ──
  for (const ring of state.rings) ring.draw(ctx, cx, cy, maxR, globalRot);

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
  let dotR = 6 * breathe;
  if (bloom >= 0) {
    if (bloom < 987) { const t = bloom / 987; dotR += t * t * (10 - dotR); }
    else if (bloom < 2584) { dotR = 10; }
    else if (bloom < 4181) { dotR = 10 - ((bloom - 2584) / 1597) * (10 - 6 * breathe); }
  }

  const glowR = bloom >= 0 && bloom < 2584 ? 42 + (bloom / 2584) * 26 : 42;
  const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
  gg.addColorStop(0, 'rgba(226,232,240,0.06)');
  gg.addColorStop(1, 'transparent');
  ctx.fillStyle = gg;
  ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, TAU); ctx.fill();

  ctx.beginPath(); ctx.arc(cx, cy, dotR, 0, TAU);
  ctx.fillStyle = `rgba(226,232,240,${(0.5 + breathe * 0.2).toFixed(3)})`;
  ctx.fill();

  // ── Flash — bright orb at spatial position ──
  if (flashVisible && flashPosition) {
    const fx = (flashPosition.x / 100) * W;
    const fy = (flashPosition.y / 100) * H;
    const fR = flashCaptured ? 42 : 26;
    const fA = flashCaptured ? 0.6 : 0.45;

    const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fR);
    fg.addColorStop(0, `rgba(34,211,238,${fA})`);
    fg.addColorStop(0.4, `rgba(34,211,238,${fA * 0.4})`);
    fg.addColorStop(1, 'transparent');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.arc(fx, fy, fR, 0, TAU); ctx.fill();

    ctx.beginPath(); ctx.arc(fx, fy, 6, 0, TAU);
    ctx.fillStyle = `rgba(226,232,240,${(fA * 0.9).toFixed(3)})`;
    ctx.fill();

    if (flashCaptured) {
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(fx, fy);
      ctx.strokeStyle = 'rgba(34,211,238,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
