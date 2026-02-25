#!/usr/bin/env node
// Instagram post generator
// Usage: node scripts/insta/generate.mjs
// Output: output/insta/{carousel-slug}/01-cover.png, 02-content.png, etc.

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { carousels } from './content.mjs';
import * as templates from './templates.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

// Load fonts
const fonts = [
  {
    name: 'Josefin Sans',
    data: readFileSync(join(__dirname, '..', 'fonts', 'JosefinSans-Thin.ttf')),
    weight: 100,
    style: 'normal',
  },
  {
    name: 'Josefin Sans',
    data: readFileSync(join(__dirname, '..', 'fonts', 'JosefinSans-ExtraLight.ttf')),
    weight: 200,
    style: 'normal',
  },
  {
    name: 'Josefin Sans',
    data: readFileSync(join(__dirname, '..', 'fonts', 'JosefinSans-Light.ttf')),
    weight: 300,
    style: 'normal',
  },
];

// Load logo as base64 data URI
const logoPath = join(ROOT, 'public', 'icons', 'MisoCalm-logo-v1.png');
let logoBase64;
try {
  const logoBuffer = readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
} catch {
  console.warn('Warning: Could not load logo from', logoPath);
  logoBase64 = null;
}

async function renderSlide(jsx) {
  const svg = await satori(jsx, {
    width: 1080,
    height: 1080,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1080 },
  });
  return resvg.render().asPng();
}

async function main() {
  let totalSlides = 0;

  for (const carousel of carousels) {
    const outDir = join(ROOT, 'output', 'insta', carousel.slug);
    mkdirSync(outDir, { recursive: true });

    console.log(`\nCarousel: ${carousel.slug}`);

    for (let i = 0; i < carousel.slides.length; i++) {
      const slide = carousel.slides[i];
      const templateFn = templates[slide.type];

      if (!templateFn) {
        console.error(`  Unknown template type: ${slide.type}`);
        continue;
      }

      const jsx = templateFn({ ...slide, logoBase64 });
      const png = await renderSlide(jsx);

      const num = String(i + 1).padStart(2, '0');
      const filename = `${num}-${slide.type}.png`;
      writeFileSync(join(outDir, filename), png);

      console.log(`  ${filename} (${Math.round(png.length / 1024)}KB)`);
      totalSlides++;
    }
  }

  console.log(`\nDone. ${totalSlides} slides generated in output/insta/`);
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
