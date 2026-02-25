/**
 * HeroExperience
 * Full-width featured experience card that rotates daily.
 * Mini canvas preview loaded via dynamic import (ssr: false).
 */

'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { EXPERIENCES, EXPERIENCE_HERO_ORDER } from '@/lib/toolsData';
import { getDayOfYear } from '@/lib/dateUtils';

// Module-scope map for dynamic imports (Next.js dynamic() requirement)
const CANVAS_MAP = {
  grounding: dynamic(() => import('@/components/composed/experiences/mini/MiniGroundingCanvas'), { ssr: false }),
  mandala: dynamic(() => import('@/components/composed/experiences/mini/MiniMandalaCanvas'), { ssr: false }),
  pulse: dynamic(() => import('@/components/composed/experiences/mini/MiniPulseCanvas'), { ssr: false }),
  impermanence: dynamic(() => import('@/components/composed/experiences/mini/MiniSoundCanvas'), { ssr: false }),
};

export default function HeroExperience() {
  const router = useRouter();

  const heroExp = useMemo(() => {
    const heroId = EXPERIENCE_HERO_ORDER[getDayOfYear() % EXPERIENCE_HERO_ORDER.length];
    return EXPERIENCES.find((e) => e.id === heroId);
  }, []);

  if (!heroExp) return null;

  const Canvas = CANVAS_MAP[heroExp.id];

  return (
    <Card
      onClick={() => router.push(heroExp.route)}
      solfeggio="violet"
      padding="p-5"
    >
      <div className="flex items-center gap-4">
        {Canvas && <Canvas size={160} />}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-violet-300/70 font-light mb-1 tracking-wide uppercase">
            Today's Experience
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
