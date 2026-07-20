import { Check } from 'lucide-react';
import { PHI_SCALE } from '@/lib/constants';

export default function PracticeStepList({ steps, activeIndex }) {
  return (
    <div className="flex flex-col" style={{ gap: PHI_SCALE[1] }}>
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;

        return (
          <div
            key={step}
            className={`rounded-xl border px-4 py-3 transition-all duration-[233ms] ${
              isActive
                ? 'border-cyan-300/40 bg-cyan-300/[0.08] text-white'
                : isDone
                  ? 'border-white/[0.08] bg-white/[0.04] text-slate-300'
                  : 'border-white/[0.06] bg-white/[0.02] text-slate-500'
            }`}
          >
            <div className="flex items-start" style={{ gap: PHI_SCALE[1] }}>
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.12] text-[11px]">
                {isDone ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <span className="text-sm font-light leading-relaxed">{step}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
