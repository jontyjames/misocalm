/**
 * FocusCanvas — sacred geometry tunnel with peripheral flashes
 *
 * Shapes spawn at centre and expand outward creating tunnel depth.
 * Each captured flash adds a brighter shape, persistent spoke, and capture ripple.
 * Phase-responsive tunnel density mirrors the titration curve.
 * Completion bloom: spokes brighten, centre grows, colour shifts to white.
 * Solfeggio palette: cyan (741Hz), indigo (528Hz), violet (852Hz).
 * Max 13 concurrent shapes (prime). Counts: [3,5,7,11] all prime.
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '@/hooks';

const TAU = Math.PI * 2;
const MAX_SHAPES = 13;

const TUNNEL_COLORS = [
  'rgba(34,211,238,A)',   // cyan-400  (741Hz)
  'rgba(34,211,238,A)',   // cyan-400  (weighted)
  'rgba(129,140,248,A)',  // indigo-400 (528Hz)
  'rgba(167,139,250,A)',  // violet-400 (852Hz)
];

const POLY_SIDES = [3, 5, 7];
const STAR_POINTS = [5, 7, 11];

// Phase-responsive spawn intervals (all Fibonacci)
const PHASE_SPAWN = {
  PROMPT: 2584, INTRO: 2584, FIRST_BLOOM: 1597,
  DEEPENING: 987, FLOW: 610, TEACHING: 1597, COMPLETE: 1597,
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function c(tpl, a) { return tpl.replace('A', Math.max(0, a).toFixed(3)); }

// -- Drawing primitives (adapted from groundingCompositions.js) --

function strokePoly(ctx, cx, cy, r, sides, rot, color, alpha) {
  if (r < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * TAU;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = 1.3; ctx.stroke();
}

function strokeStar(ctx, cx, cy, oR, iR, pts, rot, color, alpha) {
  if (oR < 1) return;
  ctx.beginPath();
  for (let i = 0; i <= pts * 2; i++) {
    const a = rot + (i / (pts * 2)) * TAU;
    const r = i % 2 === 0 ? oR : iR;
    const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = 1.1; ctx.stroke();
}

function strokeCircle(ctx, cx, cy, r, color, alpha) {
  if (r < 1) return;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = 1.2; ctx.stroke();
}

function strokeArcs(ctx, cx, cy, r, count, arcLen, rot, color, alpha) {
  if (r < 1) return;
  ctx.strokeStyle = c(color, alpha); ctx.lineWidth = 1.1;
  for (let i = 0; i < count; i++) {
    const sa = rot + (i / count) * TAU;
    ctx.beginPath(); ctx.arc(cx, cy, r, sa, sa + arcLen); ctx.stroke();
  }
}

// Pre-compute random shape at creation time (never inside render loop)
function createShapeDraw() {
  const t = Math.floor(Math.random() * 5);
  switch (t) {
    case 0: { const n = pick(POLY_SIDES); return (x,cx,cy,r,rot,cl,a) => strokePoly(x,cx,cy,r,n,rot,cl,a); }
    case 1: { const n = pick(STAR_POINTS); return (x,cx,cy,r,rot,cl,a) => strokeStar(x,cx,cy,r,r*0.5,n,rot,cl,a); }
    case 2: return (x,cx,cy,r,_,cl,a) => strokeCircle(x,cx,cy,r,cl,a);
    case 3: { const n=pick([3,5,7]),al=0.3+Math.random()*0.4; return (x,cx,cy,r,rot,cl,a) => strokeArcs(x,cx,cy,r,n,al,rot,cl,a); }
    case 4: { const n = pick(POLY_SIDES); return (x,cx,cy,r,rot,cl,a) => { strokePoly(x,cx,cy,r,n,rot,cl,a); strokePoly(x,cx,cy,r*0.618,n,rot+TAU/(n*2),cl,a*0.6); }; }
    default: return (x,cx,cy,r,_,cl,a) => strokeCircle(x,cx,cy,r,cl,a);
  }
}

class TunnelShape {
  constructor(captured = false) {
    this.age = 0; this.maxAge = 360; this.alive = true;
    this.color = pick(TUNNEL_COLORS);
    this.baseRot = Math.random() * TAU;
    this.rotSpd = (0.001 + Math.random() * 0.002) * (Math.random() < 0.5 ? 1 : -1);
    this.fn = createShapeDraw();
    this.alphaBase = captured ? 0.68 : 0.45;
    this.scaleMul = captured ? 1.1 : 1.0;
  }
  update() { this.age++; if (this.age > this.maxAge) this.alive = false; }
  draw(ctx, cx, cy, maxR) {
    if (!this.alive) return;
    const t = this.age / this.maxAge;
    const r = (6 + (1 - (1 - t) * (1 - t)) * maxR) * this.scaleMul;
    let a = t < 0.08 ? t / 0.08 : t > 0.7 ? (1 - t) / 0.3 : 1.0;
    a *= this.alphaBase;
    if (a < 0.005) return;
    this.fn(ctx, cx, cy, r, this.baseRot + this.age * this.rotSpd, this.color, a);
  }
}

class CaptureRipple {
  constructor(x, y) { this.x = x; this.y = y; this.age = 0; this.alive = true; }
  update() { this.age++; if (this.age > 23) this.alive = false; }
  draw(ctx) {
    if (!this.alive) return;
    const t = this.age / 23; // ~377ms at 60fps
    const r = t * 68; // expand to phi-6
    const a = 0.35 * (1 - t);
    if (a < 0.005) return;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
    g.addColorStop(0, `rgba(34,211,238,${a})`); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, TAU); ctx.fill();
  }
}

export default function FocusCanvas({ flashVisible, flashAngle, flashCaptured, totalCaptured, phase, complete }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const dprRef = useRef(1);
  const prefersReduced = useReducedMotion();
  const propsRef = useRef({ flashVisible, flashAngle, flashCaptured, totalCaptured, phase, complete });
  propsRef.current = { flashVisible, flashAngle, flashCaptured, totalCaptured, phase, complete };

  const stateRef = useRef({
    shapes: [], spokes: [], ripples: [],
    time: 0, lastAutoSpawn: 0, lastCapturedCount: 0, bloomStart: -1,
  });

  // Empty deps: safe — all external state read via propsRef/stateRef (mutable refs)
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = dprRef.current;
    const W = canvas.width / dpr, H = canvas.height / dpr;
    const cx = W / 2, cy = H / 2;
    const s = stateRef.current;
    const now = Date.now();
    s.time += 16;
    const maxR = Math.min(W, H) * 0.55;
    ctx.clearRect(0, 0, W, H);

    const p = propsRef.current;

    // Spawn on capture: shape + spoke + ripple
    if (p.totalCaptured > s.lastCapturedCount) {
      s.shapes.push(new TunnelShape(true));
      s.spokes.push(p.flashAngle);
      const fd = Math.min(W, H) * 0.35;
      s.ripples.push(new CaptureRipple(
        cx + Math.cos(p.flashAngle) * fd, cy + Math.sin(p.flashAngle) * fd
      ));
      s.lastCapturedCount = p.totalCaptured;
      if (s.shapes.length > MAX_SHAPES) s.shapes.shift();
    }

    // Phase-responsive auto-spawn
    const interval = PHASE_SPAWN[p.phase] || 1597;
    if (now - s.lastAutoSpawn > interval && s.shapes.length < MAX_SHAPES) {
      s.shapes.push(new TunnelShape(false));
      s.lastAutoSpawn = now;
    }

    // Update + gc
    for (let i = s.shapes.length - 1; i >= 0; i--) { s.shapes[i].update(); if (!s.shapes[i].alive) s.shapes.splice(i, 1); }
    for (let i = s.ripples.length - 1; i >= 0; i--) { s.ripples[i].update(); if (!s.ripples[i].alive) s.ripples.splice(i, 1); }

    // Draw shapes (oldest in back)
    for (const sh of s.shapes) sh.draw(ctx, cx, cy, maxR);
    // Draw capture ripples
    for (const rp of s.ripples) rp.draw(ctx);

    // Bloom detection (completion)
    if (p.complete && s.bloomStart < 0) s.bloomStart = s.time;
    const bloom = s.bloomStart >= 0 ? s.time - s.bloomStart : -1;

    // Spokes — persistent lines from captures
    if (s.spokes.length > 0) {
      const spokeLen = maxR * 0.9;
      let sA, sR = 34, sG = 211, sB = 238;
      if (bloom >= 0) {
        if (bloom < 987) { sA = 0.15 + (bloom / 987) * 0.30; }
        else if (bloom < 2584) { sA = 0.45; }
        else if (bloom < 4181) {
          const t = (bloom - 2584) / 1597;
          sA = 0.45 - t * 0.30;
          sR = 34 + t * 192; sG = 211 + t * 21; sB = 238 + t * 2;
        } else { sA = 0.15; sR = 226; sG = 232; sB = 240; }
      } else {
        sA = 0.15 + Math.sin(s.time * 0.002) * 0.05;
      }
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(${sR|0},${sG|0},${sB|0},${sA.toFixed(3)})`;
      for (const angle of s.spokes) {
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * spokeLen, cy + Math.sin(angle) * spokeLen);
        ctx.stroke();
      }
    }

    // Centre dot — vanishing point
    const breathe = 1 + Math.sin(s.time * 0.003) * 0.3;
    let dotR = 3 * breathe;
    if (bloom >= 0) {
      if (bloom < 987) { const t = bloom / 987; dotR += t * t * (10 - dotR); }
      else if (bloom < 2584) { dotR = 10; }
      else if (bloom < 4181) { dotR = 10 - ((bloom - 2584) / 1597) * (10 - 3 * breathe); }
    }

    const glowR = bloom >= 0 && bloom < 2584 ? 42 + (bloom / 2584) * 26 : 42;
    const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
    gg.addColorStop(0, 'rgba(226,232,240,0.06)'); gg.addColorStop(1, 'transparent');
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, TAU); ctx.fill();

    ctx.beginPath(); ctx.arc(cx, cy, dotR, 0, TAU);
    ctx.fillStyle = `rgba(226,232,240,${0.5 + breathe * 0.2})`; ctx.fill();

    // Flash — peripheral glow at angle
    if (p.flashVisible) {
      const fd = Math.min(W, H) * 0.35;
      const fx = cx + Math.cos(p.flashAngle) * fd, fy = cy + Math.sin(p.flashAngle) * fd;
      const fR = p.flashCaptured ? 42 : 26, fA = p.flashCaptured ? 0.6 : 0.4;
      const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fR);
      fg.addColorStop(0, `rgba(34,211,238,${fA})`);
      fg.addColorStop(0.5, `rgba(34,211,238,${fA * 0.3})`);
      fg.addColorStop(1, 'transparent');
      ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(fx, fy, fR, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(fx, fy, 3, 0, TAU);
      ctx.fillStyle = `rgba(226,232,240,${fA * 0.8})`; ctx.fill();
      if (p.flashCaptured) {
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(fx, fy);
        ctx.strokeStyle = 'rgba(34,211,238,0.2)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const dW = window.innerWidth, dH = window.innerHeight;
      canvas.width = dW * dpr; canvas.height = dH * dpr;
      canvas.style.width = `${dW}px`; canvas.style.height = `${dH}px`;
      canvas.getContext('2d').scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    stateRef.current.lastAutoSpawn = Date.now();
    rafRef.current = requestAnimationFrame(render);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [render, prefersReduced]);

  if (prefersReduced) return null;
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}
