/**
 * MisoCalm Slider Component
 * Cosmic Serenity theme - gradient range slider
 */

'use client';

export default function Slider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  showValue = true,
  leftLabel,
  rightLabel,
  className = '',
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-sm font-light text-slate-300">{label}</label>
          )}
          {showValue && (
            <span className="text-3xl text-white" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>{value}</span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="
            w-full h-2 rounded-full appearance-none cursor-pointer
            bg-slate-800
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-indigo-400
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-indigo-400
            [&::-moz-range-thumb]:cursor-pointer
          "
          style={{
            background: `linear-gradient(to right,
              #6366f1 0%,
              #a855f7 ${percentage / 2}%,
              #22d3ee ${percentage}%,
              #1e293b ${percentage}%,
              #1e293b 100%
            )`,
          }}
        />
      </div>

      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-slate-300 font-light">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
