/**
 * Journal - A Space to Reflect
 * Two equal paths: Log a moment + Check in, with history and patterns below
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Heart, Clock, Sparkles, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard, useTriggerStats } from '@/hooks';
import { AppLayout } from '@/components/composed';
import { JournalHistoryList, JournalInsights } from '@/components/composed/journal';
import { RouteSkeleton } from '@/components/composed/skeletons';
import { ROUTES } from '@/lib/constants';
import { SACRED_GLASS_CLASSES, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE, torusFlowStyle, solfeggioBreathStyle, SACRED_GLASS_SUBTLE_CLASSES, sacredGlassSubtleStyle } from '@/lib/sacredGlass';

export default function JournalPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthGuard();
  const { user } = useAuth();
  const { stats } = useTriggerStats(user?.id, 7);
  const [view, setView] = useState('hub');

  // Mark initial history entry as hub so popstate knows the base state
  useEffect(() => {
    window.history.replaceState({ view: 'hub' }, '', '/journal');
  }, []);

  // Listen for browser back (swipe gesture / back button) to sync view with history
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.view) {
        setView(event.state.view);
      } else {
        setView('hub');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Switch view and push a history entry so browser back returns to hub
  const changeView = (newView) => {
    if (newView === view) return;
    setView(newView);
    if (newView !== 'hub') {
      window.history.pushState({ view: newView }, '', '/journal');
    }
  };

  const returnToHub = () => {
    setView('hub');
    window.history.replaceState({ view: 'hub' }, '', '/journal');
  };

  if (loading || !isAuthenticated) {
    return (
      <AppLayout>
        <RouteSkeleton titleWidth={140} introLines={2} cardCount={3} />
      </AppLayout>
    );
  }

  if (view !== 'hub') {
    return (
      <AppLayout>
        <div className="px-6 py-8 pb-32" style={{ animation: 'fadeIn 0.61s ease-out' }}>
          <button
            onClick={returnToHub}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-[233ms] mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-light">Journal</span>
          </button>
          <h1
            className="text-2xl text-white mb-6"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            {view === 'history' ? 'Past entries' : 'Your patterns'}
          </h1>
          {view === 'history' ? <JournalHistoryList /> : <JournalInsights />}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative flex flex-col px-6 py-8 overflow-clip" style={{ height: 'calc(100dvh - 5rem - env(safe-area-inset-top, 0px))', animation: 'fadeIn 0.61s ease-out' }}>
        {/* Header */}
        <div className="flex items-center" style={{ minHeight: '36px' }}>
          <h1
            className="text-2xl text-white"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Journal
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p
            className="text-lg text-slate-200 font-light mb-2"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            {stats?.totalLogs === 0 ? 'A quiet place to notice what you feel' : 'What would you like to do?'}
          </p>
          <p className="text-sm text-slate-400 font-light" style={{ marginBottom: '42px' }}>
            Both paths lead somewhere good
          </p>

          {/* Two equal cards */}
          <div className="w-full space-y-4" style={{ marginBottom: '26px' }}>
            {/* Log a moment — violet 852Hz */}
            <button
              onClick={() => router.push(ROUTES.LOG)}
              className="relative w-full py-7 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-xl transition-all duration-[610ms] hover:border-white/30"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(139,92,246,0.1) 60%, rgba(139,92,246,0.06) 100%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(255,255,255,0.04), 0 0 24px rgba(139,92,246,0.15), 0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 70%, transparent 95%)' }} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={PHI_LAYERS_STYLE} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={torusFlowStyle('violet')} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={solfeggioBreathStyle('violet', 'solfeggio-breathe-852 3.7s ease-in-out infinite')} />
              <div className="relative flex items-center justify-center gap-3">
                <BookOpen className="w-5 h-5 text-violet-400" />
                <span
                  className="text-xl text-white"
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  Log a moment
                </span>
              </div>
              <span className="relative block text-sm text-slate-300 font-light mt-1.5">
                Write about what felt intense
              </span>
            </button>

            {/* Check in — cyan 741Hz */}
            <button
              onClick={() => router.push(ROUTES.CHECK_IN)}
              className="relative w-full py-7 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-xl transition-all duration-[610ms] hover:border-white/30"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(34,211,238,0.1) 60%, rgba(34,211,238,0.06) 100%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(255,255,255,0.04), 0 0 24px rgba(34,211,238,0.15), 0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 70%, transparent 95%)' }} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={PHI_LAYERS_STYLE} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={torusFlowStyle('cyan')} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={solfeggioBreathStyle('cyan', 'solfeggio-breathe-741 3.7s ease-in-out infinite')} />
              <div className="relative flex items-center justify-center gap-3">
                <Heart className="w-5 h-5 text-cyan-400" />
                <span
                  className="text-xl text-white"
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                >
                  Check in
                </span>
              </div>
              <span className="relative block text-sm text-slate-300 font-light mt-1.5">
                Notice how you're feeling
              </span>
            </button>
          </div>

          {/* Compact history + patterns row */}
          <div className="w-full flex gap-3">
            <button
              onClick={() => changeView('history')}
              className={`relative overflow-hidden flex-1 p-4 rounded-xl ${SACRED_GLASS_SUBTLE_CLASSES} text-left`}
              style={sacredGlassSubtleStyle()}
            >
              <div className="relative flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="text-sm text-slate-300 font-light">Past entries</span>
              </div>
            </button>

            <button
              onClick={() => changeView('insights')}
              className={`relative overflow-hidden flex-1 p-4 rounded-xl ${SACRED_GLASS_SUBTLE_CLASSES} text-left`}
              style={sacredGlassSubtleStyle()}
            >
              <div className="relative flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="text-sm text-slate-300 font-light">Your patterns</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom quiet stat */}
        {stats?.totalLogs > 0 && (
          <div className="absolute bottom-6 left-6 right-6 flex justify-center">
            <p className="text-xs text-slate-300 font-light">
              {stats.totalLogs} moment{stats.totalLogs !== 1 ? 's' : ''} noticed this week
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
