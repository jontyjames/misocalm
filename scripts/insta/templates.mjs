// Instagram post template functions (satori JSX)
// Each returns a JSX tree that satori renders to SVG at 1080x1080.

const ACCENT_COLOURS = {
  indigo: { primary: '#a5b4fc', glow: 'rgba(165,180,252,0.12)', glowStrong: 'rgba(165,180,252,0.25)' },
  violet: { primary: '#c4b5fd', glow: 'rgba(196,181,253,0.12)', glowStrong: 'rgba(196,181,253,0.25)' },
  cyan:   { primary: '#67e8f9', glow: 'rgba(103,232,249,0.12)', glowStrong: 'rgba(103,232,249,0.25)' },
};

// 13 star positions (prime count), placed by hand for organic feel
const STARS = [
  { x: 120, y: 80, r: 2, o: 0.7 },
  { x: 340, y: 150, r: 1.5, o: 0.5 },
  { x: 780, y: 95, r: 2.5, o: 0.8 },
  { x: 950, y: 200, r: 1.5, o: 0.6 },
  { x: 200, y: 380, r: 2, o: 0.5 },
  { x: 880, y: 420, r: 1.5, o: 0.4 },
  { x: 100, y: 650, r: 2, o: 0.6 },
  { x: 500, y: 120, r: 1.5, o: 0.45 },
  { x: 700, y: 700, r: 2, o: 0.5 },
  { x: 300, y: 900, r: 1.5, o: 0.4 },
  { x: 850, y: 850, r: 2, o: 0.55 },
  { x: 600, y: 500, r: 1.5, o: 0.35 },
  { x: 450, y: 750, r: 2, o: 0.45 },
];

function CosmicBackground({ children, accent = 'indigo', logoBase64 }) {
  const colours = ACCENT_COLOURS[accent] || ACCENT_COLOURS.indigo;

  return {
    type: 'div',
    props: {
      style: {
        width: 1080,
        height: 1080,
        background: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Josefin Sans',
      },
      children: [
        // Nebula glow top-right (indigo)
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: -200,
              right: -200,
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(165,180,252,0.08) 0%, transparent 70%)',
            },
          },
        },
        // Nebula glow bottom-left (cyan)
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: -200,
              left: -200,
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(103,232,249,0.06) 0%, transparent 70%)',
            },
          },
        },
        // Star dots
        ...STARS.map((s, i) => ({
          type: 'div',
          key: `star-${i}`,
          props: {
            style: {
              position: 'absolute',
              top: s.y,
              left: s.x,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: '50%',
              background: '#e2e8f0',
              opacity: s.o,
            },
          },
        })),
        // Content
        ...children,
        // Logo watermark at bottom
        ...(logoBase64
          ? [
              {
                type: 'img',
                props: {
                  src: logoBase64,
                  width: 40,
                  height: 40,
                  style: {
                    position: 'absolute',
                    bottom: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: 0.4,
                  },
                },
              },
            ]
          : []),
      ],
    },
  };
}

export function cover({ headline, subtitle, accent = 'indigo', logoBase64 }) {
  const colours = ACCENT_COLOURS[accent] || ACCENT_COLOURS.indigo;

  return CosmicBackground({
    accent,
    logoBase64,
    children: [
      // Accent glow behind headline
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colours.glow} 0%, transparent 70%)`,
          },
        },
      },
      // Headline
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 80px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 72,
                  fontWeight: 200,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                },
                children: headline,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 28,
                  fontWeight: 300,
                  color: '#cbd5e1',
                  marginTop: 32,
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                },
                children: subtitle,
              },
            },
          ],
        },
      },
    ],
  });
}

export function content({ number, headline, body, accent = 'indigo', logoBase64 }) {
  const colours = ACCENT_COLOURS[accent] || ACCENT_COLOURS.indigo;

  return CosmicBackground({
    accent,
    logoBase64,
    children: [
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 100px',
          },
          children: [
            // Number badge
            {
              type: 'div',
              props: {
                style: {
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: `2px solid ${colours.primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 200,
                  color: colours.primary,
                  marginBottom: 42,
                },
                children: number,
              },
            },
            // Headline
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 48,
                  fontWeight: 200,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  letterSpacing: '0.02em',
                  marginBottom: 32,
                  textAlign: 'center',
                },
                children: headline,
              },
            },
            // Body
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 26,
                  fontWeight: 300,
                  color: '#cbd5e1',
                  lineHeight: 1.55,
                  letterSpacing: '0.01em',
                  textAlign: 'center',
                },
                children: body,
              },
            },
          ],
        },
      },
    ],
  });
}

export function quote({ text, attribution, accent = 'indigo', logoBase64 }) {
  const colours = ACCENT_COLOURS[accent] || ACCENT_COLOURS.indigo;

  return CosmicBackground({
    accent,
    logoBase64,
    children: [
      // Accent glow behind quote
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colours.glow} 0%, transparent 70%)`,
          },
        },
      },
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 100px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 44,
                  fontWeight: 200,
                  color: '#ffffff',
                  lineHeight: 1.4,
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                  textShadow: `0 0 40px ${colours.glowStrong}`,
                },
                children: `"${text}"`,
              },
            },
            ...(attribution
              ? [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 22,
                        fontWeight: 300,
                        color: colours.primary,
                        marginTop: 42,
                        letterSpacing: '0.04em',
                      },
                      children: attribution,
                    },
                  },
                ]
              : []),
          ],
        },
      },
    ],
  });
}

export function cta({ headline, body, ctaText = 'Link in bio', accent = 'cyan', logoBase64 }) {
  const colours = ACCENT_COLOURS[accent] || ACCENT_COLOURS.cyan;

  return CosmicBackground({
    accent,
    logoBase64,
    children: [
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 100px',
          },
          children: [
            // Headline
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 48,
                  fontWeight: 200,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  letterSpacing: '0.02em',
                  marginBottom: 32,
                  textAlign: 'center',
                },
                children: headline,
              },
            },
            // Body
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 26,
                  fontWeight: 300,
                  color: '#cbd5e1',
                  lineHeight: 1.55,
                  letterSpacing: '0.01em',
                  marginBottom: 48,
                  textAlign: 'center',
                },
                children: body,
              },
            },
            // CTA pill button
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '18px 48px',
                  borderRadius: 999,
                  border: `2px solid ${colours.primary}`,
                  fontSize: 24,
                  fontWeight: 300,
                  color: colours.primary,
                  letterSpacing: '0.06em',
                },
                children: ctaText,
              },
            },
          ],
        },
      },
    ],
  });
}
