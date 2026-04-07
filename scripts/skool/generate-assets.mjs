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

async function render(jsx, scale = 1) {
  const { width, height } = jsx.props.style;
  const svg = await satori(jsx, { width, height, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width * scale } });
  return resvg.render().asPng();
}

// ─────────────────────────────────────────────
// ABOUT PAGE CONTENT CARDS (1400x790) - for Skool about page images
// ─────────────────────────────────────────────

// Solfeggio-inspired colour themes for each card
const CARD_THEMES = {
  // 639 Hz - Connection (indigo/blue) → What You Get (community overview)
  connection: {
    bg: 'linear-gradient(135deg, #0F172A 0%, #1e1b4b 50%, #312e81 100%)',
    glow1: 'radial-gradient(circle, rgba(165,180,252,0.18) 0%, transparent 70%)',
    glow2: 'radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)',
    accent: '#a5b4fc',
    accentBright: '#c7d2fe',
    accentSoft: '#c7d2fe',
    text: '#e0e7ff',
    sub: '#c7d2fe',
    bar: ['#818cf8', '#a5b4fc', '#c7d2fe', '#93c5fd', '#6366f1'],
  },
  // 528 Hz - Love/healing (teal/emerald) → Manifesto (heart of beliefs)
  healing: {
    bg: 'linear-gradient(135deg, #0F172A 0%, #064e3b 50%, #065f46 100%)',
    glow1: 'radial-gradient(circle, rgba(94,234,212,0.18) 0%, transparent 70%)',
    glow2: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
    accent: '#5eead4',
    accentBright: '#99f6e4',
    accentSoft: '#99f6e4',
    text: '#ccfbf1',
    sub: '#99f6e4',
    bar: ['#2dd4bf', '#5eead4', '#99f6e4', '#34d399', '#14b8a6'],
  },
  // 852 Hz - Intuition (violet/purple) → MisoCalm App (cosmic)
  intuition: {
    bg: 'linear-gradient(135deg, #0F172A 0%, #3b0764 50%, #581c87 100%)',
    glow1: 'radial-gradient(circle, rgba(196,181,253,0.18) 0%, transparent 70%)',
    glow2: 'radial-gradient(circle, rgba(232,121,249,0.1) 0%, transparent 70%)',
    accent: '#c4b5fd',
    accentBright: '#e9d5ff',
    accentSoft: '#e9d5ff',
    text: '#f3e8ff',
    sub: '#e9d5ff',
    bar: ['#a78bfa', '#c4b5fd', '#e9d5ff', '#d946ef', '#8b5cf6'],
  },
  // 396 Hz - Liberation (warm amber/gold) → Course (the journey)
  liberation: {
    bg: 'linear-gradient(135deg, #0F172A 0%, #78350f 50%, #92400e 100%)',
    glow1: 'radial-gradient(circle, rgba(251,191,36,0.16) 0%, transparent 70%)',
    glow2: 'radial-gradient(circle, rgba(253,224,71,0.1) 0%, transparent 70%)',
    accent: '#fbbf24',
    accentBright: '#fde68a',
    accentSoft: '#fde68a',
    text: '#fef3c7',
    sub: '#fde68a',
    bar: ['#f59e0b', '#fbbf24', '#fde68a', '#fb923c', '#d97706'],
  },
};

function contentCardBase(children, theme) {
  const t = CARD_THEMES[theme];
  return {
    type: 'div',
    props: {
      style: {
        width: 1400, height: 790,
        background: t.bg,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
        padding: '50px 80px',
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: -120, right: 80, width: 550, height: 550, borderRadius: '50%', background: t.glow1 } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: -100, left: -80, width: 450, height: 450, borderRadius: '50%', background: t.glow2 } } },
        ...stars(),
        ...children,
        // Themed bottom bar
        {
          type: 'div',
          props: {
            style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, display: 'flex' },
            children: t.bar.map(c => ({ type: 'div', props: { style: { flex: 1, background: c, opacity: 0.7 } } })),
          },
        },
      ],
    },
  };
}

function listItem(icon, text, theme = 'connection') {
  const t = CARD_THEMES[theme];
  return {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', marginBottom: 32 },
      children: [
        { type: 'div', props: { style: { width: 10, height: 10, borderRadius: '50%', background: t.accentBright, opacity: 0.85, marginRight: 28, flexShrink: 0 } } },
        { type: 'div', props: { style: { fontSize: 36, fontWeight: 300, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1.4 }, children: text } },
      ],
    },
  };
}

