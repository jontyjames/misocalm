/**
 * Journal - A Space to Reflect
 * Calm hub with optional access to history and insights
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Sparkles, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTriggerStats } from '@/hooks/useTriggerLogs';
import { AppLayout } from '@/components/composed';
import { JournalHistoryList, JournalInsights } from '@/components/composed/journal';
import { ROUTES } from '@/lib/constants';

export default function JournalPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { stats } = useTriggerStats(user?.id, 7);
  const [view, setView] = useState('hub');
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  if (view !== 'hub') {
    return (
      <AppLayout>
        <div className="px-6 py-8 pb-32" style={{ animation: 'fadeIn 0.61s ease-out' }}>
          <button
            onClick={() => setView('hub')}
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
      <div className="relative flex flex-col px-6 py-8" style={{ height: 'calc(100vh - 6rem)' }}>
        {/* Header — matches dashboard height */}
        <div className="flex items-center" style={{ minHeight: '36px' }}>
          <h1
            className="text-2xl text-white"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Journal
          </h1>
        </div>

        {/* Content — vertically centred */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p
            className="text-lg text-slate-200 font-light mb-10"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            A space to notice what moves through you
          </p>

          {/* Log a moment — hero */}
          <div className="relative w-full" style={{ marginBottom: '26px' }}>
            <div
              className="absolute rounded-2xl pointer-events-none"
              style={{
                top: '-2rem', bottom: '-2rem', left: '-1.5rem', right: '-1.5rem',
                background: 'radial-gradient(ellipse 90% 140% at center, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.12) 45%, transparent 70%)',
                filter: 'blur(24px)',
                animation: 'glow-breathe 8s ease-in-out infinite',
              }}
            />
            <button
              onClick={() => router.push(ROUTES.LOG)}
              className="relative w-full py-8 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-xl transition-all duration-[610ms] hover:border-white/30"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(139,92,246,0.1) 60%, rgba(139,92,246,0.06) 100%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(255,255,255,0.04), 0 0 30px rgba(139,92,246,0.2), 0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 70%, transparent 95%)' }} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 40% at 50% 110%, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)', backgroundSize: '100% 200%', animation: 'solfeggio-breathe-852 3.7s ease-in-out infinite' }} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 60%, transparent 70%)', backgroundSize: '250% 100%', animation: 'shimmer 13s ease-in-out infinite' }} />
              <span
                className="relative block text-2xl text-white mb-2"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 400, letterSpacing: '0.04em' }}
              >
                Log a moment
              </span>
              <span className="relative block text-sm text-slate-300 font-light">
                Notice what triggered you
              </span>
            </button>
          </div>

          {/* Past entries */}
          <button
            onClick={() => setView('history')}
            className="relative overflow-hidden w-full p-5 rounded-xl border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms] text-left mb-2.5"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(34,211,238,0.08) 100%)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px rgba(34,211,238,0.12), 0 4px 20px rgba(0,0,0,0.25)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
            <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
            <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(34,211,238,0.06) 0%, transparent 60%)' }} />
            <div className="relative flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-light mb-0.5">Past entries</h3>
                <p className="text-sm text-cyan-400 font-light">Look back when you're ready</p>
              </div>
            </div>
          </button>

          {/* Your patterns */}
          <button
            onClick={() => setView('insights')}
            className="relative overflow-hidden w-full p-5 rounded-xl border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms] text-left"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.25)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
            <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
            <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />
            <div className="relative flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-light mb-0.5">Your patterns</h3>
                <p className="text-sm text-indigo-400 font-light">What your entries reveal</p>
              </div>
            </div>
          </button>
        </div>

        {/* Bottom: quiet stat + why log — absolute so it doesn't affect centering */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col items-center">
          {showWhy && (
            <p
              className="text-sm text-slate-300 font-light leading-relaxed text-center px-4 mb-3"
              style={{ animation: 'fadeIn 0.233s ease-out' }}
            >
              Tracking your triggers helps you spot patterns you might not notice in the moment.
              Over time, this awareness builds a clearer picture of what affects you, when, and why,
              giving you more understanding and more choice in how you respond.
            </p>
          )}
          {stats?.totalLogs > 0 && (
            <p className="text-xs text-slate-500 font-light mb-1">
              {stats.totalLogs} moment{stats.totalLogs !== 1 ? 's' : ''} noticed this week
            </p>
          )}
          <button
            onClick={() => setShowWhy(!showWhy)}
            className="flex items-center gap-2 py-1 transition-all duration-[233ms]"
          >
            <span className="text-sm text-slate-400 font-light">Why log a moment?</span>
            {showWhy
              ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              : <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            }
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
