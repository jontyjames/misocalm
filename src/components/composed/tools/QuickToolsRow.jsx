/**
 * QuickToolsRow
 * Horizontal scroll row of breathwork tools + Interval Timer.
 * Filter: tool.type === 'practice' || tool.type === 'timer' (excludes coming_soon).
 *
 * Sacred geometry: phi spacing (6/10/16/26/42px), Fibonacci timing (233ms),
 * solfeggio icon glows (indigo=528Hz, cyan=741Hz, violet=852Hz).
 * Card width tuned so ~1.5 cards visible on 375px screen (scroll hint).
 */

'use client';

import { useRouter } from 'next/navigation';
import { Star, Clock, Moon, Anchor, Feather, Orbit } from 'lucide-react';
import { Card } from '@/components/ui';
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

export default function QuickToolsRow({ favoriteTools = [], onToggleFavorite }) {
  const router = useRouter();

  return (
    <section>
      <h2
        className="text-lg text-white"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          marginBottom: PHI_SCALE[1], /* phi-2 (10px) */
        }}
      >
        Tools
      </h2>
      {/* gap: phi-2 (10px), horizontal padding matches page px-6 */}
      <div
        className="flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-[6px]"
        style={{ gap: PHI_SCALE[1] }} /* phi-2 (10px) */
      >
        {activeTools.map((tool) => {
          const isFav = favoriteTools.includes(tool.id);
          const toolIcon = TOOL_ICONS[tool.id];
          const Icon = toolIcon?.icon;
          const iconColor = toolIcon?.color || 'text-slate-400';
          const iconGlow = toolIcon?.glow || 'transparent';

          return (
            <Card
              key={tool.id}
              onClick={() => router.push(`${ROUTES.TOOLS}/${tool.id}`)}
              padding="p-4" /* phi-3 (16px) */
              className="shrink-0"
            >
              {/* Content width: 180px so card total ~212px, showing ~1.5 on 375px */}
              <div style={{ width: 180 }}>
                {/* Header: icon + star */}
                <div
                  className="flex items-start justify-between"
                  style={{ marginBottom: PHI_SCALE[1] }} /* phi-2 (10px) */
                >
                  {Icon && (
                    <div
                      className={`flex items-center justify-center rounded-xl border border-white/[0.12] ${iconColor}`}
                      style={{
                        width: PHI_SCALE[4],  /* phi-5 (42px) */
                        height: PHI_SCALE[4], /* phi-5 (42px) */
                        background: `radial-gradient(circle at center, ${iconGlow}, rgba(255,255,255,0.04))`,
                        boxShadow: `0 0 ${PHI_SCALE[2]}px ${iconGlow}`, /* phi-3 (16px) spread, solfeggio glow */
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(tool.id);
                    }}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    className={`p-1.5 -mr-1 -mt-1 shrink-0 min-w-[42px] min-h-[42px] flex items-center justify-center transition-colors duration-[233ms] ${
                      isFav ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Title */}
                <h3
                  className="text-white font-light text-sm truncate"
                  style={{ marginBottom: PHI_SCALE[0] }} /* phi-1 (6px) */
                >
                  {tool.title}
                </h3>

                {/* Description */}
                <p
                  className="text-xs text-slate-300 font-light line-clamp-2"
                  style={{ marginBottom: PHI_SCALE[1] }} /* phi-2 (10px) */
                >
                  {tool.description}
                </p>

                {/* Duration */}
                <span
                  className="text-xs text-slate-400 flex items-center"
                  style={{ gap: PHI_SCALE[0] }} /* phi-1 (6px) */
                >
                  <Clock className="w-3 h-3" />
                  ~{tool.duration_minutes} min
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
