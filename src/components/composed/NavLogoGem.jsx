/**
 * NavLogoGem
 * Elevated logo circle for the floating bottom nav.
 * 52px sacred glass circle with breathing glow animation.
 */

'use client';

export default function NavLogoGem({ onTap }) {
  return (
    <button
      onClick={onTap}
      aria-label="Show mantra"
      className="relative flex items-center justify-center"
      style={{ marginTop: 0 }}
    >
      {/* Breathing glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          width: 52,
          height: 52,
          background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 60%, transparent 80%)',
          animation: 'gem-breathe 2584ms ease-in-out infinite',
        }}
      />

      {/* Glass circle */}
      <div
        className="relative flex items-center justify-center rounded-full border backdrop-blur-2xl"
        style={{
          width: 52,
          height: 52,
          borderColor: 'rgba(255,255,255,0.25)',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(30,41,59,0.85) 50%, rgba(3,7,18,0.92) 100%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 0 16px rgba(139,92,246,0.2), 0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src="/icons/MisoCalm-logo-v1.png"
          alt="MisoCalm"
          className="w-10 h-10"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.4)) drop-shadow(0 0 16px rgba(99,102,241,0.2))',
          }}
        />
      </div>
    </button>
  );
}
