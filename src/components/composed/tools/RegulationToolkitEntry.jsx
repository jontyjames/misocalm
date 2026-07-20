'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, HeartPulse } from 'lucide-react';
import { Card } from '@/components/ui';
import { PHI_SCALE, ROUTES } from '@/lib/constants';

export default function RegulationToolkitEntry() {
  const router = useRouter();

  return (
    <Card onClick={() => router.push(ROUTES.REGULATION_TOOLKIT)} solfeggio="cyan" padding="p-4">
      <div className="flex items-center" style={{ gap: PHI_SCALE[3] }}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2
            className="text-lg text-white"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Regulation Toolkit
          </h2>
          <p className="mt-1 text-sm font-light leading-relaxed text-slate-300">
            Fast resets, body practices, movement, sound support, and emergency care.
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
      </div>
    </Card>
  );
}
