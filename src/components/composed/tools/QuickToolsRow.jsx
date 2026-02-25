/**
 * QuickToolsRow
 * Horizontal scroll row of breathwork tools + Interval Timer.
 * Filter: tool.type === 'practice' || tool.type === 'timer' (excludes coming_soon).
 */

'use client';

import { useRouter } from 'next/navigation';
import { Star, Clock } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { ROUTES, TOOL_CATEGORIES } from '@/lib/constants';
import { TOOLS } from '@/lib/toolsData';

const activeTOOLS = TOOLS.filter((t) => t.type === 'practice' || t.type === 'timer');

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
          return (
            <Card
              key={tool.id}
              onClick={() => router.push(`${ROUTES.TOOLS}/${tool.id}`)}
              padding="p-4"
              className="shrink-0"
            >
              <div style={{ width: 200 }}>
                <div className="flex items-center justify-between mb-2">
                  <Badge color={getCategoryColor(tool.category)} size="sm">
                    {tool.category}
                  </Badge>
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
                <h3 className="text-white font-light text-sm mb-1 truncate">{tool.title}</h3>
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
