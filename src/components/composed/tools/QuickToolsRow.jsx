/**
 * QuickToolsRow
 * Horizontal scroll row of active tools.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Activity, Anchor, Clock, Feather, Hand, Moon, Orbit } from 'lucide-react';
import { Card, ScrollRow, SectionHeading } from '@/components/ui';
import { PHI_SCALE, ROUTES } from '@/lib/constants';
import { TOOLS } from '@/lib/toolsData';

const activeTools = TOOLS.filter((tool) => (
  tool.type === 'practice' || tool.type === 'timer' || tool.type === 'regulation'
));

const TOOL_ICONS = {
  '1': { icon: Moon, color: 'text-indigo-400', glow: 'rgba(99,102,241,0.25)' },
  '2': { icon: Activity, color: 'text-cyan-400', glow: 'rgba(34,211,238,0.2)' },
  '3': { icon: Anchor, color: 'text-cyan-400', glow: 'rgba(34,211,238,0.2)' },
  '4': { icon: Feather, color: 'text-violet-400', glow: 'rgba(139,92,246,0.25)' },
  '5': { icon: Orbit, color: 'text-cyan-400', glow: 'rgba(34,211,238,0.2)' },
  '6': { icon: Hand, color: 'text-violet-400', glow: 'rgba(139,92,246,0.25)' },
};

const TOOL_SOLFEGGIO = {
  '1': 'indigo',
  '2': 'cyan',
  '3': 'cyan',
  '4': 'violet',
  '5': 'cyan',
  '6': 'violet',
};

export default function QuickToolsRow() {
  const router = useRouter();

  return (
    <section>
      <SectionHeading glowColor="rgba(99,102,241,0.3)">Tools</SectionHeading>
      <ScrollRow>
        {activeTools.map((tool) => {
          const toolIcon = TOOL_ICONS[tool.id];
          const Icon = toolIcon?.icon;
          const iconColor = toolIcon?.color || 'text-slate-400';
          const iconGlow = toolIcon?.glow || 'transparent';

          return (
            <div key={tool.id} className="shrink-0" style={{ width: 137 }}>
              <Card
                onClick={() => router.push(tool.route || `${ROUTES.TOOLS}/${tool.id}`)}
                padding="p-3"
                solfeggio={TOOL_SOLFEGGIO[tool.id] || 'indigo'}
              >
                <div className="flex flex-col">
                  <div
                    className="flex items-center"
                    style={{ gap: PHI_SCALE[1], marginBottom: PHI_SCALE[0] }}
                  >
                    {Icon && (
                      <div
                        className={`flex items-center justify-center shrink-0 rounded-lg border border-white/[0.12] ${iconColor}`}
                        style={{
                          width: PHI_SCALE[3],
                          height: PHI_SCALE[3],
                          background: `radial-gradient(circle at center, ${iconGlow}, rgba(255,255,255,0.04))`,
                          boxShadow: `0 0 ${PHI_SCALE[1]}px ${iconGlow}`,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    )}
                    <span
                      className="text-xs text-slate-400 flex items-center"
                      style={{ gap: PHI_SCALE[0] }}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      ~{tool.duration_minutes} min
                    </span>
                  </div>

                  <h3
                    className="text-white text-sm truncate w-full"
                    style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontWeight: 300,
                      marginBottom: PHI_SCALE[0],
                    }}
                  >
                    {tool.title}
                  </h3>

                  <p
                    className="text-xs text-slate-300 font-light leading-relaxed overflow-hidden"
                    style={{ height: PHI_SCALE[5] }}
                  >
                    {tool.description}
                  </p>
                </div>
              </Card>
            </div>
          );
        })}
      </ScrollRow>
    </section>
  );
}