// Card 1: What You Get (639 Hz - Connection / indigo)
function featureBlock(title, desc, theme) {
  const t = CARD_THEMES[theme];
  return {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', marginBottom: 28 },
      children: [
        { type: 'div', props: { style: { fontSize: 28, fontWeight: 400, color: t.accentBright, letterSpacing: '0.03em', marginBottom: 6 }, children: title } },
        { type: 'div', props: { style: { fontSize: 21, fontWeight: 300, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1.5, opacity: 0.92 }, children: desc } },
      ],
    },
  };
}

function cardWhatYouGet() {
  const t = CARD_THEMES.connection;
  return contentCardBase([
    { type: 'div', props: { style: { fontSize: 52, fontWeight: 300, color: '#ffffff', letterSpacing: '0.04em', marginBottom: 40, textAlign: 'center' }, children: 'What You Get' } },
    {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 1100 },
        children: [
          featureBlock(
            'The 5-Stage Video Course',
            'Your brain doesn\'t just hear trigger sounds. It reacts as if they\'re a threat to your safety. This course explains what\'s actually happening in your nervous system and walks you through 25 modules of real tools to reshape your relationship with sound. Not overnight. But genuinely.',
            'connection'
          ),
          featureBlock(
            '2x Weekly Live Calls',
            'A room where nobody says "just ignore it." Where your experience is understood, not questioned. Real conversation, not a lecture. Themed around different parts of the journey. Recorded if life gets in the way.',
            'connection'
          ),
          featureBlock(
            'Private Community',
            'The first space where you can stop performing. Where "I get it" actually means something. Share a win. Ask a question. Or just read and realise you\'re not the only one.',
            'connection'
          ),
          featureBlock(
            'MisoCalm App (free for all members)',
            'For the moments in between. The 2am spiral. The deep breath before a family dinner. The walk home after leaving early. Guided experiences built on somatic and nervous system research. Breathing tools, journaling. In your pocket whenever you need it.',
            'connection'
          ),
        ],
      },
    },
  ], 'connection');
}

// Card 2: Community Manifesto (528 Hz - Healing / teal)
function cardManifesto() {
  const t = CARD_THEMES.healing;
  const beliefs = [
    'You are not broken',
    'We celebrate every win',
    'Creators, not victims',
    'No judgement here',
    'Connection first',
  ];
  return contentCardBase([
    { type: 'div', props: { style: { fontSize: 56, fontWeight: 300, color: '#ffffff', letterSpacing: '0.04em', marginBottom: 12, textAlign: 'center' }, children: 'What We Believe' } },
    { type: 'div', props: { style: { fontSize: 26, fontWeight: 300, color: t.sub, letterSpacing: '0.04em', marginBottom: 44, textAlign: 'center' }, children: 'The culture that holds this space' } },
    {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 800, alignItems: 'center' },
        children: beliefs.map(b => ({
          type: 'div',
          props: {
            style: {
              fontSize: 40, fontWeight: 300, color: '#ffffff',
              letterSpacing: '0.04em', marginBottom: 36,
              textAlign: 'center', lineHeight: 1.3,
            },
            children: b,
          },
        })),
      },
    },
  ], 'healing');
}

// Compact feature block for MisoCalm card
function smallFeatureBlock(title, desc, theme) {
  const t = CARD_THEMES[theme];
  return {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', marginBottom: 24 },
      children: [
        { type: 'div', props: { style: { fontSize: 26, fontWeight: 400, color: t.accentBright, letterSpacing: '0.03em', marginBottom: 5 }, children: title } },
        { type: 'div', props: { style: { fontSize: 19, fontWeight: 300, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1.5, opacity: 0.9 }, children: desc } },
      ],
    },
  };
}

