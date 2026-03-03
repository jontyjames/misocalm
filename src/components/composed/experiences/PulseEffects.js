/**
 * PulseEffects — visual classes for PulseCanvas
 *
 * Extracted to keep PulseCanvas under 300-line limit.
 * Three visual tiers:
 *   Tier 1–2: indigo → violet rings, phi-7 cap (110px)
 *   Tier 3 (rhythm lock): deeper colours, phi-8 cap (178px),
 *     corona halo, particle echoes, breathing edges
 */

// Base colours — warm, no judgment progression
export function consistencyColor(consistency) {
  if (consistency < 0.4) return { r: 165, g: 180, b: 252 }; // indigo
  if (consistency < 0.7) return { r: 196, g: 181, b: 253 }; // violet
  return { r: 103, g: 232, b: 249 }; // cyan (awakening)
}

// Deeper, more vivid colours for tier 3 (after rhythm lock)
export function deepColor(consistency) {
  if (consistency < 0.4) return { r: 129, g: 140, b: 248 }; // deeper indigo
  if (consistency < 0.7) return { r: 168, g: 139, b: 250 }; // deeper violet
  return { r: 34, g: 211, b: 238 }; // deeper cyan
}

export class PulseRing {
  constructor(cx, cy, maxRadius, color) {
    this.cx = cx;
    this.cy = cy;
    this.radius = 6; // phi-1 start
    this.maxRadius = maxRadius;
    this.age = 0;
    this.maxAge = 200;
    this.alive = true;
    this.color = color;
    this.startWidth = 3;
    this.isTier3 = maxRadius > 110;
  }

  update() {
    this.age++;
    if (this.age > this.maxAge) { this.alive = false; return; }
    const t = this.age / this.maxAge;
    const ease = 1 - (1 - t) * (1 - t);
    this.radius = 6 + (this.maxRadius - 6) * ease;
  }

  draw(ctx) {
    const life = Math.max(0, 1 - this.age / this.maxAge);
    const { r, g, b } = this.color;
    const tierBoost = this.isTier3 ? 1.3 : 1;
    const alpha = 0.6 * life * tierBoost;

    // Breathing edges — subtle pulse on stroke width at tier 3
    const breathe = this.isTier3 ? 1 + Math.sin(this.age * 0.08) * 0.13 : 1;
    const width = (this.startWidth * life + 0.5) * breathe;

    if (alpha < 0.005) return;

    // Ring stroke
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = width;
    ctx.stroke();

    // Inner glow halo
    const grad = ctx.createRadialGradient(
      this.cx, this.cy, Math.max(0, this.radius - 6),
      this.cx, this.cy, this.radius + 6
    );
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.12})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius + 6, 0, Math.PI * 2);
    ctx.fill();

    // Corona — outer halo for tier 3
    if (this.isTier3) {
      const spread = 13; // prime offset
      const coronaGrad = ctx.createRadialGradient(
        this.cx, this.cy, this.radius,
        this.cx, this.cy, this.radius + spread
      );
      coronaGrad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.1})`);
      coronaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.radius + spread, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export class Particle {
  constructor(cx, cy, angle, radius, color) {
    this.x = cx + Math.cos(angle) * radius;
    this.y = cy + Math.sin(angle) * radius;
    this.vx = Math.cos(angle) * 0.34; // fib-adjacent drift
    this.vy = Math.sin(angle) * 0.34;
    this.life = 1;
    this.decay = 0.008 + Math.random() * 0.005;
    this.color = color;
    this.size = 1 + Math.random() * 1.5;
    this.alive = true;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    if (this.life <= 0) this.alive = false;
  }

  draw(ctx) {
    if (!this.alive) return;
    const { r, g, b } = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${this.life * 0.4})`;
    ctx.fill();
  }
}

export function drawYouDot(ctx, cx, cy, time, rhythmAvg) {
  let breathe;
  if (rhythmAvg > 0) {
    const phase = (time % rhythmAvg) / rhythmAvg;
    breathe = 1 + Math.sin(phase * Math.PI * 2) * 0.2;
  } else {
    breathe = 1 + Math.sin(time * 0.004) * 0.15;
  }
  const radius = 4 * breathe;

  // Centre glow (42px phi-5)
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 42);
  grad.addColorStop(0, 'rgba(226, 232, 240, 0.08)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 42, 0, Math.PI * 2);
  ctx.fill();

  // Core dot
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(226, 232, 240, ${0.5 + breathe * 0.15})`;
  ctx.fill();

  // Tiny ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(226, 232, 240, ${0.04 + breathe * 0.02})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

export function drawAnticipationRing(ctx, cx, cy, lastTapTime, avgInterval, now, isLocked) {
  if (avgInterval <= 0) return;
  const elapsed = now - lastTapTime;
  const t = elapsed / avgInterval;
  if (t < 0 || t > 1.3) return;

  const maxR = isLocked ? 178 : 110; // phi-8 / phi-7
  const radius = 6 + (maxR - 6) * Math.min(1, t);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();
}
