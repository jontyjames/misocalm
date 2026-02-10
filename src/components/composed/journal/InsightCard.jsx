/**
 * InsightCard - Single insight display
 * Coloured dot for gentle variety, card stays neutral
 */

const DOT_COLORS = {
  indigo: 'bg-indigo-400',
  cyan: 'bg-cyan-500/70',
  violet: 'bg-violet-400',
};

export default function InsightCard({ insight }) {
  const dot = DOT_COLORS[insight.accent] || DOT_COLORS.indigo;

  return (
    <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/40">
      <div className="flex items-start gap-3">
        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dot}`} />
        <p className="text-sm font-light text-slate-200">
          {insight.message}
        </p>
      </div>
    </div>
  );
}
