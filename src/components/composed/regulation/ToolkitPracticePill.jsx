import { ArrowRight } from 'lucide-react';
import { PHI_SCALE } from '@/lib/constants';
import { REGULATION_FORMAT_LABELS } from '@/lib/regulationToolkitData';

export default function ToolkitPracticePill({ practice, onOpen }) {
  return (
    <button
      onClick={() => onOpen(practice.route)}
      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left transition-colors duration-[144ms] hover:border-white/[0.18] hover:bg-white/[0.06]"
    >
      <div className="flex items-center justify-between" style={{ gap: PHI_SCALE[2] }}>
        <div className="min-w-0">
          <p className="truncate text-sm text-white">{practice.title}</p>
          <p className="mt-1 text-xs font-light text-slate-400">
            {REGULATION_FORMAT_LABELS[practice.format]} / {practice.durationLabel}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </button>
  );
}
