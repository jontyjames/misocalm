/**
 * Tool Player Page
 * Individual tool/practice view — thin orchestrator
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import DurationSelector, { DURATION_OPTIONS_BY_TYPE } from '@/components/composed/tools/DurationSelector';
import BreathingPlayer from '@/components/composed/tools/BreathingPlayer';
import ComingSoon from '@/components/composed/tools/ComingSoon';
import TimerSetup from '@/components/composed/tools/TimerSetup';
import TimerPlayer from '@/components/composed/tools/TimerPlayer';
import LaunchSequence from '@/components/composed/tools/LaunchSequence';
import { useTools } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import { TOOLS } from '@/lib/toolsData';

// Lookup by id — single source of truth from toolsData.js
const toolsLookup = Object.fromEntries(TOOLS.map(t => [t.id, t]));

export default function ToolPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, profile, loading } = useAuth();
  const [tool, setTool] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [timerConfig, setTimerConfig] = useState(null);
  const [timerPhase, setTimerPhase] = useState('setup');

  const { markCompleted } = useTools(profile?.id, { autoFetch: false });
  const handleComplete = useCallback(() => { if (tool) markCompleted(tool.id); }, [tool, markCompleted]);

  // Timer callbacks — must be above early returns to satisfy rules of hooks
  const handleTimerStart = useCallback((config) => {
    setTimerConfig(config);
    setTimerPhase('launching');
  }, []);
  const handleTimerBack = useCallback(() => { setTimerConfig(null); setTimerPhase('setup'); }, []);
  const handleTimerJournal = useCallback(() => router.push(`${ROUTES.CHECK_IN}?from=breathwork`), [router]);
  const handleTimerHome = useCallback(() => router.push(ROUTES.DASHBOARD), [router]);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const id = params.id;
    const entry = toolsLookup[id];
    if (entry) {
      setTool({ ...entry, description: entry.longDescription || entry.description });
      const durationParam = searchParams.get('duration');
      if (durationParam && entry.breathType) {
        const options = DURATION_OPTIONS_BY_TYPE[entry.breathType];
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
            <div className="w-9" />
          </div>
          <BreathingPlayer
            tool={tool}
            selectedDuration={selectedDuration}
            onComplete={handleComplete}
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
              onComplete={handleComplete}
              onBack={handleTimerBack}
              onJournal={handleTimerJournal}
              onReturnHome={handleTimerHome}

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