// Card 3: MisoCalm App (852 Hz - Intuition / violet) - text left, screenshot space right
function cardApp() {
  const t = CARD_THEMES.intuition;
  return {
    type: 'div',
    props: {
      style: {
        width: 1400, height: 790,
        background: t.bg,
        display: 'flex',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: -120, right: 80, width: 550, height: 550, borderRadius: '50%', background: t.glow1 } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: -100, left: -80, width: 450, height: 450, borderRadius: '50%', background: t.glow2 } } },
        ...stars(),
        // Left side - text
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '44px 40px 44px 72px', width: '55%',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', marginBottom: 8 },
                  children: [
                    ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 48, height: 48, style: { marginRight: 18, opacity: 0.9 } } }] : []),
                    { type: 'div', props: { style: { fontSize: 48, fontWeight: 300, color: '#ffffff', letterSpacing: '0.04em' }, children: 'MisoCalm' } },
                  ],
                },
              },
              { type: 'div', props: { style: { fontSize: 22, fontWeight: 300, color: t.sub, letterSpacing: '0.04em', marginBottom: 30 }, children: 'Your daily companion between sessions' } },
              smallFeatureBlock(
                'Guided experiences',
                'Your nervous system learned to read certain sounds as danger. These sessions gently help it learn something new. Body-first, built on somatic research.',
                'intuition'
              ),
              smallFeatureBlock(
                'Breathing & regulation tools',
                'For the moments that matter most. Before a meal. After a trigger. Simple tools to bring you back to yourself.',
                'intuition'
              ),
              smallFeatureBlock(
                'Private journaling',
                'A safe space to notice what you\'re feeling. Your body holds experiences your mind hasn\'t processed yet. Writing helps them move.',
                'intuition'
              ),
              smallFeatureBlock(
                'Nervous system education',
                'When you understand what\'s happening in your body, the shame begins to soften. This is where that understanding starts.',
                'intuition'
              ),
              { type: 'div', props: { style: { fontSize: 22, fontWeight: 300, color: t.accentBright, marginTop: 16, letterSpacing: '0.04em' }, children: 'Included free with membership' } },
            ],
          },
        },
        // Right side - empty space for screenshots
        { type: 'div', props: { style: { width: '45%' } } },
        // Themed bottom bar
        {
          type: 'div',
          props: {
            style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, display: 'flex' },
            children: t.bar.map(c => ({ type: 'div', props: { style: { flex: 1, background: c, opacity: 0.7 } } })),
          },
        },
      ],
    },
  };
}

// Card 4: Course Overview (396 Hz - Liberation / amber)
function cardCourse() {
  const t = CARD_THEMES.liberation;
  const stages = [
    { num: '1', name: 'Seeing Clearly', desc: 'What misophonia actually is. Why your brain doesn\'t just hear trigger sounds, it reacts as if they\'re a threat to your body. Why your nervous system responds this way. And why none of it means you\'re broken.' },
    { num: '2', name: 'Finding Ground', desc: 'Developing emotional safety through body-based tools. Breathing, somatic practices, regulation. Your body first, always.' },
    { num: '3', name: 'Healing the Roots', desc: 'Processing the grief, shame, and emotional weight your body has been carrying. Gently, at your pace. Moving between safety and feeling, never more than you can hold.' },
    { num: '4', name: 'Nourishing the Whole', desc: 'Sleep, nutrition, movement, and environment. A regulated, nourished body has more capacity for everything.' },
    { num: '5', name: 'Thriving', desc: 'Communication, relationships, gentle exposure, and building a life that is no longer defined by sound.' },
  ];
  const stageColours = ['#fbbf24', '#f59e0b', '#fde68a', '#fcd34d', '#fbbf24'];
  return contentCardBase([
    { type: 'div', props: { style: { fontSize: 56, fontWeight: 300, color: '#ffffff', letterSpacing: '0.04em', marginBottom: 52, textAlign: 'center' }, children: 'The 5-Stage Course' } },
    {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 1000 },
        children: stages.map((s, i) => ({
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'baseline', marginBottom: 28 },
            children: [
              { type: 'div', props: { style: { fontSize: 28, fontWeight: 400, color: stageColours[i], marginRight: 24, minWidth: 32 }, children: s.num } },
              { type: 'div', props: { style: { display: 'flex', flexDirection: 'column' }, children: [
                { type: 'div', props: { style: { fontSize: 34, fontWeight: 400, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1.3 }, children: s.name } },
                { type: 'div', props: { style: { fontSize: 21, fontWeight: 300, color: '#ffffff', letterSpacing: '0.02em', marginTop: 4, opacity: 0.8, lineHeight: 1.4 }, children: s.desc } },
              ] } },
            ],
          },
        })),
      },
    },
    { type: 'div', props: { style: { fontSize: 26, fontWeight: 300, color: t.sub, marginTop: 24, letterSpacing: '0.04em', textAlign: 'center' }, children: '25 video modules. Your pace. Your path.' } },
  ], 'liberation');
}

