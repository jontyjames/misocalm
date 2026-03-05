/**
 * SparkBurst — bioluminescent spark particles for Sanctuary tree
 *
 * 7 sparks per burst (prime, sacred). 89-frame life (Fibonacci).
 * Bloom peak at age 13 (prime). Radial gradient glow with bright core dot.
 * Avatar-inspired bioluminescence — every breath releases light.
 */

const SPARK_COUNT = 7;   // prime, sacred
const SPARK_LIFE = 89;   // Fibonacci
const BLOOM_PEAK = 13;   // prime — age at max brightness

// Spawn zones (normalised Y: 0=top, 1=bottom) — supports both legacy and new shape types
const PHASE_ZONES = {
  FOUNDATION: { minY: 0.65, maxY: 0.9 },
  RISING:     { minY: 0.3,  maxY: 0.7 },
  CANOPY:     { minY: 0.1,  maxY: 0.4 },
  ROOT:       { minY: 0.70, maxY: 0.90 },
  TRUNK:      { minY: 0.30, maxY: 0.75 },
  BRANCH:     { minY: 0.090, maxY: 0.50 },
  LEAF:       { minY: 0.090, maxY: 0.45 },
};

class Spark {
  constructor(W, H, phase, color) {
    const zone = PHASE_ZONES[phase] || PHASE_ZONES.CANOPY;
    this.x = W * (0.2 + Math.random() * 0.6);
    this.y = H * (zone.minY + Math.random() * (zone.maxY - zone.minY));
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = -(0.3 + Math.random() * 0.5); // upward drift
    this.gravity = 0.005; // gentle gravity for organic arc
    this.age = 0;
    this.color = color;
    this.maxRadius = 3 + Math.random() * 5;
  }

  update() {
    this.age++;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    return this.age < SPARK_LIFE;
  }

  draw(ctx) {
    const { r, g, b } = this.color;
    let brightness;
    if (this.age <= BLOOM_PEAK) {
      brightness = this.age / BLOOM_PEAK;
    } else {
      brightness = 1 - (this.age - BLOOM_PEAK) / (SPARK_LIFE - BLOOM_PEAK);
    }
    brightness = Math.max(0, brightness);
    // Alpha range: 0.382–0.618 (phi pair)
    const alpha = 0.382 + brightness * (0.618 - 0.382);
    const radius = this.maxRadius * brightness;
    if (radius < 0.5) return;
    // Radial gradient glow — stops at phi positions (0, 0.618, 1)
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
    const coreR = Math.min(255, r + 42); // +42 phi-scale step 5
    const coreG = Math.min(255, g + 42);
    const coreB = Math.min(255, b + 42);
    grad.addColorStop(0, `rgba(${coreR},${coreG},${coreB},${alpha})`);
    grad.addColorStop(0.618, `rgba(${r},${g},${b},${alpha * 0.618})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    // Core dot — radius * 0.382 (phi complement)
    const coreRadius = radius * 0.382;
    if (coreRadius > 0.3) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${coreR},${coreG},${coreB},${Math.min(1, alpha * 1.2)})`;
      ctx.fill();
    }
  }
}

export default class SparkBurst {
  constructor(W, H, phase, colors) {
    this.sparks = [];
    if (!colors || colors.length === 0) return;
    for (let i = 0; i < SPARK_COUNT; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.sparks.push(new Spark(W, H, phase, color));
    }
  }

  update() {
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      if (!this.sparks[i].update()) this.sparks.splice(i, 1);
    }
    return this.sparks.length > 0;
  }

  draw(ctx) {
    for (const spark of this.sparks) {
      spark.draw(ctx);
    }
  }
}
