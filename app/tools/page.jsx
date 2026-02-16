/**
 * Tools Library Page
 * Browse and access coping tools and practices
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Lock, Star, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { ROUTES, TOOL_CATEGORIES, TOOL_LEVELS } from '@/lib/constants';

// Sample tools data (would come from database)
const sampleTools = [
  {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'Calm your nervous system with this proven breathing technique',
    category: 'breathwork',
    level: 'basic',
    duration_minutes: 5,
    type: 'practice',
    breathType: '478',
    completed: false,
    times_completed: 0,
  },
  {
    id: '3',
    title: 'Box Breathing',
    description: 'Navy SEAL technique for staying calm under pressure',
    category: 'breathwork',
    level: 'basic',
    duration_minutes: 4,
    type: 'practice',
    breathType: 'box',
    completed: false,
    times_completed: 0,
  },
  {
    id: '4',
    title: 'Physiological Sigh',
    description: 'Fastest way to calm your nervous system in real-time',
    category: 'breathwork',
    level: 'basic',
    duration_minutes: 2,
    type: 'practice',
    breathType: 'sigh',
    completed: false,
    times_completed: 0,
  },
  {
    id: '2',
    title: 'Body Scan',
    description: 'Release tension by scanning through your body',
    category: 'somatic',
    level: 'basic',
    duration_minutes: 10,
    type: 'guided',
    completed: false,
    times_completed: 0,
  },
  {
    id: '5',
    title: 'Interval Timer',
    description: 'Meditation timer with gentle bells at each interval',
    category: 'somatic',
    level: 'basic',
    duration_minutes: 20,
    type: 'timer',
    completed: false,
    times_completed: 0,
  },
  {
    id: '6',
    title: 'Progressive Relaxation',
    description: 'Systematically tense and release muscle groups',
    category: 'somatic',
    level: 'intermediate',
    duration_minutes: 15,
    type: 'guided',
    completed: false,
    times_completed: 0,
  },
  {
    id: '7',
    title: 'Cognitive Reframing',
    description: 'Learn to reframe your thoughts about triggers',
    category: 'cognitive',
    level: 'intermediate',
    duration_minutes: 20,
    type: 'video',
    completed: false,
    times_completed: 0,
  },
];

const filterTabs = ['All', 'Breath', 'Body', 'Experiences'];

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
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [tools] = useState(sampleTools);

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

  const getLevelBadge = (level) => {
    const lvl = TOOL_LEVELS.find((l) => l.value === level);
    return lvl || { label: level, color: 'slate' };
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
    // Apply favorites filter (composable with category)
    if (showFavoritesOnly && !isToolFavorite(tool)) return false;
    // Apply category filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Breath') return tool.category === 'breathwork';
    if (activeFilter === 'Body') return tool.category === 'somatic';
    return tool.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const basicTools = filteredTools.filter((t) => t.level === 'basic');
  const intermediateTools = filteredTools.filter((t) => t.level === 'intermediate');
  const advancedTools = filteredTools.filter((t) => t.level === 'advanced');

  // Calculate progress
  const completedBasics = basicTools.filter((t) => t.completed).length;
  const totalBasics = tools.filter((t) => t.level === 'basic').length;
  const canAccessIntermediate = completedBasics >= 2;

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-thin text-white">Practices</h1>
          <Button variant="secondary" size="sm">
            <Lock className="w-4 h-4 mr-2" />
            Unlock
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Journey Progress</span>
            <span className="text-sm text-slate-300">
              {completedBasics}/{totalBasics} basics completed
            </span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full animate-progress"
              style={{ width: `${(completedBasics / totalBasics) * 100}%` }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {/* Favorites toggle (composable with category) */}
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
          {/* Category tabs */}
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

        {/* Basic Tools */}
        {basicTools.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge color="emerald">Essential</Badge>
              <span className="text-sm text-slate-300">Basic Tools</span>
            </div>
            <div className="space-y-3">
              {basicTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isToolFavorite(tool)}
                  onToggleFavorite={() => toggleFavorite(tool.id)}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* Intermediate Tools */}
        {intermediateTools.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge color="amber">Level Up</Badge>
              <span className="text-sm text-slate-300">Intermediate Tools</span>
              {!canAccessIntermediate && (
                <Lock className="w-4 h-4 text-slate-600" />
              )}
            </div>
            <div className={`space-y-3 ${!canAccessIntermediate ? 'opacity-50' : ''}`}>
              {intermediateTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  locked={!canAccessIntermediate}
                  isFavorite={isToolFavorite(tool)}
                  onToggleFavorite={() => toggleFavorite(tool.id)}
                  getCategoryColor={getCategoryColor}
                />
              ))}
            </div>
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

function ToolCard({ tool, locked, isFavorite, onToggleFavorite, getCategoryColor }) {
  const router = useRouter();

  return (
    <Card
      onClick={locked ? undefined : () => router.push(`/tools/${tool.id}`)}
      className={locked ? 'cursor-not-allowed' : ''}
    >
      <div className="flex items-center gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-light flex items-center gap-2 mb-1">
            <span className="truncate">{tool.title}</span>
            {tool.completed && (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
          </h2>
          <p className="text-sm text-slate-300 font-light mb-2 truncate">
            {tool.description}
          </p>
          <div className="flex items-center gap-3">
            <Badge color={getCategoryColor(tool.category)} size="sm">
              {tool.category}
            </Badge>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {tool.duration_minutes} min
            </span>
            {tool.times_completed > 0 && (
              <span className="text-xs text-slate-300">
                {tool.times_completed}x
              </span>
            )}
          </div>
        </div>
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`p-2 shrink-0 ${isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </Card>
  );
}
