/**
 * EducationSection
 * "Learn" section on the Practices page.
 * Horizontal scroll row of 3 cards (prime) at 157px width.
 */

'use client';

import { useLocalStorage } from '@/hooks';
import { STORAGE_KEYS } from '@/lib/constants';
import { EDUCATION_MODULES, VOICE_KEYS } from '@/lib/educationData';
import { ScrollRow, SectionHeading } from '@/components/ui';
import EducationCard from './EducationCard';

export default function EducationSection() {
  const [visits] = useLocalStorage(STORAGE_KEYS.EDUCATION_VISITS, {});

  const getVoicesRead = (slug) => {
    const modVisits = visits?.[slug] || {};
    return VOICE_KEYS.filter((k) => (modVisits[k] || 0) > 0).length;
  };

  return (
    <section>
      <SectionHeading glowColor="rgba(0,255,65,0.2)">Learn</SectionHeading>
      <ScrollRow>
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
      </ScrollRow>
    </section>
  );
}
