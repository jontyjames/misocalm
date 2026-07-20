import { HeartPulse, Shield, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui';
import { PHI_SCALE } from '@/lib/constants';
import ToolkitPracticePill from './ToolkitPracticePill';

const PATH_ICONS = {
  triggered_now: HeartPulse,
  ground_process: Shield,
  build_capacity: Sparkles,
};

export default function ToolkitPathCard({ path, onOpen }) {
  const Icon = PATH_ICONS[path.id] || Sparkles;

  return (
    <Card solfeggio={path.solfeggio} padding="p-4">
      <div className="flex flex-col" style={{ gap: PHI_SCALE[2] }}>
        <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-cyan-300">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2
              className="text-lg text-white"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              {path.title}
            </h2>
            <p className="mt-1 text-sm font-light leading-relaxed text-slate-300">
              {path.description}
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          {path.practices.map((practice) => (
            <ToolkitPracticePill key={practice.id} practice={practice} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </Card>
  );
}
