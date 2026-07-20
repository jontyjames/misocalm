import { PHI_SCALE } from '@/lib/constants';
import { COLD_WATER_SAFETY_CHECKS } from './practicePanelData';

export default function ColdWaterSafetyChecks({ checked, onToggle }) {
  return (
    <div className="grid gap-2">
      {COLD_WATER_SAFETY_CHECKS.map((item) => {
        const selected = checked.includes(item);

        return (
          <button
            key={item}
            type="button"
            aria-pressed={selected}
            onClick={() => onToggle(item)}
            className="flex min-h-[44px] items-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-left text-sm text-slate-200 transition-all duration-[233ms] hover:border-white/[0.16]"
            style={{ gap: PHI_SCALE[1] }}
          >
            <span className={`h-4 w-4 rounded border ${selected ? 'border-cyan-300 bg-cyan-300' : 'border-slate-500'}`} />
            {item}
          </button>
        );
      })}
    </div>
  );
}
