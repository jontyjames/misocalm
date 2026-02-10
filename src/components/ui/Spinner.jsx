/**
 * Neon Ring Spinner
 * Cyan-violet rotating ring with glow
 */

const sizes = {
  sm: 24,
  md: 32,
  lg: 44,
  xl: 56,
};

export default function Spinner({ size = 'md' }) {
  const s = sizes[size] || sizes.md;
  const strokeWidth = s < 32 ? 2.5 : 3;
  const r = (s - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className="relative"
      style={{ width: s, height: s }}
    >
      {/* Glow layer */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        className="relative"
        style={{ animation: 'spin 1.6s linear infinite' }}
      >
        <defs>
          <linearGradient id={`neon-ring-${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.9)" />
            <stop offset="50%" stopColor="rgba(139,92,246,0.9)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.1)" />
          </linearGradient>
        </defs>
        {/* Faint track */}
        <circle
          cx={s / 2}
          cy={s / 2}
          r={r}
          fill="none"
          stroke="rgba(148,163,184,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Neon arc */}
        <circle
          cx={s / 2}
          cy={s / 2}
          r={r}
          fill="none"
          stroke={`url(#neon-ring-${s})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.65} ${circumference * 0.35}`}
        />
      </svg>
    </div>
  );
}
