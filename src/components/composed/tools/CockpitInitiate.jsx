/**
 * CockpitInitiate — Session summary + energy-scaled initiate button
 * Glow intensity grows with session energy (duration x rounds + grace bonus)
 */

'use client';

export default function CockpitInitiate({ duration, reminder, rounds, onInitiate }) {
  const energy = duration * rounds + (reminder > 0 ? reminder * 5 : 0);
  const glowIntensity = Math.min(1, energy / 150);

  const bgAlpha = (0.15 + glowIntensity * 0.1).toFixed(3);
  const borderAlpha = (0.3 + glowIntensity * 0.3).toFixed(3);
  const outerBlur = (20 + glowIntensity * 22).toFixed(1);
  const outerAlpha = (0.15 + glowIntensity * 0.2).toFixed(3);
  const innerBlur = (10 + glowIntensity * 10).toFixed(1);
  const innerAlpha = (0.05 + glowIntensity * 0.1).toFixed(3);

  return (
    <div className="pb-6">
      {/* Session summary */}
      <p className="text-sm text-slate-300 font-light text-center mb-4">
        {duration} min{rounds > 1 ? ` x ${rounds} rounds` : ''}
        {reminder > 0 ? ` + ${reminder} min grace` : ''}
      </p>

      {/* Initiate button */}
      <button
        onClick={onInitiate}
        className="w-full rounded-full py-3 text-white font-light transition-all duration-[233ms] active:scale-[0.97]"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          fontSize: '1.125rem',
          background: `rgba(99,102,241, ${bgAlpha})`,
          border: `1px solid rgba(99,102,241, ${borderAlpha})`,
          boxShadow: `0 0 ${outerBlur}px rgba(99,102,241, ${outerAlpha}), inset 0 0 ${innerBlur}px rgba(99,102,241, ${innerAlpha})`,
        }}
      >
        Initiate
      </button>
    </div>
  );
}
