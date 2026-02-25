#!/usr/bin/env node
// Skool page assets generator - multiple cover/about variants for Canva compositing
// Usage: node scripts/skool/generate-assets.mjs
// Output: output/skool/covers/

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

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
  {
    name: 'Josefin Sans',
    data: readFileSync(join(__dirname, '..', 'fonts', 'JosefinSans-Regular.ttf')),
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Josefin Sans',
    data: readFileSync(join(__dirname, '..', 'fonts', 'JosefinSans-SemiBold.ttf')),
    weight: 600,
    style: 'normal',
  },
];

const logoPath = join(ROOT, 'public', 'icons', 'MisoCalm-logo-v1.png');
let logoBase64;
try {
  logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`;
} catch { logoBase64 = null; }

// Stars
const STARS = [
  { x: 3, y: 8 }, { x: 12, y: 4 }, { x: 25, y: 14 }, { x: 8, y: 28 },
  { x: 18, y: 45 }, { x: 5, y: 62 }, { x: 15, y: 78 }, { x: 28, y: 88 },
  { x: 38, y: 6 }, { x: 45, y: 25 }, { x: 35, y: 55 }, { x: 42, y: 72 },
  { x: 55, y: 10 }, { x: 65, y: 30 }, { x: 75, y: 8 }, { x: 85, y: 18 },
  { x: 92, y: 35 }, { x: 78, y: 55 }, { x: 88, y: 72 }, { x: 95, y: 85 },
  { x: 60, y: 90 }, { x: 48, y: 48 }, { x: 70, y: 65 },
];

function stars() {
  return STARS.map((s, i) => ({
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        top: `${s.y}%`,
        left: `${s.x}%`,
        width: 2 + (i % 3),
        height: 2 + (i % 3),
        borderRadius: '50%',
        background: '#e2e8f0',
        opacity: 0.3 + (i % 5) * 0.1,
      },
    },
  }));
}

function stageBar(height = 4) {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height, display: 'flex',
      },
      children: [
        { type: 'div', props: { style: { flex: 1, background: '#a5b4fc', opacity: 0.7 } } },
        { type: 'div', props: { style: { flex: 1, background: '#b4aafc', opacity: 0.7 } } },
        { type: 'div', props: { style: { flex: 1, background: '#c4b5fd', opacity: 0.7 } } },
        { type: 'div', props: { style: { flex: 1, background: '#5eead4', opacity: 0.7 } } },
        { type: 'div', props: { style: { flex: 1, background: '#67e8f9', opacity: 0.7 } } },
      ],
    },
  };
}

// ─────────────────────────────────────────────
// COVER VARIANTS (1084x576) - text left, photo space right
// ─────────────────────────────────────────────

// Variant A: Cosmic dark, text left, bold title
function coverA() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1084, height: 576,
        background: '#0F172A',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        // Nebula glows
        { type: 'div', props: { style: { position: 'absolute', top: -100, right: 100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)' } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.1) 0%, transparent 70%)' } } },
        ...stars(),
        // Text block - left side
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 0 0 72px', width: '55%',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginBottom: 24, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 52, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em' }, children: 'Thriving\nWith\nMisophonia' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 300, color: '#cbd5e1', marginTop: 20, letterSpacing: '0.04em', lineHeight: 1.5 }, children: 'For people who feel\nsound differently' } },
            ],
          },
        },
        // Right side empty for photo
        stageBar(4),
      ],
    },
  };
}

// Variant B: Warm gradient background, brighter feel
function coverB() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1084, height: 576,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: -80, left: '40%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)' } } },
        ...stars(),
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 0 0 72px', width: '55%',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginBottom: 24, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 52, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em' }, children: 'Thriving\nWith\nMisophonia' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 300, color: '#c7d2fe', marginTop: 20, letterSpacing: '0.04em', lineHeight: 1.5 }, children: 'For people who feel\nsound differently' } },
            ],
          },
        },
        stageBar(4),
      ],
    },
  };
}

// Variant C: Teal-to-dark gradient, calming
function coverC() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1084, height: 576,
        background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 60%, #115e59 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: -100, right: 50, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,234,212,0.1) 0%, transparent 70%)' } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: -80, left: 200, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.08) 0%, transparent 70%)' } } },
        ...stars(),
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 0 0 72px', width: '55%',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginBottom: 24, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 52, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em' }, children: 'Thriving\nWith\nMisophonia' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 300, color: '#99f6e4', marginTop: 20, letterSpacing: '0.04em', lineHeight: 1.5 }, children: 'For people who feel\nsound differently' } },
            ],
          },
        },
        stageBar(4),
      ],
    },
  };
}

// Variant D: Violet-rose gradient, warm and inviting
function coverD() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1084, height: 576,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #581c87 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: -100, right: 100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.12) 0%, transparent 70%)' } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: -50, left: 0, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,121,249,0.08) 0%, transparent 70%)' } } },
        ...stars(),
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 0 0 72px', width: '55%',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginBottom: 24, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 52, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em' }, children: 'Thriving\nWith\nMisophonia' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 300, color: '#e9d5ff', marginTop: 20, letterSpacing: '0.04em', lineHeight: 1.5 }, children: 'For people who feel\nsound differently' } },
            ],
          },
        },
        stageBar(4),
      ],
    },
  };
}

// ─────────────────────────────────────────────
// FUN VARIANTS (E-H) - brighter, more energetic
// ─────────────────────────────────────────────

// Variant E: Sunrise warm - amber/peach gradient, golden energy
function coverE() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1084, height: 576,
        background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 35%, #ea580c 65%, #fb923c 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        // Warm sun glow
        { type: 'div', props: { style: { position: 'absolute', top: -150, right: -50, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,237,213,0.25) 0%, rgba(251,146,60,0.1) 40%, transparent 70%)' } } },
        // Soft light streak
        { type: 'div', props: { style: { position: 'absolute', bottom: -100, left: 100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(254,215,170,0.15) 0%, transparent 60%)' } } },
        ...stars(),
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 0 0 72px', width: '55%',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginBottom: 24, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 52, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }, children: 'Thriving\nWith\nMisophonia' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 300, color: '#fed7aa', marginTop: 20, letterSpacing: '0.04em', lineHeight: 1.5 }, children: 'For people who feel\nsound differently' } },
            ],
          },
        },
        stageBar(4),
      ],
    },
  };
}

// Variant F: Ocean blue - bright sky/ocean gradient, fresh and open
function coverF() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1084, height: 576,
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 35%, #0284c7 65%, #38bdf8 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        // Sky glow
        { type: 'div', props: { style: { position: 'absolute', top: -100, right: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(186,230,253,0.2) 0%, transparent 65%)' } } },
        // Ocean shimmer
        { type: 'div', props: { style: { position: 'absolute', bottom: -80, left: 150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(125,211,252,0.15) 0%, transparent 60%)' } } },
        ...stars(),
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 0 0 72px', width: '55%',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginBottom: 24, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 52, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }, children: 'Thriving\nWith\nMisophonia' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 300, color: '#bae6fd', marginTop: 20, letterSpacing: '0.04em', lineHeight: 1.5 }, children: 'For people who feel\nsound differently' } },
            ],
          },
        },
        stageBar(4),
      ],
    },
  };
}

// Variant G: Coral/pink - warm, friendly, approachable
function coverG() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1084, height: 576,
        background: 'linear-gradient(135deg, #831843 0%, #be185d 35%, #e11d48 65%, #fb7185 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        // Warm blush glow
        { type: 'div', props: { style: { position: 'absolute', top: -120, right: -30, width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,228,230,0.2) 0%, transparent 65%)' } } },
        // Soft pink mist
        { type: 'div', props: { style: { position: 'absolute', bottom: -100, left: 80, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,113,133,0.15) 0%, transparent 60%)' } } },
        ...stars(),
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 0 0 72px', width: '55%',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginBottom: 24, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 52, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.25)' }, children: 'Thriving\nWith\nMisophonia' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 300, color: '#fecdd3', marginTop: 20, letterSpacing: '0.04em', lineHeight: 1.5 }, children: 'For people who feel\nsound differently' } },
            ],
          },
        },
        stageBar(4),
      ],
    },
  };
}

// Variant H: Forest green - earthy, grounded, natural calm
function coverH() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1084, height: 576,
        background: 'linear-gradient(135deg, #14532d 0%, #166534 35%, #15803d 65%, #22c55e 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        // Light through canopy
        { type: 'div', props: { style: { position: 'absolute', top: -130, right: -20, width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(187,247,208,0.18) 0%, transparent 65%)' } } },
        // Ground mist
        { type: 'div', props: { style: { position: 'absolute', bottom: -80, left: 120, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(134,239,172,0.12) 0%, transparent 60%)' } } },
        ...stars(),
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 0 0 72px', width: '55%',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginBottom: 24, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 52, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }, children: 'Thriving\nWith\nMisophonia' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 300, color: '#bbf7d0', marginTop: 20, letterSpacing: '0.04em', lineHeight: 1.5 }, children: 'For people who feel\nsound differently' } },
            ],
          },
        },
        stageBar(4),
      ],
    },
  };
}

// ─────────────────────────────────────────────
// ABOUT PAGE VARIANTS (1400x790) - same styles, larger
// ─────────────────────────────────────────────

function aboutFromCover(coverFn, w = 1400, h = 790) {
  const cover = coverFn();
  const style = { ...cover.props.style, width: w, height: h };
  // Find the text container and bump font sizes
  const children = cover.props.children.map(child => {
    if (child?.props?.style?.width === '55%') {
      return {
        ...child,
        props: {
          ...child.props,
          style: { ...child.props.style, width: '50%', padding: '0 0 0 96px' },
          children: child.props.children.map(c => {
            if (!c?.props?.style?.fontSize) return c;
            const fs = c.props.style.fontSize;
            if (fs >= 50) return { ...c, props: { ...c.props, style: { ...c.props.style, fontSize: 72 } } };
            if (fs >= 20) return { ...c, props: { ...c.props, style: { ...c.props.style, fontSize: 28, marginTop: 28 } } };
            return c;
          }),
        },
      };
    }
    return child;
  });
  return { type: 'div', props: { style, children } };
}

// ─────────────────────────────────────────────
// LOGO (128x128)
// ─────────────────────────────────────────────

function logoSquare() {
  return {
    type: 'div',
    props: {
      style: {
        width: 128, height: 128,
        background: '#0F172A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', borderRadius: 20,
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(165,180,252,0.2) 0%, transparent 70%)' } } },
        ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 80, height: 80, style: { opacity: 0.95 } } }] : []),
      ],
    },
  };
}

async function render(jsx) {
  const { width, height } = jsx.props.style;
  const svg = await satori(jsx, { width, height, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  return resvg.render().asPng();
}

async function main() {
  const outDir = join(ROOT, 'output', 'skool', 'covers');
  mkdirSync(outDir, { recursive: true });

  const coverVariants = [
    { name: 'cover-a-cosmic-dark', fn: coverA },
    { name: 'cover-b-indigo-gradient', fn: coverB },
    { name: 'cover-c-teal-calm', fn: coverC },
    { name: 'cover-d-violet-warm', fn: coverD },
    { name: 'cover-e-sunrise-warm', fn: coverE },
    { name: 'cover-f-ocean-blue', fn: coverF },
    { name: 'cover-g-coral-pink', fn: coverG },
    { name: 'cover-h-forest-green', fn: coverH },
  ];

  console.log('Covers (1084x576):');
  for (const { name, fn } of coverVariants) {
    const png = await render(fn());
    writeFileSync(join(outDir, `${name}.png`), png);
    console.log(`  ${name}.png (${Math.round(png.length / 1024)}KB)`);
  }

  console.log('\nAbout pages (1400x790):');
  for (const { name, fn } of coverVariants) {
    const aboutName = name.replace('cover-', 'about-');
    const png = await render(aboutFromCover(fn));
    writeFileSync(join(outDir, `${aboutName}.png`), png);
    console.log(`  ${aboutName}.png (${Math.round(png.length / 1024)}KB)`);
  }

  console.log('\nLogo (128x128):');
  const logoPng = await render(logoSquare());
  writeFileSync(join(outDir, 'logo.png'), logoPng);
  console.log(`  logo.png (${Math.round(logoPng.length / 1024)}KB)`);

  console.log(`\nDone. ${coverVariants.length * 2 + 1} assets in output/skool/covers/`);
  console.log('Tip: Open in Canva, place your photo on the right side');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
