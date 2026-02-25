/**
 * QuickToolsRow
 * Horizontal scroll row of breathwork tools + Interval Timer.
 * Filter: tool.type === 'practice' || tool.type === 'timer' (excludes coming_soon).
 */

'use client';

import { useRouter } from 'next/navigation';
import { Star, Clock, Moon, Square, Zap, Timer } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { ROUTES, TOOL_CATEGORIES } from '@/lib/constants';
import { TOOLS } from '@/lib/toolsData';

const activeTOOLS = TOOLS.filter((t) => t.type === 'practice' || t.type === 'timer');

// Each tool gets a symbol that reflects its character
const TOOL_ICONS = {
  '1': { icon: Moon, color: 'text-indigo-400' },    // 4-7-8: slow, lunar, before sleep
  '3': { icon: Square, color: 'text-cyan-400' },     // Box: structured, four equal sides
  '4': { icon: Zap, color: 'text-violet-400' },      // Sigh: quick, electric, in the moment
  '5': { icon: Timer, color: 'text-cyan-400' },      // Interval Timer: time-based
};

function getCategoryColor(category) {
  const cat = TOOL_CATEGORIES.find((c) => c.value === category);
  return cat?.color || 'slate';
}

export default function QuickToolsRow({ favoriteTools = [], onToggleFavorite }) {
  const router = useRouter();

  return (
    <section>
      <h2
        className="text-lg text-white mb-3"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        Tools
      </h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
        {activeTOOLS.map((tool) => {
          const isFav = favoriteTools.includes(tool.id);
          const toolIcon = TOOL_ICONS[tool.id];
          const Icon = toolIcon?.icon;
          const iconColor = toolIcon?.color || 'text-slate-400';

          return (
            <Card
              key={tool.id}
              onClick={() => router.push(`${ROUTES.TOOLS}/${tool.id}`)}
              padding="p-3"
              className="shrink-0"
            >
              <div style={{ width: 200 }}>
                <div className="flex items-center justify-between mb-2">
                  {Icon && (
                    <div className={`w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center ${iconColor}`}
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(tool.id);
                    }}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    className={`p-1.5 -mr-1 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                      isFav ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <h3 className="text-white font-light text-sm mb-0.5 truncate">{tool.title}</h3>
                <p className="text-xs text-slate-300 font-light mb-2 line-clamp-2">{tool.description}</p>
                <span className="text-xs text-slate-400 flex items-center gap-1">
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
