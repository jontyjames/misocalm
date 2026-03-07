/**
 * EducationSection
 * "Understand" section on the Practices page.
 * Horizontal scroll row of 3 cards (prime) at 157px width.
 * Darker terminal aesthetic with faint green cursor hint.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { useLocalStorage } from '@/hooks';
import { PHI_SCALE, STORAGE_KEYS } from '@/lib/constants';
import { EDUCATION_MODULES, VOICE_KEYS } from '@/lib/educationData';

export default function EducationSection() {
  const router = useRouter();
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
          marginBottom: PHI_SCALE[1], /* phi-2 (10px) */
          textShadow: '0 0 16px rgba(0,255,65,0.2)',
        }}
      >
        Understand
      </h2>
      <div
        className="flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-[6px]"
        style={{ gap: PHI_SCALE[1] }} /* phi-2 (10px) */
      >
        {EDUCATION_MODULES.map((mod) => {
          const voicesRead = getVoicesRead(mod.slug);
          const isComplete = voicesRead === 3;
          return (
          <div key={mod.slug} className="shrink-0" style={{ width: 157 }}>
            <button
              onClick={() => router.push(`/tools/education/${mod.slug}`)}
              className="w-full text-left rounded-xl p-3 relative overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(0,255,65,0.04) 0%, rgba(3,7,18,0.9) 100%)',
                border: `1px solid ${isComplete ? 'rgba(0,255,65,0.25)' : 'rgba(0,255,65,0.1)'}`,
                boxShadow: isComplete
                  ? '0 0 16px rgba(0,255,65,0.12), 0 4px 20px rgba(0,0,0,0.3)'
                  : '0 0 12px rgba(0,255,65,0.04), 0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {/* Terminal cursor hint */}
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontWeight: 300,
                  fontSize: 20,
                  color: 'rgba(0,255,65,0.4)',
                  lineHeight: 1,
                  marginBottom: PHI_SCALE[0], /* phi-1 (6px) */
                }}
              >
                &gt;_
              </div>

              <h3
                className="text-white text-sm truncate w-full"
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 300,
                  marginBottom: PHI_SCALE[0], /* phi-1 (6px) */
                }}
              >
                {mod.title}
              </h3>
              <p
                className="text-xs font-light line-clamp-2"
                style={{
                  color: 'rgba(0,255,65,0.5)',
                  marginBottom: PHI_SCALE[0], /* phi-1 (6px) */
                }}
              >
                {mod.description}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs flex items-center"
                  style={{
                    color: 'rgba(0,255,65,0.35)',
                    gap: PHI_SCALE[0], /* phi-1 (6px) */
                  }}
                >
                  <Clock className="w-3 h-3" />
                  {mod.duration}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontWeight: 300,
                    fontSize: 10,
                    color: isComplete ? '#00ff41' : 'rgba(0,255,65,0.3)',
                    textShadow: isComplete ? '0 0 10px rgba(0,255,65,0.4)' : 'none',
                  }}
                >
                  {voicesRead}/3
                </span>
              </div>
            </button>
          </div>
          );
        })}
      </div>
    </section>
  );
}
