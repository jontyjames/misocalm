import { PHI_SCALE } from '@/lib/constants';
import { EMERGENCY_PROTOCOL_STEPS } from './practicePanelData';

export default function EmergencyStepCard({ activeIndex, onSelect }) {
  const activeStep = EMERGENCY_PROTOCOL_STEPS[activeIndex];

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
      <div className="flex items-start justify-between" style={{ gap: PHI_SCALE[2] }}>
        <div>
          <p className="text-sm text-white">{activeStep.title}</p>
          <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">{activeStep.cue}</p>
        </div>
        <span className="shrink-0 text-xs font-light text-slate-500">
          {activeIndex + 1}/{EMERGENCY_PROTOCOL_STEPS.length}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-5" style={{ gap: PHI_SCALE[1] }}>
        {EMERGENCY_PROTOCOL_STEPS.map((step, index) => (
          <button
            key={step.title}
            type="button"
            aria-label={`Go to ${step.title}`}
            onClick={() => onSelect(index)}
            className={`h-2 rounded-full transition-all duration-[233ms] ${
              index <= activeIndex ? 'bg-slate-200' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
