/**
 * QuickToolsRow
 * Horizontal scroll row of breathwork tools + Interval Timer.
 * Filter: tool.type === 'practice' || tool.type === 'timer' (excludes coming_soon).
 *
 * Sacred geometry: phi spacing (6/10/16/26/42px), Fibonacci timing (233ms),
 * solfeggio icon glows (indigo=528Hz, cyan=741Hz, violet=852Hz).
 * Card wrapper: 137px (prime), showing ~2 full cards + 32px peek on 375px screen.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Clock, Moon, Anchor, Feather, Orbit } from 'lucide-react';
import { Card, ScrollRow, SectionHeading } from '@/components/ui';
import { ROUTES, PHI_SCALE } from '@/lib/constants';
import { TOOLS } from '@/lib/toolsData';

const activeTools = TOOLS.filter((t) => t.type === 'practice' || t.type === 'timer');

// Each tool gets a symbol that reflects what the practice FEELS like,
// not what it's technically called. Chosen for nervous system safety:
// a dysregulated person should see warmth, not clinical geometry.
// Glow colours match solfeggio frequency: indigo=528Hz (transformation),
// cyan=741Hz (clarity/expression), violet=852Hz (intuition/depth)
const TOOL_ICONS = {
  '1': { icon: Moon,     color: 'text-indigo-400', glow: 'rgba(99,102,241,0.25)' },  // Moon — lunar, sleep, the body winding down
  '3': { icon: Anchor,   color: 'text-cyan-400',   glow: 'rgba(34,211,238,0.2)' },   // Anchor — steady, grounded, "you are here and here is safe"
  '4': { icon: Feather,  color: 'text-violet-400',  glow: 'rgba(139,92,246,0.25)' },  // Feather — a gentle release, drifting down on the exhale
  '5': { icon: Orbit,    color: 'text-cyan-400',   glow: 'rgba(34,211,238,0.2)' },   // Orbit — cycles of sacred timing, planetary rhythm, no auditory connotation
};

// Solfeggio colour per tool — drives Card's solfeggio prop for full Sacred Glass colour
const TOOL_SOLFEGGIO = {
  '1': 'indigo',  // 4-7-8 Breathing — transformation
  '3': 'cyan',    // Box Breathing — clarity/grounding
  '4': 'violet',  // Physiological Sigh — intuition/release
  '5': 'cyan',    // Interval Timer — clarity/expression
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
                onClick={() => router.push(`${ROUTES.TOOLS}/${tool.id}`)}
                padding="p-3"
                solfeggio={TOOL_SOLFEGGIO[tool.id] || 'indigo'}
              >
                <div className="flex flex-col">
                  {/* Icon + duration row */}
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

                  {/* Title */}
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

                  {/* Description — triage text for dysregulated users */}
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
