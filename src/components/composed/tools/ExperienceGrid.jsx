/**
 * ExperienceGrid
 * 2x2 CSS grid of experience cards, excluding today's hero.
 * Mini canvases loaded via dynamic import (ssr: false).
 */

'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { EXPERIENCES, EXPERIENCE_HERO_ORDER } from '@/lib/toolsData';
import { getDayOfYear } from '@/lib/dateUtils';

// Module-scope map for dynamic imports
const CANVAS_MAP = {
  grounding: dynamic(() => import('@/components/composed/experiences/mini/MiniGroundingCanvas'), { ssr: false }),
  mandala: dynamic(() => import('@/components/composed/experiences/mini/MiniMandalaCanvas'), { ssr: false }),
  pulse: dynamic(() => import('@/components/composed/experiences/mini/MiniPulseCanvas'), { ssr: false }),
  impermanence: dynamic(() => import('@/components/composed/experiences/mini/MiniSoundCanvas'), { ssr: false }),
};

export default function ExperienceGrid() {
  const router = useRouter();

  const remaining = useMemo(() => {
    const heroId = EXPERIENCE_HERO_ORDER[getDayOfYear() % EXPERIENCE_HERO_ORDER.length];
    return EXPERIENCES.filter((e) => e.id !== heroId);
  }, []);

  return (
    <section>
      <h2
        className="text-lg text-white"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, marginBottom: 10 }}
      >
        Experiences
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {remaining.map((exp) => {
          const Canvas = CANVAS_MAP[exp.id];
          return (
            <Card
              key={exp.id}
              onClick={() => router.push(exp.route)}
              solfeggio="violet"
              padding="p-3"
            >
              <div className="flex flex-col items-center text-center">
                {Canvas && <Canvas size={120} />}
                <h3
                  className="text-white text-sm mt-2 mb-0.5"
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  {exp.title}
                </h3>
                <p className="text-xs text-slate-300 font-light mb-1 line-clamp-2">
                  {exp.description}
                </p>
                <span className="text-xs text-slate-400 flex items-center" style={{ gap: 6 }}>
                  <Clock className="w-3 h-3" />
                  {exp.duration}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
