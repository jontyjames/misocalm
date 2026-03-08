/**
 * EducationSection
 * "Learn" section on the Practices page.
 * Horizontal scroll row of 3 cards (prime) at 157px width.
 */

'use client';

import { useLocalStorage } from '@/hooks';
import { PHI_SCALE, STORAGE_KEYS } from '@/lib/constants';
import { EDUCATION_MODULES, VOICE_KEYS } from '@/lib/educationData';
import EducationCard from './EducationCard';

export default function EducationSection() {
  const [visits] = useLocalStorage(STORAGE_KEYS.EDUCATION_VISITS, {});

  const getVoicesRead = (slug) => {
    const modVisits = visits?.[slug] || {};
    return VOICE_KEYS.filter((k) => (modVisits[k] || 0) > 0).length;
  };

  return (
    <section>
      <h2
        className="text-lg text-white"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          marginBottom: PHI_SCALE[1],
          textShadow: '0 0 16px rgba(0,255,65,0.2)',
        }}
      >
        Learn
      </h2>
      <div
        className="flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-[6px]"
        style={{ gap: PHI_SCALE[1] }}
      >
        {EDUCATION_MODULES.map((mod, i) => {
          const voicesRead = getVoicesRead(mod.slug);
          return (
            <EducationCard
              key={mod.slug}
              mod={mod}
              voicesRead={voicesRead}
              isComplete={voicesRead === 3}
              index={i}
            />
          );
        })}
      </div>
    </section>
  );
}
