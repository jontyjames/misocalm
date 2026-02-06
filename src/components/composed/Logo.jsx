/**
 * MisoMind Logo Component
 * Uses the star/waves logo image with glow effect
 */

export default function Logo({ size = 'md', showText = false }) {
  const sizes = {
    sm: { img: 'w-8 h-8', text: 'text-lg', glow: 'drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]' },
    md: { img: 'w-12 h-12', text: 'text-2xl', glow: 'drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]' },
    lg: { img: 'w-20 h-20', text: 'text-3xl', glow: 'drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]' },
    xl: { img: 'w-44 h-44', text: 'text-4xl', glow: 'drop-shadow-[0_0_50px_rgba(99,102,241,0.4)] drop-shadow-[0_0_100px_rgba(34,211,238,0.2)]' },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <img
        src="/icons/MisoMind-logo-v1.png"
        alt="MisoMind"
        className={`${s.img} ${s.glow} brightness-110`}
      />

      {showText && (
        <span
          className={`${s.text} tracking-wide text-white`}
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
        >
          MisoMind
        </span>
      )}
    </div>
  );
}
