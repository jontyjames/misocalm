/**
 * Dashboard Page
 * Main home screen with stats and quick actions
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, TrendingUp, MessageCircle, Plus, Music, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, Badge } from '@/components/ui';
import { AppLayout, Logo } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

const quickActions = [
  {
    icon: MessageCircle,
    label: 'AI Support',
    subtitle: 'Chat with Miso',
    href: ROUTES.CHAT,
    gradient: 'from-indigo-600/30 via-indigo-500/20 to-purple-600/30',
    iconBg: 'bg-indigo-500/30',
    iconColor: 'text-indigo-300',
    glowColor: 'shadow-indigo-500/20',
    emoji: '💬'
  },
  {
    icon: Plus,
    label: 'Log Trigger',
    subtitle: 'Track moments',
    href: ROUTES.LOG,
    gradient: 'from-cyan-600/30 via-cyan-500/20 to-blue-600/30',
    iconBg: 'bg-cyan-500/30',
    iconColor: 'text-cyan-300',
    glowColor: 'shadow-cyan-500/20',
    emoji: '📝'
  },
  {
    icon: Music,
    label: 'Soundscapes',
    subtitle: 'Find calm',
    href: ROUTES.SOUNDSCAPES,
    gradient: 'from-purple-600/30 via-purple-500/20 to-pink-600/30',
    iconBg: 'bg-purple-500/30',
    iconColor: 'text-purple-300',
    glowColor: 'shadow-purple-500/20',
    emoji: '🎧'
  },
  {
    icon: Shield,
    label: 'Boundaries',
    subtitle: 'Scripts & tips',
    href: ROUTES.BOUNDARIES,
    gradient: 'from-emerald-600/30 via-emerald-500/20 to-teal-600/30',
    iconBg: 'bg-emerald-500/30',
    iconColor: 'text-emerald-300',
    glowColor: 'shadow-emerald-500/20',
    emoji: '🛡️'
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isAuthenticated, loading, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(ROUTES.HOME);
      } else if (!hasCompletedOnboarding) {
        router.push(ROUTES.ONBOARDING_ASSESSMENT);
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, loading, router]);

  if (loading || !profile) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Logo size="md" animate />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Logo size="sm" animate={false} />
          <span className="text-xl font-thin text-white">MisoMind</span>
        </div>

        {/* Greeting */}
        <h1 className="text-2xl font-thin text-white mb-1">
          Welcome back, <span className="text-gradient">{profile.name}</span>
        </h1>
        <p className="text-slate-300 font-light mb-8">
          How are you feeling today?
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Streak Card */}
          <Card variant="highlighted" className="animate-fade-in-up stagger-1">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span className="text-xs text-slate-300 uppercase tracking-wider">
                Streak
              </span>
            </div>
            <div className="text-3xl font-thin text-white">0</div>
            <div className="text-xs text-slate-400">Days</div>
          </Card>

          {/* Progress Card */}
          <Card variant="highlighted" className="animate-fade-in-up stagger-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-slate-300 uppercase tracking-wider">
                Progress
              </span>
            </div>
            <div className="text-3xl font-thin text-white">--</div>
            <div className="text-xs text-slate-400">Getting started</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-light text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className={`
                relative overflow-hidden rounded-2xl p-4
                bg-gradient-to-br ${action.gradient}
                border border-white/10
                hover:border-white/20 hover:shadow-lg ${action.glowColor}
                transition-all duration-300 hover:scale-[1.02]
                text-left group
                animate-fade-in-up stagger-${index + 1}
              `}
            >
              {/* Decorative glow */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/5 blur-xl group-hover:bg-white/10 transition-colors" />

              {/* Emoji */}
              <div className="text-2xl mb-3">{action.emoji}</div>

              {/* Content */}
              <h3 className="text-white font-medium text-sm mb-0.5">{action.label}</h3>
              <p className="text-slate-400 text-xs font-light">{action.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Today's Practice */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light text-white">Today's Practice</h2>
          <button
            onClick={() => router.push(ROUTES.TOOLS)}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all
          </button>
        </div>

        <Card variant="interactive" onClick={() => router.push(ROUTES.TOOLS)} className="animate-fade-in-up stagger-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <span className="text-2xl">🧘</span>
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-white font-light mb-1">4-7-8 Breathing</h3>
              <div className="flex items-center gap-2">
                <Badge color="indigo" size="sm">Breathwork</Badge>
                <span className="text-xs text-slate-400">5 min</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
