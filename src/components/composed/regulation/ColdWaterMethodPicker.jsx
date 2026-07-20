import { COLD_WATER_METHODS } from './practicePanelData';

export default function ColdWaterMethodPicker({ selectedMethodId, onSelect }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {COLD_WATER_METHODS.map((method) => {
        const Icon = method.icon;
        const selected = method.id === selectedMethodId;

        return (
          <button
            key={method.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(method.id)}
            className={`min-h-[110px] rounded-xl border p-3 text-left transition-all duration-[233ms] ${
              selected
                ? 'border-slate-200/50 bg-white/[0.08] text-white'
                : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/[0.16]'
            }`}
          >
            <Icon className="h-4 w-4 text-slate-200" />
            <p className="mt-3 text-sm">{method.title}</p>
            <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">{method.description}</p>
          </button>
        );
      })}
    </div>
  );
}
