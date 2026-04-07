#!/usr/bin/env node
// YouTube banner generator - high quality cosmic design
// Usage: node scripts/youtube/generate-banner.mjs
// Output: output/youtube/youtube-banner.png

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
];

const logoPath = join(ROOT, 'public', 'icons', 'MisoCalm-logo-v1.png');
let logoBase64;
try {
  logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`;
} catch { logoBase64 = null; }

const W = 2560;
const H = 1440;

// --- STARS ---
function makeStars() {
  const stars = [];

  // Distant tiny stars
  const tiny = [
    [2,3],[5,8],[8,15],[3,22],[7,35],[2,48],[6,58],[4,72],[8,82],[3,92],
    [12,5],[15,18],[11,32],[14,45],[13,62],[16,75],[10,88],[18,95],
    [22,7],[25,20],[21,38],[24,52],[28,68],[23,80],[27,90],
    [32,4],[35,15],[38,28],[33,42],[36,58],[31,70],[34,85],[37,94],
    [42,8],[45,22],[48,35],[41,50],[44,65],[47,78],[43,92],
    [52,5],[55,12],[58,30],[53,45],[56,55],[51,68],[54,82],[57,95],
    [62,3],[65,18],[68,25],[63,40],[66,58],[61,72],[64,88],
    [72,8],[75,15],[78,32],[73,48],[76,62],[71,78],[74,90],
    [82,5],[85,20],[88,35],[83,50],[86,65],[81,80],[84,92],
    [92,8],[95,22],[90,38],[93,55],[96,70],[91,85],[94,95],
    [17,12],[27,28],[37,42],[47,58],[57,72],[67,85],[77,48],[87,15],
    [9,55],[19,70],[29,82],[39,12],[49,88],[59,42],[69,62],[79,25],
  ];
  for (const [x, y] of tiny) {
    stars.push({ x, y, size: 1 + (x * y % 2), opacity: 0.2 + (x % 5) * 0.04 });
  }

  // Medium stars
  const medium = [
    [10,10],[30,5],[50,15],[70,8],[90,12],
    [20,30],[40,25],[60,35],[80,28],
    [15,50],[35,55],[55,48],[75,52],[95,50],
    [8,70],[28,75],[48,68],[68,72],[88,65],
    [18,88],[38,92],[58,85],[78,90],
    [45,42],[25,62],[65,22],[85,42],
  ];
  for (const [x, y] of medium) {
    stars.push({ x, y, size: 2 + (x % 2), opacity: 0.35 + (y % 4) * 0.06 });
  }

  // Bright stars
  const bright = [
    [8,5],[45,8],[78,3],[92,15],
    [18,42],[62,38],[85,45],
    [5,65],[38,70],[72,62],[95,72],
    [25,88],[55,92],[82,85],
  ];
  for (const [x, y] of bright) {
    stars.push({ x, y, size: 3 + (x % 2), opacity: 0.55 + (y % 3) * 0.1 });
  }

  return stars.map((s, i) => ({
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        top: `${s.y}%`,
        left: `${s.x}%`,
        width: s.size,
        height: s.size,
        borderRadius: '50%',
        background: '#e2e8f0',
        opacity: s.opacity,
      },
    },
  }));
}

// Glow orb using circle gradient (proven to work in Satori from Skool generator)
function glow(top, left, size, rgba) {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${rgba} 0%, rgba(0,0,0,0) 70%)`,
      },
    },
  };
}

