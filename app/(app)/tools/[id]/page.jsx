/**
 * Tool Player Page
 * Individual tool/practice view — thin orchestrator
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/composed';
import { RouteSkeleton } from '@/components/composed/skeletons';
import DurationSelector, { DURATION_OPTIONS_BY_TYPE } from '@/components/composed/tools/DurationSelector';
import BreathingPlayer from '@/components/composed/tools/BreathingPlayer';
import ComingSoon from '@/components/composed/tools/ComingSoon';
import TimerSetup from '@/components/composed/tools/TimerSetup';
import TimerPlayer from '@/components/composed/tools/TimerPlayer';
import LaunchSequence from '@/components/composed/tools/LaunchSequence';
import { useAuthGuard, useTools } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import { getContextualBackRoute, withRouteContext } from '@/lib/routeContext';
import { TOOLS } from '@/lib/toolsData';

// Lookup by id — single source of truth from toolsData.js
const toolsLookup = Object.fromEntries(TOOLS.map(t => [t.id, t]));
const JOURNAL_FROM_BREATHWORK = `${ROUTES.CHECK_IN}?from=breathwork`;

function ToolHeader({ title, onBack }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
      <button onClick={onBack} aria-label="Go back" className="p-3 -ml-3 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <span className="text-white font-light">{title}</span>
      <div className="w-9" />
    </div>
  );
}

export default function ToolPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuthGuard();
  const { profile } = useAuth();
  const [tool, setTool] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [timerConfig, setTimerConfig] = useState(null);
  const [timerPhase, setTimerPhase] = useState('setup');
  const backRoute = getContextualBackRoute(searchParams, ROUTES.TOOLS);
  const context = searchParams.get('from');
  const openedWithDuration = searchParams.has('duration');

  const { markCompleted } = useTools(profile?.id, { autoFetch: false });
  const handleComplete = useCallback(() => { if (tool) markCompleted(tool.id); }, [tool, markCompleted]);

  // Timer callbacks — must be above early returns to satisfy rules of hooks
  const handleTimerStart = useCallback((config) => {
    setTimerConfig(config);
    setTimerPhase('launching');
  }, []);
  const handleTimerBack = useCallback(() => { setTimerConfig(null); setTimerPhase('setup'); }, []);
  const handleTimerJournal = useCallback(() => router.push(JOURNAL_FROM_BREATHWORK), [router]);
  const handleTimerHome = useCallback(() => router.push(ROUTES.DASHBOARD), [router]);

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

  useEffect(() => {
    if (tool?.type === 'regulation' && tool.route) {
      router.replace(withRouteContext(tool.route, context));
    }
  }, [context, router, tool]);

  if (loading || !isAuthenticated || !tool) {
    return (
      <AppLayout>
        <RouteSkeleton titleWidth={140} introLines={1} cardCount={3} showHero />
      </AppLayout>
    );
  }

  if (tool.type === 'regulation' && tool.route) {
    return (
      <AppLayout>
        <RouteSkeleton titleWidth={170} introLines={1} cardCount={2} />
      </AppLayout>
    );
  }

  // Duration selection
  if (tool.type === 'practice' && !selectedDuration) {
    return (
      <AppLayout>
        <DurationSelector
          tool={tool}
          onSelect={setSelectedDuration}
          onBack={() => router.push(backRoute)}
        />
      </AppLayout>
    );
  }

  // Active practice
  if (tool.type === 'practice' && selectedDuration) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex flex-col">
          <ToolHeader
            title={tool.title}
            onBack={() => (openedWithDuration ? router.push(backRoute) : setSelectedDuration(null))}
          />
          <BreathingPlayer
            tool={tool}
            selectedDuration={selectedDuration}
            onComplete={handleComplete}
            onChangeDuration={() => setSelectedDuration(null)}
            onJournal={() => router.push(JOURNAL_FROM_BREATHWORK)}
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
            onBack={() => router.push(backRoute)}
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
          <div className="fixed inset-0 overflow-clip flex flex-col">
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
        <ToolHeader title={tool.title} onBack={() => router.push(backRoute)} />
        <ComingSoon tool={tool} onBack={() => router.push(backRoute)} />
      </div>
    </AppLayout>
  );
}
