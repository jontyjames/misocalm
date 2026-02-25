/**
 * ComingSoonSection
 * Vertical list of coming_soon tools with lock icon and dimmed styling.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Lock, Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { TOOLS } from '@/lib/toolsData';

const comingSoonTools = TOOLS.filter((t) => t.type === 'coming_soon');

export default function ComingSoonSection() {
  const router = useRouter();

  if (comingSoonTools.length === 0) return null;

  return (
    <section>
      <h2
        className="text-lg text-white"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, marginBottom: 10 }}
      >
        Coming Soon
      </h2>
      <div className="space-y-3">
        {comingSoonTools.map((tool) => (
          <Card
            key={tool.id}
            onClick={() => router.push(ROUTES.PREMIUM)}
            className="opacity-60"
            padding="p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-slate-300 font-light text-sm">{tool.title}</h3>
                  <span
                    className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-light text-violet-300 border border-violet-500/20"
                    style={{ background: 'rgba(139,92,246,0.1)' }}
                  >
                    soon
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-light mb-1">{tool.description}</p>
                <span className="text-xs text-slate-400 flex items-center" style={{ gap: 6 }}>
                  <Clock className="w-3 h-3" />
                  ~{tool.duration_minutes} min
                </span>
              </div>
              <Lock className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
