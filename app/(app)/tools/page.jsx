/**
 * Tools Library Page
 * Browse and access coping tools and practices
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Clock, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePremiumContext } from '@/context/PremiumContext';
import { Card, Badge } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { ToolsSkeleton } from '@/components/composed/skeletons';
import { ROUTES, TOOL_CATEGORIES } from '@/lib/constants';

const tools = [
  {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'Before sleep, or when your mind won\'t stop racing',
    category: 'breathwork',
    duration_minutes: 5,
    type: 'practice',
    breathType: '478',
  },
  {
    id: '3',
    title: 'Box Breathing',
    description: 'Daily practice, or before entering a known trigger situation',
    category: 'breathwork',
    duration_minutes: 4,
    type: 'practice',
    breathType: 'box',
  },
  {
    id: '4',
    title: 'Physiological Sigh',
    description: 'In the moment, when you only have 30 seconds',
    category: 'breathwork',
    duration_minutes: 2,
    type: 'practice',
    breathType: 'sigh',
  },
  {
    id: '2',
    title: 'Body Scan',
    description: 'A guided return to your body',
    category: 'somatic',
    duration_minutes: 10,
    type: 'coming_soon',
    premium: true,
  },
  {
    id: '5',
    title: 'Interval Timer',
    description: 'Meditation timer with gentle bells at each interval',
    category: 'somatic',
    duration_minutes: 20,
    type: 'timer',
  },
  {
    id: '6',
    title: 'Progressive Relaxation',
    description: 'Tense, release, discover stillness',
    category: 'somatic',
    duration_minutes: 15,
    type: 'coming_soon',
    premium: true,
  },
  {
    id: '7',
    title: 'Cognitive Reframing',
    description: 'See your triggers from a new angle',
    category: 'cognitive',
    duration_minutes: 20,
    type: 'coming_soon',
    premium: true,
  },
];

const filterTabs = ['All', 'Breath', 'Body', 'Mind', 'Experiences'];

const experiences = [
  {
    id: 'impermanence',
    title: 'Impermanence',
    description: 'A quiet experiment about sound, and what remains.',
    duration: '~3 min',
    route: '/tools/experiences/impermanence',
  },
  {
    id: 'mandala',
    title: 'Mandala',
    description: 'Touch the void, and see what you already are.',
    duration: '~3 min',
    route: '/tools/experiences/mandala',
  },
  {
    id: 'pulse',
    title: 'Pulse',
    description: 'Your heart has been beating this whole time.',
    duration: '~3 min',
    route: '/tools/experiences/pulse',
  },
];

export default function ToolsPage() {
  const router = useRouter();
  const { isAuthenticated, profile, upsertProfile, refreshProfile, loading } = useAuth();
  const { isPremium } = usePremiumContext();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const favoriteTools = profile?.favorite_tools || [];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  const getCategoryColor = (category) => {
    const cat = TOOL_CATEGORIES.find((c) => c.value === category);
    return cat?.color || 'slate';
  };

  const toggleFavorite = async (toolId) => {
    const current = profile?.favorite_tools || [];
    const updated = current.includes(toolId)
      ? current.filter((id) => id !== toolId)
      : [...current, toolId];
    await upsertProfile({ favorite_tools: updated });
    await refreshProfile();
  };

  const isToolFavorite = (tool) => favoriteTools.includes(tool.id);

  const filteredTools = tools.filter((tool) => {
    if (showFavoritesOnly && !isToolFavorite(tool)) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Breath') return tool.category === 'breathwork';
    if (activeFilter === 'Body') return tool.category === 'somatic';
    if (activeFilter === 'Mind') return tool.category === 'cognitive';
    return false;
  });

  if (loading) {
    return (
      <AppLayout>
        <ToolsSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 py-8 pb-32">
        {/* Header */}
        <h1
          className="text-2xl text-white mb-6"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Practices
        </h1>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide -mx-6 px-6">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`
              p-2 rounded-full transition-all duration-[144ms] active:scale-95
              ${showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800/50'
              }
            `}
            aria-label={showFavoritesOnly ? 'Show all practices' : 'Show favorites only'}
          >
            <Star className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          </button>
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`
                px-4 py-2 rounded-full text-sm font-light whitespace-nowrap
                transition-all duration-[144ms] active:scale-95
                ${activeFilter === tab
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tools */}
        {filteredTools.length > 0 && (
          <div className="space-y-3 mb-8">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={isToolFavorite(tool)}
                onToggleFavorite={() => toggleFavorite(tool.id)}
                getCategoryColor={getCategoryColor}
                isLocked={tool.premium && !isPremium}
              />
            ))}
          </div>
        )}

        {/* Experiences */}
        {(activeFilter === 'All' || activeFilter === 'Experiences') && experiences.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge color="purple">Experiences</Badge>
              <span className="text-sm text-slate-300">Guided</span>
            </div>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <Card
                  key={exp.id}
                  onClick={() => router.push(exp.route)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-light mb-1">{exp.title}</h2>
                      <p className="text-sm text-slate-300 font-light mb-2">{exp.description}</p>
                      <span className="text-xs text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {exp.duration}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function ToolCard({ tool, isFavorite, onToggleFavorite, getCategoryColor, isLocked }) {
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
          <Lock className="w-5 h-5 text-slate-500 shrink-0" />
        ) : !isComingSoon ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 shrink-0 ${isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        ) : null}
      </div>
    </Card>
  );
}