// ─────────────────────────────────────────────
// FACEBOOK PAGE COVER (820x312 display, rendered at 1640x624 for retina)
// ─────────────────────────────────────────────

// Variation A: Cosmic dark.
// FB Page cover: 820x312 desktop, 640x360 mobile. Profile pic overlaps bottom-left.
// Safe zone: 640x312 centred (90px crop each side on mobile).
// Strategy: text centred in top half + right side. Bottom-left kept clear for profile pic.
function facebookCoverA() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1640, height: 624,
        background: '#0F172A',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: -150, right: 200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)' } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: -120, left: -50, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.1) 0%, transparent 70%)' } } },
        { type: 'div', props: { style: { position: 'absolute', top: '30%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 70%)' } } },
        ...stars(),
        // Centre-right text block (avoids bottom-left profile pic zone + 90px mobile crop)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              width: '100%',
              padding: '0 180px',
            },
            children: [
              ...(logoBase64 ? [{ type: 'img', props: { src: logoBase64, width: 56, height: 56, style: { marginBottom: 20, opacity: 0.9 } } }] : []),
              { type: 'div', props: { style: { fontSize: 62, fontWeight: 400, color: '#ffffff', lineHeight: 1.15, letterSpacing: '0.02em', textAlign: 'center' }, children: 'Thriving With Misophonia' } },
              { type: 'div', props: { style: { fontSize: 24, fontWeight: 300, color: '#cbd5e1', marginTop: 18, letterSpacing: '0.04em', textAlign: 'center' }, children: 'For people who feel sound differently' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 200, color: '#64748b', marginTop: 28, letterSpacing: '0.06em', textAlign: 'center' }, children: 'Community  ·  Course  ·  Tools  ·  Live Calls' } },
            ],
          },
        },
        stageBar(3),
      ],
    },
  };
}

// Variation B: Indigo gradient, centred top text, tagline bottom
function facebookCoverB() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1640, height: 624,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
        padding: '70px 80px 50px',
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: -80, left: '40%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)' } } },
        ...stars(),
        // Top: Main headline
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
            children: [
              { type: 'div', props: { style: { fontSize: 28, fontWeight: 200, color: '#a5b4fc', letterSpacing: '0.14em', marginBottom: 14, textTransform: 'uppercase' }, children: 'from surviving to' } },
              { type: 'div', props: { style: { fontSize: 96, fontWeight: 400, color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1.0 }, children: 'Thriving' } },
              { type: 'div', props: { style: { fontSize: 36, fontWeight: 300, color: '#c7d2fe', letterSpacing: '0.06em', marginTop: 12 }, children: 'with Misophonia' } },
            ],
          },
        },
        // Bottom: Tagline
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 48 },
            children: [
              { type: 'div', props: { style: { fontSize: 22, fontWeight: 200, color: '#a5b4fc', letterSpacing: '0.08em' }, children: 'Community' } },
              { type: 'div', props: { style: { fontSize: 14, color: '#6366f1' }, children: '·' } },
              { type: 'div', props: { style: { fontSize: 22, fontWeight: 200, color: '#a5b4fc', letterSpacing: '0.08em' }, children: 'Course' } },
              { type: 'div', props: { style: { fontSize: 14, color: '#6366f1' }, children: '·' } },
              { type: 'div', props: { style: { fontSize: 22, fontWeight: 200, color: '#a5b4fc', letterSpacing: '0.08em' }, children: 'Tools' } },
              { type: 'div', props: { style: { fontSize: 14, color: '#6366f1' }, children: '·' } },
              { type: 'div', props: { style: { fontSize: 22, fontWeight: 200, color: '#a5b4fc', letterSpacing: '0.08em' }, children: 'Live Calls' } },
            ],
          },
        },
        stageBar(3),
      ],
    },
  };
}

