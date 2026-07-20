import { Card } from '@/components/ui';
import { PHI_SCALE } from '@/lib/constants';
import { getPracticesByFamily } from '@/lib/regulationToolkitData';
import ToolkitPracticePill from './ToolkitPracticePill';

export default function ToolkitFamilySection({ family, onOpen }) {
  const practices = getPracticesByFamily(family.id);
  if (practices.length === 0) return null;

  return (
    <Card solfeggio={family.id === 'sound' ? 'indigo' : 'cyan'} padding="p-4">
      <div className="flex flex-col" style={{ gap: PHI_SCALE[2] }}>
        <div>
          <h2
            className="text-lg text-white"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            {family.label}
          </h2>
          <p className="mt-1 text-sm font-light leading-relaxed text-slate-300">
            {family.description}
          </p>
        </div>
        <div className="grid gap-2">
          {practices.map((practice) => (
            <ToolkitPracticePill key={practice.id} practice={practice} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </Card>
  );
}
