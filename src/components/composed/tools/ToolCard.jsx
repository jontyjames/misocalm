/**
 * ToolCard
 * A single tool/practice card for the tools library.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Star, Clock, Lock } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

export default function ToolCard({ tool, isFavorite, onToggleFavorite, getCategoryColor, isLocked }) {
  const router = useRouter();
  const isComingSoon = tool.type === 'coming_soon';

  return (
    <Card
      onClick={() => router.push(isLocked ? ROUTES.PREMIUM : `${ROUTES.TOOLS}/${tool.id}`)}
      className={isLocked ? 'opacity-70' : ''}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className={`font-light truncate ${isLocked ? 'text-slate-300' : 'text-white'}`}>{tool.title}</h2>
            {isLocked ? (
              <span
                className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-light text-violet-300 border border-violet-500/25 flex items-center gap-1"
                style={{ background: 'rgba(139,92,246,0.12)' }}
              >
                <Lock className="w-2.5 h-2.5" />
                Community
              </span>
            ) : isComingSoon ? (
              <span
                className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-light text-violet-300 border border-violet-500/20"
                style={{ background: 'rgba(139,92,246,0.1)' }}
              >
                soon
              </span>
            ) : null}
          </div>
          <p className={`text-sm font-light mb-2 truncate ${isLocked ? 'text-slate-400' : 'text-slate-300'}`}>
            {tool.description}
          </p>
          <div className="flex items-center gap-3">
            <Badge color={getCategoryColor(tool.category)} size="sm">
              {tool.category}
            </Badge>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ~{tool.duration_minutes} min
            </span>
          </div>
        </div>
        {isLocked ? (
          <Lock className="w-5 h-5 text-slate-400 shrink-0" />
        ) : !isComingSoon ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 shrink-0 ${isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}`}
          >
            <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        ) : null}
      </div>
    </Card>
  );
}
