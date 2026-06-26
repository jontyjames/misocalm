/**
 * Flow Lab - internal UI transition playground.
 * Admin-only tool for replaying high-risk app states without real user setup.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Monitor,
  Play,
  RefreshCw,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, Badge } from '@/components/ui';
import { DashboardSkeleton } from '@/components/composed/dashboard';
import {
  ChatSkeleton,
  ProfileSkeleton,
  RouteSkeleton,
  ToolsSkeleton,
} from '@/components/composed/skeletons';
import WelcomeArrival from '@/components/composed/welcome/WelcomeArrival';
import { ADMIN_EMAILS, ROUTES } from '@/lib/constants';

const VIEWPORTS = {
  mobile: { label: 'Mobile', width: 390, height: 760, icon: Smartphone },
  small: { label: 'Small', width: 360, height: 680, icon: Smartphone },
  desktop: { label: 'Desktop', width: 880, height: 620, icon: Monitor },
};

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ROUTE_SHORTCUTS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD },
  { label: 'Welcome Day', href: `${ROUTES.DASHBOARD}?day=0` },
  { label: 'Resources', href: ROUTES.RESOURCES },
  { label: 'MisoAI', href: ROUTES.CHAT },
  { label: 'Check-in', href: ROUTES.CHECK_IN },
  { label: 'Profile Triggers', href: ROUTES.PROFILE_TRIGGERS },
  { label: 'Tool Detail', href: '/tools/1' },
];

function ScenarioPreview({ scenario }) {
  if (scenario === 'dashboard') return <DashboardSkeleton />;
  if (scenario === 'tools') return <ToolsSkeleton />;
  if (scenario === 'profile') return <ProfileSkeleton />;
  if (scenario === 'chat') return <ChatSkeleton />;
  if (scenario === 'journal') {
    return <RouteSkeleton titleWidth={120} introLines={2} cardCount={3} showFooter />;
  }
  if (scenario === 'tool-detail') {
    return <RouteSkeleton titleWidth={140} introLines={1} cardCount={3} showHero />;
  }
  return <RouteSkeleton titleWidth={120} introLines={2} cardCount={3} />;
}

const SCENARIOS = [
  { id: 'dashboard', label: 'Dashboard Load', note: 'Home base while profile resolves.' },
  { id: 'route', label: 'Route Load', note: 'Generic app page loading state.' },
  { id: 'journal', label: 'Journal Transition', note: 'Post-log and check-in handoff shape.' },
  { id: 'chat', label: 'MisoAI Load', note: 'Chat surface before messages hydrate.' },
  { id: 'profile', label: 'Profile Load', note: 'Account and trigger settings placeholder.' },
  { id: 'tools', label: 'Tools Load', note: 'Tools index layout before data settles.' },
  { id: 'tool-detail', label: 'Tool Detail', note: 'Practice setup route before tool data resolves.' },
];

export default function FlowLabPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [scenario, setScenario] = useState('dashboard');
  const [viewport, setViewport] = useState('mobile');
  const [dayOverride, setDayOverride] = useState(0);
  const [welcomePlaying, setWelcomePlaying] = useState(false);
  const [status, setStatus] = useState('Ready');

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
  const activeViewport = VIEWPORTS[viewport];
  const activeScenario = useMemo(
    () => SCENARIOS.find(item => item.id === scenario) || SCENARIOS[0],
    [scenario]
  );

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push(ROUTES.HOME);
    } else if (!isAdmin) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  if (authLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-void-black px-6 py-8">
        <RouteSkeleton titleWidth={140} introLines={1} cardCount={3} />
      </div>
    );
  }

  const markWelcomeShown = () => {
    sessionStorage.setItem('misocalm_welcome_shown', 'true');
    setStatus('Returning welcome marked as shown for this session.');
  };

  const resetWelcome = () => {
    sessionStorage.removeItem('misocalm_welcome_shown');
    setStatus('Returning welcome reset. Open dashboard to see it again.');
  };

  const replayWelcome = () => {
    setWelcomePlaying(false);
    requestAnimationFrame(() => setWelcomePlaying(true));
    setStatus(`Playing ${DAYS[dayOverride]} welcome arrival.`);
  };

  return (
    <div className="min-h-screen bg-void-black px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-[26px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => router.push(ROUTES.DEBUG)}
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Debug dashboard
            </button>
            <h1
              className="text-3xl text-white"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              Flow Lab
            </h1>
            <p className="mt-2 text-sm text-slate-400 font-light">
              Replay app states and route transitions without rebuilding the whole journey.
            </p>
          </div>
          <Badge color="indigo">Admin only</Badge>
        </header>

        <div className="grid gap-[26px] lg:grid-cols-[20rem_1fr]">
          <aside className="space-y-4">
            <Card variant="elevated">
              <h2 className="mb-3 text-sm text-slate-400 font-light">Scenarios</h2>
              <div className="space-y-2">
                {SCENARIOS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setScenario(item.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      scenario === item.id
                        ? 'border-indigo-500/40 bg-indigo-500/15'
                        : 'border-slate-700/60 bg-slate-900/30 hover:border-slate-600'
                    }`}
                  >
                    <span className="block text-sm text-white font-light">{item.label}</span>
                    <span className="mt-1 block text-xs text-slate-500 font-light">{item.note}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card variant="elevated">
              <h2 className="mb-3 text-sm text-slate-400 font-light">Viewport</h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(VIEWPORTS).map(([key, item]) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setViewport(key)}
                      className={`rounded-xl border px-3 py-3 text-xs transition-colors ${
                        viewport === key
                          ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200'
                          : 'border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="mx-auto mb-1 h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card variant="elevated">
              <h2 className="mb-3 text-sm text-slate-400 font-light">Welcome Arrival</h2>
              <div className="grid grid-cols-7 gap-1.5">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => setDayOverride(index)}
                    className={`rounded-lg px-2 py-2 text-xs transition-colors ${
                      dayOverride === index
                        ? 'bg-violet-500/25 text-violet-100'
                        : 'bg-slate-800/60 text-slate-500 hover:text-white'
                    }`}
                    title={day}
                  >
                    {day.slice(0, 1)}
                  </button>
                ))}
              </div>
              <Button onClick={replayWelcome} className="mt-3 w-full" size="sm">
                <Play className="mr-2 h-4 w-4" />
                Replay {DAYS[dayOverride]}
              </Button>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={resetWelcome}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Reset flag
                </button>
                <button
                  onClick={markWelcomeShown}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Mark shown
                </button>
              </div>
            </Card>
          </aside>

          <main className="space-y-4">
            <Card variant="elevated" className="overflow-hidden">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl text-white font-light">{activeScenario.label}</h2>
                  <p className="text-sm text-slate-500 font-light">{activeScenario.note}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {status}
                </div>
              </div>

              <div className="overflow-auto rounded-xl border border-slate-800 bg-black/40 p-4">
                <div
                  className="mx-auto overflow-hidden rounded-[26px] border border-slate-700/70 bg-void-black shadow-2xl"
                  style={{
                    width: activeViewport.width,
                    height: activeViewport.height,
                    maxWidth: '100%',
                  }}
                >
                  <ScenarioPreview scenario={scenario} />
                </div>
              </div>
            </Card>

            <Card variant="elevated">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl text-white font-light">Route Shortcuts</h2>
                <Badge color="slate">Real app</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {ROUTE_SHORTCUTS.map(route => (
                  <a
                    key={route.label}
                    href={route.href}
                    className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-white"
                  >
                    {route.label}
                    <ExternalLink className="h-4 w-4 text-slate-500" />
                  </a>
                ))}
              </div>
            </Card>
          </main>
        </div>
      </div>

      {welcomePlaying && (
        <WelcomeArrival
          dayOverride={dayOverride}
          profileName="Jonty"
          onComplete={() => {
            setWelcomePlaying(false);
            setStatus('Welcome arrival completed.');
          }}
        />
      )}
    </div>
  );
}
