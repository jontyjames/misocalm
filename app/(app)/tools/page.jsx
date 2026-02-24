/**
 * Tools Library Page
 * Browse and access coping tools and practices
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePremiumContext } from '@/context/PremiumContext';
import { Card, Badge } from '@/components/ui';
import { AppLayout, ToolCard } from '@/components/composed';
import { ToolsSkeleton } from '@/components/composed/skeletons';
import { ROUTES, TOOL_CATEGORIES } from '@/lib/constants';
import { TOOLS, FILTER_TABS, EXPERIENCES } from '@/lib/toolsData';

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

  const filteredTools = TOOLS.filter((tool) => {
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
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/50'
              }
            `}
            aria-label={showFavoritesOnly ? 'Show all practices' : 'Show favorites only'}
          >
            <Star className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          </button>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              aria-current={activeFilter === tab ? 'true' : undefined}
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
        {(activeFilter === 'All' || activeFilter === 'Experiences') && EXPERIENCES.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge color="purple">Experiences</Badge>
              <span className="text-sm text-slate-300">Guided</span>
            </div>
            <div className="space-y-3">
              {EXPERIENCES.map((exp) => (
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
