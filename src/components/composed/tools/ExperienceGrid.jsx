/**
 * ExperienceGrid
 * Horizontal scroll row of experience cards, excluding today's hero.
 * Mini canvases loaded via shared canvasMap (dynamic import, ssr: false).
 *
 * Card wrapper: 157px (prime), matching original 2x2 grid card width.
 * Canvas: 120px (practical fit within card).
 */

'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { PHI_SCALE } from '@/lib/constants';
import { EXPERIENCES, EXPERIENCE_HERO_ORDER, EXPERIENCE_SOLFEGGIO } from '@/lib/toolsData';
import { getDayOfYear } from '@/lib/dateUtils';
import CANVAS_MAP from '@/components/composed/experiences/mini/canvasMap';

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
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          marginBottom: PHI_SCALE[1], /* phi-2 (10px) */
          textShadow: '0 0 16px rgba(139,92,246,0.3)',
        }}
      >
        Experiences
      </h2>
      <div
        className="flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-[6px]"
        style={{ gap: PHI_SCALE[1], overscrollBehaviorX: 'contain', touchAction: 'pan-x' }}
      >
        {remaining.map((exp) => {
          const Canvas = CANVAS_MAP[exp.id];
          return (
            <div key={exp.id} className="shrink-0" style={{ width: 157 }}>
            <Card
              onClick={() => router.push(exp.route)}
              solfeggio={EXPERIENCE_SOLFEGGIO[exp.id] || 'violet'}
              padding="p-3"
            >
              <div className="flex flex-col items-center text-center">
                {Canvas && <Canvas size={120} />}
                <h3
                  className="text-white text-sm truncate w-full"
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 300,
                    marginTop: PHI_SCALE[0],  /* phi-1 (6px) */
                    marginBottom: PHI_SCALE[0], /* phi-1 (6px) */
                  }}
                >
                  {exp.title}
                </h3>
                <p
                  className="text-xs text-slate-300 font-light line-clamp-2"
                  style={{ marginBottom: PHI_SCALE[0] }} /* phi-1 (6px) */
                >
                  {exp.description}
                </p>
                <span
                  className="text-xs text-slate-400 flex items-center justify-center"
                  style={{ gap: PHI_SCALE[0] }} /* phi-1 (6px) */
                >
                  <Clock className="w-3 h-3" />
                  {exp.duration}
                </span>
              </div>
            </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