function banner() {
  return {
    type: 'div',
    props: {
      style: {
        width: W,
        height: H,
        background: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        // === BACKGROUND DEPTH ===
        // Subtle gradient overlay for non-flat background
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0, left: 0, width: W, height: H,
              background: 'linear-gradient(160deg, rgba(10,17,32,0.8) 0%, rgba(15,23,42,0) 30%, rgba(19,29,51,0.3) 50%, rgba(15,23,42,0) 70%, rgba(11,19,34,0.6) 100%)',
            },
          },
        },

        // === ATMOSPHERIC GLOW LAYERS ===

        // Top-right nebula cluster (like the Skool cover)
        glow(-200, 1400, 1000, 'rgba(165,180,252,0.08)'),
        glow(-100, 1500, 700, 'rgba(196,181,253,0.06)'),
        glow(-50, 1600, 400, 'rgba(255,255,255,0.03)'),

        // Centre glow (behind text)
        glow(300, 700, 1200, 'rgba(129,140,248,0.06)'),
        glow(350, 800, 900, 'rgba(167,139,250,0.05)'),
        glow(400, 900, 600, 'rgba(196,181,253,0.04)'),

        // Bottom-left warmth
        glow(800, -200, 900, 'rgba(129,140,248,0.05)'),
        glow(900, -100, 600, 'rgba(167,139,250,0.04)'),

        // Bottom-right cyan accent
        glow(700, 1800, 700, 'rgba(103,232,249,0.03)'),

        // Vignette (darken edges)
        glow(-300, -300, 1200, 'rgba(5,8,15,0.5)'),
        glow(-300, 1900, 1200, 'rgba(5,8,15,0.4)'),
        glow(800, -400, 1200, 'rgba(5,8,15,0.5)'),
        glow(800, 2000, 1000, 'rgba(5,8,15,0.4)'),

        // === STARS ===
        ...makeStars(),

        // === CONTENT (within mobile safe zone: 507,509 to 2053,932) ===
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 509,
              left: 507,
              width: 1546,
              height: 423,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: [
              // Logo with glow ring
              ...(logoBase64
                ? [
                    {
                      type: 'div',
                      props: {
                        style: {
                          position: 'relative',
                          width: 80,
                          height: 80,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20,
                        },
                        children: [
                          // Soft glow behind logo
                          {
                            type: 'div',
                            props: {
                              style: {
                                position: 'absolute',
                                top: -20,
                                left: -20,
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(165,180,252,0.15) 0%, rgba(0,0,0,0) 70%)',
                              },
                            },
                          },
                          // Ring
                          {
                            type: 'div',
                            props: {
                              style: {
                                position: 'absolute',
                                top: -5,
                                left: -5,
                                width: 90,
                                height: 90,
                                borderRadius: '50%',
                                border: '1px solid rgba(165,180,252,0.3)',
                              },
                            },
                          },
                          // Logo
                          {
                            type: 'img',
                            props: {
                              src: logoBase64,
                              width: 68,
                              height: 68,
                            },
                          },
                        ],
                      },
                    },
                  ]
                : []),

              // Title
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 78,
                    fontWeight: 200,
                    color: '#ffffff',
                    letterSpacing: '3px',
                    lineHeight: 1.1,
                    textAlign: 'center',
                  },
                  children: 'Thriving With Misophonia',
                },
              },

              // Subtitle
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 27,
                    fontWeight: 300,
                    color: '#CBD5E1',
                    letterSpacing: '1.5px',
                    marginTop: 18,
                    textAlign: 'center',
                  },
                  children: 'Tools, stories, and community for sound-sensitive humans',
                },
              },

              // Links
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 21,
                    fontWeight: 300,
                    color: '#A5B4FC',
                    letterSpacing: '0.5px',
                    marginTop: 22,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                  },
                  children: [
                    { type: 'span', props: { children: 'misocalm.app' } },
                    { type: 'span', props: { style: { color: 'rgba(165,180,252,0.3)' }, children: '|' } },
                    { type: 'span', props: { children: '@thrivingwithmisophonia' } },
                  ],
                },
              },
            ],
          },
        },
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
  const outDir = join(ROOT, '..', 'thriving-with-misophonia', 'content', 'youtube');
  mkdirSync(outDir, { recursive: true });

  console.log('Generating YouTube banner (2560x1440)...');
  const png = await render(banner());
  const outPath = join(outDir, 'youtube-banner.png');
  writeFileSync(outPath, png);
  console.log(`  youtube-banner.png (${Math.round(png.length / 1024)}KB)`);
  console.log(`\nDone. File at: output/youtube/youtube-banner.png`);
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
