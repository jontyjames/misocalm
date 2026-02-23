/**
 * BreathingHero — Decorative breathing orb for the hero section.
 * Concentric rings with solfeggio-timed breathing animation.
 * Pure CSS, no JS animation loop.
 */

export default function BreathingHero({ className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center breathing-hero ${className}`}
      aria-hidden="true"
    >
      {/* Outer glow */}
      <div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          animation: 'heroBreathOuter 5.3s ease-in-out infinite',
        }}
      />
      {/* Middle ring */}
      <div
        className="absolute w-32 h-32 rounded-full border border-indigo-400/20"
        style={{ animation: 'heroBreathMiddle 7.1s ease-in-out infinite' }}
      />
      {/* Inner ring */}
      <div
        className="absolute w-20 h-20 rounded-full border border-violet-400/25"
        style={{ animation: 'heroBreathInner 5.3s ease-in-out infinite' }}
      />
      {/* Core dot */}
      <div
        className="w-3 h-3 rounded-full bg-indigo-400/60"
        style={{ animation: 'heroBreathCore 3.7s ease-in-out infinite' }}
      />
    </div>
  );
}