// Variation C: Teal gradient, "For people who feel sound differently" tagline
function facebookCoverC() {
  return {
    type: 'div',
    props: {
      style: {
        width: 1640, height: 624,
        background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 60%, #115e59 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: -100, right: 50, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,234,212,0.12) 0%, transparent 70%)' } } },
        { type: 'div', props: { style: { position: 'absolute', bottom: -80, left: 200, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.08) 0%, transparent 70%)' } } },
        ...stars(),
        // Left side
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', padding: '0 0 0 100px',
              width: '55%',
            },
            children: [
              { type: 'div', props: { style: { fontSize: 80, fontWeight: 300, color: '#ffffff', letterSpacing: '0.03em', lineHeight: 1.1 }, children: 'Thriving\nWith\nMisophonia' } },
            ],
          },
        },
        // Right side
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'flex-end',
              padding: '0 100px 0 0',
              width: '45%',
            },
            children: [
              { type: 'div', props: { style: { fontSize: 26, fontWeight: 200, color: '#99f6e4', letterSpacing: '0.06em', textAlign: 'right', lineHeight: 1.8 }, children: 'For people who feel\nsound differently' } },
              { type: 'div', props: { style: { fontSize: 20, fontWeight: 200, color: '#5eead4', letterSpacing: '0.08em', textAlign: 'right', marginTop: 28, opacity: 0.6 }, children: 'Community · Course · Tools' } },
            ],
          },
        },
        stageBar(3),
      ],
    },
  };
}

async function main() {
  const outDir = join(ROOT, '..', 'thriving-with-misophonia', 'course-overlays', 'skool-thumbnails', 'covers');
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

  const HI_RES = 3; // 3x resolution for sharp text when zoomed (4x OOMs on large cards)

  console.log(`Covers (1084x576 @${HI_RES}x = ${1084*HI_RES}x${576*HI_RES}):`);
  for (const { name, fn } of coverVariants) {
    const png = await render(fn(), HI_RES);
    writeFileSync(join(outDir, `${name}.png`), png);
    console.log(`  ${name}.png (${Math.round(png.length / 1024)}KB)`);
  }

  console.log(`\nAbout pages (1400x790 @${HI_RES}x = ${1400*HI_RES}x${790*HI_RES}):`);
  for (const { name, fn } of coverVariants) {
    const aboutName = name.replace('cover-', 'about-');
    const png = await render(aboutFromCover(fn), HI_RES);
    writeFileSync(join(outDir, `${aboutName}.png`), png);
    console.log(`  ${aboutName}.png (${Math.round(png.length / 1024)}KB)`);
  }

  console.log('\nLogo (128x128 @4x = 512x512):');
  const logoPng = await render(logoSquare(), 4);
  writeFileSync(join(outDir, 'logo.png'), logoPng);
  console.log(`  logo.png (${Math.round(logoPng.length / 1024)}KB)`);

  // Content cards for about page (1400x790)
  const contentCards = [
    { name: 'card-what-you-get', fn: cardWhatYouGet },
    { name: 'card-manifesto', fn: cardManifesto },
    { name: 'card-misocalm-app', fn: cardApp },
    { name: 'card-course-overview', fn: cardCourse },
  ];

  console.log(`\nContent cards (1400x790 @${HI_RES}x = ${1400*HI_RES}x${790*HI_RES}):`);
  for (const { name, fn } of contentCards) {
    const png = await render(fn(), HI_RES);
    writeFileSync(join(outDir, `${name}.png`), png);
    console.log(`  ${name}.png (${Math.round(png.length / 1024)}KB)`);
  }

  // Facebook covers (1640x624, already 2x so render @1x)
  const fbVariants = [
    { name: 'facebook-cover-a', fn: facebookCoverA },
    { name: 'facebook-cover-b', fn: facebookCoverB },
    { name: 'facebook-cover-c', fn: facebookCoverC },
  ];
  console.log('\nFacebook covers (1640x624):');
  for (const { name, fn } of fbVariants) {
    const png = await render(fn(), 1);
    writeFileSync(join(outDir, `${name}.png`), png);
    console.log(`  ${name}.png (${Math.round(png.length / 1024)}KB)`);
  }

  const total = coverVariants.length * 2 + 1 + contentCards.length + fbVariants.length;
  console.log(`\nDone. ${total} assets in output/skool/covers/`);
  console.log('Tip: Open in Canva, place your photo on the right side of covers');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
