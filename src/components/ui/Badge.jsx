/**
 * MisoMind Badge Component
 * Cosmic Serenity theme - colored tags/badges
 */

const colors = {
  indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  slate: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[9px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export default function Badge({
  children,
  color = 'indigo',
  size = 'md',
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-light
        ${colors[color]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
