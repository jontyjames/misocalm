/**
 * CockpitOrb — 5-layer glowing orb for timer setup
 * Adapted from BreathingCircle visual DNA, smaller for cockpit context.
 * Reacts to selection changes with color pulse.
 */

'use client';

const COLOR_MAP = {
  indigo: '99,102,241',
  cyan: '34,211,238',
  violet: '139,92,246',
};

export default function CockpitOrb({ duration, reactColor, reactPulse }) {
  const rgb = COLOR_MAP[reactColor] || COLOR_MAP.indigo;
  const glowOpacity = reactPulse ? 0.45 : 0.25;
  const ringOpacity = reactPulse ? 0.9 : 0.7;

  return (
    <div
      className="relative w-44 h-44"
      style={{
        animation: reactPulse ? 'cockpitReact 610ms ease-out' : 'none',
      }}
    >
      {/* Layer 1: Phi ring */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '-10px',
          border: '1px solid rgba(139,92,246,0.04)',
          background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.03) 0%, transparent 70%)',
        }}
      />

      {/* Layer 2: Outer glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-[233ms]"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(${rgb},${glowOpacity}) 0%, rgba(${rgb},0.08) 50%, transparent 70%)`,
        }}
      />

      {/* Layer 3: Torus flow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(99,102,241,0.1) 0%, transparent 60%)
          `,
          animation: 'solfeggio-breathe-852 3.7s ease-in-out infinite',
        }}
      />

      {/* Layer 4: Gradient ring */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400 transition-opacity duration-[233ms]"
        style={{
          inset: '10px',
          opacity: ringOpacity,
        }}
      />

      {/* Layer 5: Dark centre with duration */}
      <div
        className="absolute rounded-full bg-slate-900 flex items-center justify-center"
        style={{ inset: '26px' }}
      >
        <span
          className="text-2xl text-white"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          {duration} min
        </span>
      </div>
    </div>
  );
}
