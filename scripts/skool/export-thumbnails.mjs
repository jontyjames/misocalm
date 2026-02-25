#!/usr/bin/env node
// Skool thumbnail exporter
// Usage: node scripts/skool/export-thumbnails.mjs
// Output: output/skool/1-0-welcome.png, 1-1-jontys-story.png, etc.

import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const HTML_PATH = join(ROOT, '..', 'misocalm-landing', 'skool-assets', 'skool-thumbnails.html');
const OUT_DIR = join(ROOT, 'output', 'skool');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// CSS overrides for mobile readability + warmth
// At Skool's display size (~350px wide on mobile), needs to feel inviting at a glance
const MOBILE_CSS = `
  /* Bigger, brighter text */
  .thumb .title {
    font-size: 34px !important;
    font-weight: 300 !important;
    color: #ffffff !important;
    bottom: 20px !important;
    letter-spacing: 0.04em !important;
    text-shadow: 0 0 20px rgba(0,0,0,0.5) !important;
  }
  .thumb .number {
    font-size: 28px !important;
    font-weight: 300 !important;
    color: #cbd5e1 !important;
    top: 20px !important;
    left: 20px !important;
  }

  /* Bigger icons */
  .thumb .icon svg { transform: scale(1.8); }

  /* Much stronger glow - makes it feel alive */
  .thumb .glow {
    width: 360px !important;
    height: 360px !important;
    opacity: 1 !important;
    filter: blur(10px);
  }

  /* Brighter SVG strokes only - don't touch fills (they use low opacity intentionally) */
  .thumb .icon svg line,
  .thumb .icon svg path,
  .thumb .icon svg circle[fill="none"],
  .thumb .icon svg ellipse[fill="none"],
  .thumb .icon svg polyline {
    opacity: 0.85 !important;
  }

  /* Colour wash across full thumbnail - strong enough to see at grid size */
  .thumb::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  /* Bottom gradient for depth */
  .thumb::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    z-index: 1;
    pointer-events: none;
  }
  /* Title and number above overlays */
  .thumb .title { z-index: 2; }
  .thumb .number { z-index: 2; }
  .thumb .icon { z-index: 2; }

  /* === STAGE 1 - Indigo (lighter/brighter to distinguish from Stage 2) === */
  .stage-section:nth-of-type(1) .thumb::before {
    background:
      radial-gradient(ellipse at 50% 40%, rgba(200,210,255,0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 40%, rgba(165,180,252,0.25) 0%, transparent 65%) !important;
  }
  .stage-section:nth-of-type(1) .thumb::after {
    background: linear-gradient(to top, rgba(180,195,255,0.3) 0%, transparent 100%) !important;
  }
  .stage-section:nth-of-type(1) .thumb {
    border: 6px solid rgba(165,180,252,0.45) !important;
  }

  /* === STAGE 2 - Violet === */
  .stage-section:nth-of-type(2) .thumb::before {
    background: radial-gradient(ellipse at 50% 40%, rgba(180,170,252,0.25) 0%, transparent 65%) !important;
  }
  .stage-section:nth-of-type(2) .thumb::after {
    background: linear-gradient(to top, rgba(180,170,252,0.3) 0%, transparent 100%) !important;
  }
  .stage-section:nth-of-type(2) .thumb {
    border: 6px solid rgba(180,170,252,0.45) !important;
  }

  /* === STAGE 3 - Rose-Violet === */
  .stage-section:nth-of-type(3) .thumb::before {
    background: radial-gradient(ellipse at 50% 40%, rgba(220,170,220,0.25) 0%, transparent 65%) !important;
  }
  .stage-section:nth-of-type(3) .thumb::after {
    background: linear-gradient(to top, rgba(220,170,220,0.3) 0%, transparent 100%) !important;
  }
  .stage-section:nth-of-type(3) .thumb {
    border: 6px solid rgba(220,170,220,0.45) !important;
  }

  /* === STAGE 4 - Teal === */
  .stage-section:nth-of-type(4) .thumb::before {
    background: radial-gradient(ellipse at 50% 40%, rgba(94,234,212,0.22) 0%, transparent 65%) !important;
  }
  .stage-section:nth-of-type(4) .thumb::after {
    background: linear-gradient(to top, rgba(94,234,212,0.28) 0%, transparent 100%) !important;
  }
  .stage-section:nth-of-type(4) .thumb {
    border: 6px solid rgba(94,234,212,0.45) !important;
  }

  /* === STAGE 5 - Cyan === */
  .stage-section:nth-of-type(5) .thumb::before {
    background: radial-gradient(ellipse at 50% 40%, rgba(103,232,249,0.25) 0%, transparent 65%) !important;
  }
  .stage-section:nth-of-type(5) .thumb::after {
    background: linear-gradient(to top, rgba(103,232,249,0.3) 0%, transparent 100%) !important;
  }
  .stage-section:nth-of-type(5) .thumb {
    border: 6px solid rgba(103,232,249,0.45) !important;
  }
`;

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set viewport large enough for thumbnails
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });

  // Load the HTML file
  const fileUrl = `file:///${HTML_PATH.replace(/\\/g, '/')}`;
  console.log(`Loading ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Inject mobile readability CSS
  await page.addStyleTag({ content: MOBILE_CSS });

  // Add subtle star field to each thumbnail
  await page.evaluate(() => {
    // 19 stars (prime count), randomised per thumbnail for variety
    const starSeeds = [
      { x: 8, y: 12 }, { x: 22, y: 7 }, { x: 45, y: 5 }, { x: 68, y: 10 }, { x: 88, y: 8 },
      { x: 15, y: 30 }, { x: 78, y: 25 }, { x: 5, y: 50 }, { x: 92, y: 45 },
      { x: 35, y: 55 }, { x: 60, y: 60 }, { x: 12, y: 72 }, { x: 85, y: 70 },
      { x: 50, y: 78 }, { x: 28, y: 88 }, { x: 72, y: 85 }, { x: 40, y: 35 },
      { x: 55, y: 18 }, { x: 20, y: 48 },
    ];
    document.querySelectorAll('.thumb').forEach((thumb, ti) => {
      starSeeds.forEach((s, si) => {
        const dot = document.createElement('div');
        // Offset each thumbnail's stars slightly so they don't all look identical
        const ox = ((ti * 7 + si * 13) % 11) - 5;
        const oy = ((ti * 11 + si * 7) % 9) - 4;
        const size = 1.5 + ((si * 3) % 3) * 0.5;
        const opacity = 0.25 + ((si * 7) % 5) * 0.1;
        Object.assign(dot.style, {
          position: 'absolute',
          left: `${s.x + ox}%`,
          top: `${s.y + oy}%`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#e2e8f0',
          opacity: opacity,
          zIndex: '0',
          pointerEvents: 'none',
        });
        thumb.appendChild(dot);
      });
    });
  });

  // Replace specific SVG icons that don't read well at thumbnail size
  await page.evaluate(() => {
    const thumbs = document.querySelectorAll('.thumb');
    for (const thumb of thumbs) {
      const num = thumb.querySelector('.number')?.textContent.trim();

      // 1.1 Jonty's Story - rising path with peaks and valleys, trending upward to a light
      if (num === '1.1') {
        thumb.querySelector('.icon').innerHTML = `
          <svg width="100" height="80" viewBox="0 0 100 80">
            <!-- Rising path with deep valleys and high peaks -->
            <path d="M5 62 Q10 68 16 70 Q22 72 26 52 Q30 32 34 48 Q38 64 42 66 Q46 68 50 40 Q54 18 58 38 Q62 56 66 58 Q70 60 74 28 Q78 10 84 14 Q88 16 92 12"
                  fill="none" stroke="#a5b4fc" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
            <!-- Start dot -->
            <circle cx="5" cy="65" r="3" fill="#a5b4fc" opacity="0.35"/>
            <!-- Destination glow -->
            <circle cx="90" cy="12" r="6" fill="#a5b4fc" opacity="0.12"/>
            <circle cx="90" cy="12" r="3" fill="#a5b4fc" opacity="0.4"/>
          </svg>`;
      }

      // 2.2 Your Body Is Your Ally - heartbeat pulse line (simple, clean)
      if (num === '2.2') {
        thumb.querySelector('.icon').innerHTML = `
          <svg width="100" height="60" viewBox="0 0 100 60">
            <polyline points="5,30 20,30 28,30 33,12 38,48 43,20 48,38 53,30 68,30 95,30"
                      fill="none" stroke="#b0acfc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
            <circle cx="50" cy="30" r="20" fill="#b0acfc" opacity="0.06"/>
          </svg>`;
      }

      // 3.4 Inner Child - heart shape with a soft light glowing inside
      if (num === '3.4') {
        thumb.querySelector('.icon').innerHTML = `
          <svg width="100" height="100" viewBox="0 0 100 100">
            <!-- Heart outline -->
            <path d="M50 85 Q20 65 15 45 Q10 25 30 20 Q42 17 50 30 Q58 17 70 20 Q90 25 85 45 Q80 65 50 85 Z"
                  fill="none" stroke="#c4b5fd" stroke-width="1.5" opacity="0.7"/>
            <!-- Soft heart fill -->
            <path d="M50 85 Q20 65 15 45 Q10 25 30 20 Q42 17 50 30 Q58 17 70 20 Q90 25 85 45 Q80 65 50 85 Z"
                  fill="#c4b5fd" opacity="0.05"/>
            <!-- Tiny radiating light from centre -->
            <circle cx="50" cy="48" r="8" fill="#c4b5fd" opacity="0.06"/>
            <circle cx="50" cy="48" r="4" fill="#c4b5fd" opacity="0.1"/>
            <circle cx="50" cy="48" r="1.5" fill="#c4b5fd" opacity="0.5"/>
          </svg>`;
      }

      // 4.1 Healthy Body Foundation - lotus flower (growth, wellness, foundation)
      if (num === '4.1') {
        thumb.querySelector('.icon').innerHTML = `
          <svg width="100" height="90" viewBox="0 0 100 90">
            <!-- Centre petal -->
            <path d="M50 45 Q50 20 50 10 Q55 25 50 45" fill="none" stroke="#96cdf0" stroke-width="1.5" opacity="0.8"/>
            <!-- Left petals -->
            <path d="M50 45 Q30 30 22 18 Q35 30 50 45" fill="none" stroke="#96cdf0" stroke-width="1.5" opacity="0.65"/>
            <path d="M50 45 Q20 42 10 38 Q25 42 50 45" fill="none" stroke="#96cdf0" stroke-width="1.3" opacity="0.5"/>
            <!-- Right petals -->
            <path d="M50 45 Q70 30 78 18 Q65 30 50 45" fill="none" stroke="#96cdf0" stroke-width="1.5" opacity="0.65"/>
            <path d="M50 45 Q80 42 90 38 Q75 42 50 45" fill="none" stroke="#96cdf0" stroke-width="1.3" opacity="0.5"/>
            <!-- Base / foundation line -->
            <path d="M30 55 Q50 48 70 55" fill="none" stroke="#96cdf0" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>
            <!-- Root lines -->
            <path d="M42 55 Q44 65 40 75" fill="none" stroke="#96cdf0" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
            <path d="M50 52 Q50 65 50 78" fill="none" stroke="#96cdf0" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
            <path d="M58 55 Q56 65 60 75" fill="none" stroke="#96cdf0" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
            <!-- Core glow -->
            <circle cx="50" cy="45" r="6" fill="#96cdf0" opacity="0.1"/>
          </svg>`;
      }
    }
  });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Find all thumbnail elements
  const thumbs = await page.$$('.thumb');
  console.log(`Found ${thumbs.length} thumbnails\n`);

  let exported = 0;
  for (const thumb of thumbs) {
    // Extract number and title text
    const info = await thumb.evaluate((el) => {
      const numEl = el.querySelector('.number');
      const titleEl = el.querySelector('.title');
      return {
        number: numEl ? numEl.textContent.trim() : '',
        title: titleEl ? titleEl.textContent.trim() : '',
      };
    });

    const slug = `${info.number.replace('.', '-')}-${slugify(info.title)}`;
    const filename = `${slug}.png`;

    const png = await thumb.screenshot({ type: 'png' });
    const { writeFileSync } = await import('fs');
    writeFileSync(join(OUT_DIR, filename), png);

    console.log(`  ${filename} (${Math.round(png.length / 1024)}KB)`);
    exported++;
  }

  await browser.close();
  console.log(`\nDone. ${exported} thumbnails exported to output/skool/`);
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
