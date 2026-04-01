/**
 * Welcome Arrival — 7 canvas animation variants
 *
 * One per day of the week. Each echoes a MisoCalm experience.
 * Pure canvas drawing functions — no React, no DOM.
 *
 * Sunday:    Impermanence — blooms that appear and fade
 * Monday:    Grounding    — seed of life materializing
 * Tuesday:   Pulse        — rhythmic rings from center
 * Wednesday: Focus        — concentric rings breathing
 * Thursday:  Mandala      — 7-fold symmetric particles
 * Friday:    Alive        — tendrils growing from center
 * Saturday:  Aurora       — flowing light bands (original)
 */

import { SOLFEGGIO_COLORS } from '@/lib/constants';

const { indigo, violet, cyan, slate, white } = SOLFEGGIO_COLORS;
const PALETTE = [indigo, violet, cyan, slate, white];

// --- Impermanence: blooms that appear and fade ---
const impermanence = {
  message: 'Everything passes. You remain.',
  init(W, H) {
    return { blooms: [], spawnTimer: 0 };
  },
  render(ctx, W, H, time, s) {
    if (time - s.spawnTimer > 40 && s.blooms.length < 7) {
      s.blooms.push({
        x: W * 0.15 + Math.random() * W * 0.7,
        y: H * 0.2 + Math.random() * H * 0.6,
        age: 0, maxAge: 120 + Math.random() * 60,
        color: PALETTE[s.blooms.length % 5],
      });
      s.spawnTimer = time;
    }
    ctx.globalCompositeOperation = 'screen';
    for (let i = s.blooms.length - 1; i >= 0; i--) {
      const b = s.blooms[i];
      b.age++;
      const life = b.age / b.maxAge;
      if (life > 1) { s.blooms.splice(i, 1); continue; }
      const alpha = life < 0.3 ? life / 0.3 : 1 - (life - 0.3) / 0.7;
      const r = 68 * life;
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
      grad.addColorStop(0, `rgba(${b.color.base},${alpha * 0.8})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  },
};

// --- Grounding: seed of life geometry materializing ---
const grounding = {
  message: 'You are here. That is enough.',
  init(W, H) {
    const cx = W / 2, cy = H / 2, r = 26;
    const circles = [{ x: cx, y: cy }];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      circles.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
    return { circles, r };
  },
  render(ctx, W, H, time, s) {
    const alpha = Math.min(time / 180, 1) * 0.6;
    const breathe = 1 + Math.sin(time * 0.02) * 0.03;
    ctx.globalCompositeOperation = 'screen';
    for (const c of s.circles) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, s.r * breathe, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${violet.base},${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  },
};

// --- Pulse: rhythmic rings expanding from center ---
const pulse = {
  message: 'Your heart knows the rhythm.',
  init(W, H) {
    return { rings: [], cx: W / 2, cy: H / 2, spawnTimer: 0 };
  },
  render(ctx, W, H, time, s) {
    if (time - s.spawnTimer > 60) {
      s.rings.push({ age: 0 });
      s.spawnTimer = time;
    }
    ctx.globalCompositeOperation = 'screen';
    for (let i = s.rings.length - 1; i >= 0; i--) {
      const ring = s.rings[i];
      ring.age++;
      const life = ring.age / 120;
      if (life > 1) { s.rings.splice(i, 1); continue; }
      const r = 110 * life;
      const alpha = (1 - life) * 0.7;
      ctx.beginPath();
      ctx.arc(s.cx, s.cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${indigo.base},${alpha})`;
      ctx.lineWidth = 2 * (1 - life);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  },
};

// --- Focus: concentric rings breathing with slow rotation ---
const focus = {
  message: 'Stillness lives inside you.',
  init(W, H) {
    return { cx: W / 2, cy: H / 2, radii: [16, 26, 42, 68, 110] };
  },
  render(ctx, W, H, time, s) {
    const rotation = time * 0.0003;
    ctx.save();
    ctx.translate(s.cx, s.cy);
    ctx.rotate(rotation);
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < s.radii.length; i++) {
      const alpha = (0.3 + Math.sin(time * 0.015 + i * 1.2) * 0.15);
      ctx.beginPath();
      ctx.arc(0, 0, s.radii[i], 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${i < 3 ? indigo.base : violet.base},${Math.max(0, alpha)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  },
};

// --- Mandala: 7-fold symmetric particles expanding ---
const mandala = {
  message: 'There is beauty in what you carry.',
  init(W, H) {
    const cx = W / 2, cy = H / 2;
    const arms = 7;
    const particles = [];
    for (let a = 0; a < arms; a++) {
      for (let p = 0; p < 3; p++) {
        particles.push({
          arm: a, dist: 10 + p * 16,
          speed: 0.15 + p * 0.08,
          size: 4 - p * 0.5,
        });
      }
    }
    return { cx, cy, arms, particles };
  },
  render(ctx, W, H, time, s) {
    const growFactor = Math.min(time / 180, 1);
    ctx.globalCompositeOperation = 'screen';
    for (const p of s.particles) {
      const angle = (Math.PI * 2 / s.arms) * p.arm + time * 0.0005;
      const dist = p.dist + p.speed * time * 0.1 * growFactor;
      const x = s.cx + Math.cos(angle) * dist;
      const y = s.cy + Math.sin(angle) * dist;
      const alpha = Math.min(growFactor, 0.7) * (1 - Math.min(dist / 150, 1) * 0.5);
      const color = dist < 50 ? indigo : dist < 100 ? violet : cyan;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.base},${Math.max(0, alpha)})`;
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  },
};

// --- Alive: tendrils growing from center with gentle wobble ---
const alive = {
  message: 'Your breath builds worlds.',
  init(W, H) {
    const cx = W / 2, cy = H / 2;
    const tendrils = [];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i + Math.random() * 0.3;
      tendrils.push({
        angle, length: 0,
        maxLength: H * 0.3 + Math.random() * H * 0.15,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleAmp: 15 + Math.random() * 10,
      });
    }
    return { cx, cy, tendrils };
  },
  render(ctx, W, H, time, s) {
    const growFactor = Math.min(time / 180, 1);
    ctx.globalCompositeOperation = 'screen';
    for (const t of s.tendrils) {
      t.length = t.maxLength * growFactor;
      const endX = s.cx + Math.cos(t.angle) * t.length;
      const endY = s.cy + Math.sin(t.angle) * t.length;
      const wobble = Math.sin(time * 0.01 + t.wobblePhase) * t.wobbleAmp * growFactor;
      const cpX = (s.cx + endX) / 2 + Math.cos(t.angle + Math.PI / 2) * wobble;
      const cpY = (s.cy + endY) / 2 + Math.sin(t.angle + Math.PI / 2) * wobble;
      ctx.beginPath();
      ctx.moveTo(s.cx, s.cy);
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.strokeStyle = `rgba(${violet.base},${0.55 * growFactor})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
    // Seed dot
    const dotAlpha = Math.min(time / 90, 0.7);
    const grad = ctx.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, 8);
    grad.addColorStop(0, `rgba(${slate.base},${dotAlpha})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.cx, s.cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  },
};

// --- Aurora: flowing light bands (original creation) ---
const aurora = {
  message: 'You are held here.',
  init(W, H) {
    const bands = PALETTE.map((color, i) => ({
      color,
      baseY: H * 0.3 + (H * 0.4 / 5) * i,
      phase: (Math.PI * 2 / 5) * i,
      amplitude: H * 0.06 + i * H * 0.01,
      speed: 0.002 + i * 0.0003,
    }));
    return { bands };
  },
  render(ctx, W, H, time, s) {
    ctx.globalCompositeOperation = 'screen';
    for (const band of s.bands) {
      const y = band.baseY + Math.sin(time * band.speed + band.phase) * band.amplitude;
      const bandHeight = 110;
      const grad = ctx.createLinearGradient(0, y - bandHeight / 2, 0, y + bandHeight / 2);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.3, `rgba(${band.color.base},0.25)`);
      grad.addColorStop(0.5, `rgba(${band.color.base},0.4)`);
      grad.addColorStop(0.7, `rgba(${band.color.base},0.25)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y - bandHeight / 2, W, bandHeight);
    }
    ctx.globalCompositeOperation = 'source-over';
  },
};

// Day of week: 0=Sunday → 6=Saturday
const VARIANTS = [impermanence, grounding, pulse, focus, mandala, alive, aurora];

export default VARIANTS;
