/**
 * TriggerChips - Reusable pill-chip selector
 * Matches the onboarding trigger selection style
 * Used for triggers, body responses, time-of-day, and source selection
 */

export default function TriggerChips({
  items,
  selected,
  onToggle,
  multiSelect = true,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap justify-center gap-[10px] ${className}`}>
      {items.map((item) => {
        const label = typeof item === 'string' ? item : item.label;
        const value = typeof item === 'string' ? item : item.value;
        const isSelected = multiSelect
          ? selected.includes(value)
          : selected === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onToggle(value)}
            className={`
              px-4 py-2.5 rounded-full text-sm font-light
              border transition-all duration-[233ms]
              ${isSelected
                ? 'bg-indigo-500/30 border-indigo-400/50 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-600'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
