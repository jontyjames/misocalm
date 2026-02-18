/**
 * Tool Player Page
 * Individual tool/practice view — thin orchestrator
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import DurationSelector, { DURATION_OPTIONS_BY_TYPE } from '@/components/composed/tools/DurationSelector';
import BreathingPlayer from '@/components/composed/tools/BreathingPlayer';
import ComingSoon from '@/components/composed/tools/ComingSoon';
import TimerSetup from '@/components/composed/tools/TimerSetup';
import TimerPlayer from '@/components/composed/tools/TimerPlayer';
import LaunchSequence from '@/components/composed/tools/LaunchSequence';
import { ROUTES } from '@/lib/constants';

// Tool data (would come from database)
const toolsData = {
  '1': { id: '1', title: '4-7-8 Breathing', description: 'The 4-7-8 breathing technique is a powerful tool for reducing anxiety and promoting calm. Developed by Dr. Andrew Weil, it acts as a natural tranquilizer for the nervous system.', category: 'breathwork', level: 'basic', type: 'practice', breathType: '478' },
  '2': { id: '2', title: 'Body Scan', description: 'A guided return to your body, releasing stored tension one layer at a time.', category: 'somatic', level: 'basic', duration_minutes: 10, type: 'coming_soon' },
  '3': { id: '3', title: 'Box Breathing', description: 'Box breathing is a simple yet powerful technique used by Navy SEALs to stay calm under pressure. The equal 4-4-4-4 rhythm creates a meditative focus that helps redirect attention away from trigger sounds.', category: 'breathwork', level: 'basic', type: 'practice', breathType: 'box' },
  '4': { id: '4', title: 'Physiological Sigh', description: 'Discovered by Stanford neuroscientists, the physiological sigh is the fastest known way to calm your nervous system in real-time. Perfect for acute trigger moments when you need immediate relief.', category: 'breathwork', level: 'basic', type: 'practice', breathType: 'sigh' },
  '5': { id: '5', title: 'Interval Timer', description: 'A meditation timer that keeps you informed without pulling you out of stillness. Gentle bells mark each interval so you never need to move or check your phone.', category: 'somatic', level: 'basic', type: 'timer' },
  '6': { id: '6', title: 'Progressive Relaxation', description: 'Tense, release, discover stillness through systematic muscle group work.', category: 'somatic', level: 'basic', duration_minutes: 15, type: 'coming_soon' },
  '7': { id: '7', title: 'Cognitive Reframing', description: 'See your triggers from a new angle with gentle perspective shifts.', category: 'cognitive', level: 'basic', duration_minutes: 20, type: 'coming_soon' },
};

export default function ToolPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, profile, upsertProfile, refreshProfile, loading } = useAuth();
  const [tool, setTool] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [timerConfig, setTimerConfig] = useState(null);
  const [timerPhase, setTimerPhase] = useState('setup');

  const favoriteTools = profile?.favorite_tools || [];
  const isFavorite = tool && favoriteTools.includes(tool.id);

  const toggleFavorite = async () => {
    if (!tool) return;
    const current = profile?.favorite_tools || [];
    const updated = current.includes(tool.id)
      ? current.filter((id) => id !== tool.id)
      : [...current, tool.id];
    await upsertProfile({ favorite_tools: updated });
    await refreshProfile();
  };

  // Timer callbacks — must be above early returns to satisfy rules of hooks
  const handleTimerStart = useCallback((config) => {
    setTimerConfig(config);
    setTimerPhase('launching');
  }, []);
  const handleTimerBack = useCallback(() => { setTimerConfig(null); setTimerPhase('setup'); }, []);
  const handleTimerJournal = useCallback(() => router.push(`${ROUTES.CHECK_IN}?from=timer`), [router]);
  const handleTimerHome = useCallback(() => router.push(ROUTES.DASHBOARD), [router]);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const id = params.id;
    if (toolsData[id]) {
      setTool(toolsData[id]);
      const durationParam = searchParams.get('duration');
      if (durationParam && toolsData[id].breathType) {
        const options = DURATION_OPTIONS_BY_TYPE[toolsData[id].breathType];
        const match = options?.find(o => o.id === durationParam);
        if (match) setSelectedDuration(match);
      }
    } else {
      // Unknown tool ID — show as coming soon
      setTool({ id, title: 'Coming Soon', type: 'coming_soon' });
    }
  }, [params.id, searchParams]);

  if (loading || !tool) {
    return <AppLayout><div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div></AppLayout>;
  }

  // Duration selection
  if (tool.type === 'practice' && !selectedDuration) {
    return (
      <AppLayout>
        <DurationSelector
          tool={tool}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onSelect={setSelectedDuration}
          onBack={() => router.push(ROUTES.TOOLS)}
        />
      </AppLayout>
    );
  }

  // Active practice
  if (tool.type === 'practice' && selectedDuration) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <button onClick={() => setSelectedDuration(null)} aria-label="Go back" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-light">{tool.title}</span>
            <button onClick={toggleFavorite} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} className={isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}>
              <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          <BreathingPlayer
            tool={tool}
            selectedDuration={selectedDuration}
            onChangeDuration={() => setSelectedDuration(null)}
            onJournal={() => router.push(`${ROUTES.CHECK_IN}?from=breathwork`)}
            onReturnHome={() => router.push(ROUTES.DASHBOARD)}
          />
        </div>
      </AppLayout>
    );
  }

  // Timer — three-phase flow: setup -> launching -> playing
  if (tool.type === 'timer') {
    if (timerPhase === 'setup') {
      return (
        <AppLayout showNav={false}>
          <TimerSetup
            tool={tool}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onBack={() => router.push(ROUTES.TOOLS)}
            onStart={handleTimerStart}
          />
        </AppLayout>
      );
    }

    if (timerPhase === 'launching') {
      return (
        <AppLayout showNav={false}>
          <LaunchSequence onComplete={() => setTimerPhase('playing')} />
        </AppLayout>
      );
    }

    if (timerPhase === 'playing') {
      return (
        <AppLayout showNav={false}>
          <div className="fixed inset-0 overflow-hidden flex flex-col">
            <TimerPlayer
              tool={tool}
              config={{ ...timerConfig, skipCountdown: true }}
              onBack={handleTimerBack}
              onJournal={handleTimerJournal}
              onReturnHome={handleTimerHome}
              onPracticeAgain={handleTimerBack}
            />
          </div>
        </AppLayout>
      );
    }
  }

  // Coming soon tools — render with tool-specific data
  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <button onClick={() => router.push(ROUTES.TOOLS)} aria-label="Go back" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-light">{tool.title}</span>
          <div className="w-9" />
        </div>
        <ComingSoon tool={tool} onBack={() => router.push(ROUTES.TOOLS)} />
      </div>
    </AppLayout>
  );
}
