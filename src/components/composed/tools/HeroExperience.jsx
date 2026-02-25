/**
 * HeroExperience
 * Full-width featured experience card that rotates daily.
 * Mini canvas preview loaded via dynamic import (ssr: false).
 * Solfeggio colour driven by experience identity.
 */

'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { EXPERIENCES, EXPERIENCE_HERO_ORDER, EXPERIENCE_SOLFEGGIO } from '@/lib/toolsData';
import { getDayOfYear } from '@/lib/dateUtils';
import CANVAS_MAP from '@/components/composed/experiences/mini/canvasMap';

// Label text colour matched to solfeggio frequency
const EXPERIENCE_LABEL_COLORS = {
  grounding: 'text-cyan-300/70',
  mandala: 'text-violet-300/70',
  pulse: 'text-indigo-300/70',
  impermanence: 'text-violet-300/70',
};

export default function HeroExperience() {
  const router = useRouter();

  const heroExp = useMemo(() => {
    const heroId = EXPERIENCE_HERO_ORDER[getDayOfYear() % EXPERIENCE_HERO_ORDER.length];
    return EXPERIENCES.find((e) => e.id === heroId);
  }, []);

  if (!heroExp) return null;

  const Canvas = CANVAS_MAP[heroExp.id];
  const solfeggio = EXPERIENCE_SOLFEGGIO[heroExp.id] || 'violet';
  const labelColor = EXPERIENCE_LABEL_COLORS[heroExp.id] || 'text-violet-300/70';

  return (
    <Card
      onClick={() => router.push(heroExp.route)}
      solfeggio={solfeggio}
      padding="p-5"
    >
      <div className="flex items-center gap-4">
        {Canvas && <Canvas size={160} />}
        <div className="flex-1 min-w-0">
          <p className={`text-xs ${labelColor} font-light mb-1 tracking-wide uppercase`}>
            Today&apos;s Experience
          </p>
          <h2
            className="text-lg text-white mb-1"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            {heroExp.title}
          </h2>
          <p className="text-sm text-slate-300 font-light mb-2">
            {heroExp.description}
          </p>
          <span className="text-xs text-slate-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {heroExp.duration}
          </span>
        </div>
      </div>
    </Card>
  );
}
