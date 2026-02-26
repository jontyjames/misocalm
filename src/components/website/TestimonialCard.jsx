/**
 * TestimonialCard — Quote card with sacred glass styling.
 * Renders a testimonial with attribution.
 */

export default function TestimonialCard({ quote, attribution }) {
  return (
    <div
      className="relative rounded-xl p-6 overflow-hidden border border-white/[0.12] h-full"
      style={{
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, rgba(139,92,246,0.04) 100%)',
        boxShadow:
          'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.2)',
      }}
    >
      {/* Glass top highlight (dimmed for testimonial) */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)' }}
      />
      <div className="relative">
        <p className="text-slate-200 font-light leading-relaxed text-sm italic mb-4">
          &ldquo;{quote}&rdquo;
        </p>
        <p className="text-xs text-slate-400 font-light">
          {attribution}
        </p>
      </div>
    </div>
  );
}
