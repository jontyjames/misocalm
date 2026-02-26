/**
 * Profile Page
 * User settings, triggers, gentle stats, community
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ChevronRight, BookOpen, Download, AlertCircle, Users, ExternalLink, Wind } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard, useUserTriggers, useTriggerStats, useToolStats } from '@/hooks';
import { Button } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { ProfileSkeleton } from '@/components/composed/skeletons';
import { ROUTES } from '@/lib/constants';

const IMPACT_LABELS = {
  mild: 'A little',
  moderate: 'Quite a bit',
  significant: 'Significantly',
  unsure: 'Still figuring it out',
};

export default function ProfilePage() {
  const router = useRouter();
  const { loading } = useAuthGuard();
  const { user, profile, signOut } = useAuth();
  const { triggers } = useUserTriggers(user?.id);
  const { stats } = useTriggerStats(user?.id, 90);
  const { stats: toolStats } = useToolStats(user?.id);

  const handleSignOut = async () => {
    await signOut();
    router.push(ROUTES.HOME);
  };

  if (loading || !profile) {
    return (
      <AppLayout>
        <ProfileSkeleton />
      </AppLayout>
    );
  }

  const initial = profile.name?.charAt(0)?.toUpperCase() || '?';
  const totalLogs = stats?.totalLogs || 0;
  const practicesCompleted = toolStats?.totalCompletions || 0;
  const impactLabel = IMPACT_LABELS[profile.impact_level] || null;

  return (
    <AppLayout>
      <div className="px-6 py-8 pb-32" style={{ animation: 'fadeIn 0.61s ease-out' }}>
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
            <span className="text-3xl font-light text-white">{initial}</span>
          </div>
          <h1
            className="text-2xl text-white mb-1"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            {profile.name}
          </h1>
          <p className="text-sm text-slate-300 font-light">{user?.email}</p>
        </div>

        {/* Impact Level */}
        {impactLabel && (
          <button
            onClick={() => router.push(`${ROUTES.ONBOARDING_ASSESSMENT}?from=profile`)}
            className="w-full p-4 rounded-xl border-2 border-white/[0.33] hover:border-white/40 transition-all duration-[144ms] text-left mb-3"
            style={{ background: 'rgba(99,102,241,0.08)', boxShadow: '0 0 12px rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-300 font-light mb-1">How misophonia affects you</p>
                <p className="text-white font-light">{impactLabel}</p>
              </div>
              <span className="text-xs text-indigo-300 font-light">Retake</span>
            </div>
          </button>
        )}

        {/* My Triggers */}
        <button
          onClick={() => router.push(ROUTES.PROFILE_TRIGGERS)}
          className="w-full p-4 rounded-xl border-2 border-white/[0.33] hover:border-white/40 transition-all duration-[144ms] text-left mb-3"
          style={{ background: 'rgba(139,92,246,0.08)', boxShadow: '0 0 12px rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-light">My Triggers</p>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
          {triggers.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {triggers.slice(0, 7).map((trigger) => (
                <span
                  key={trigger}
                  className="px-2.5 py-0.5 rounded-full text-xs font-light bg-indigo-500/15 border border-indigo-500/25 text-indigo-300"
                >
                  {trigger}
                </span>
              ))}
              {triggers.length > 7 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-light bg-slate-800/50 border border-slate-700/50 text-slate-300">
                  +{triggers.length - 7} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-300 font-light">
              Tap to add your trigger sounds
            </p>
          )}
        </button>

        {/* Gentle Stats */}
        <div
          className="p-5 rounded-xl border-2 border-white/[0.33] mb-3"
          style={{ background: 'rgba(34,211,238,0.06)', boxShadow: '0 0 12px rgba(255,255,255,0.06)' }}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <BookOpen className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
              <p
                className="text-2xl text-white mb-0.5"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
              >
                {totalLogs}
              </p>
              <p className="text-xs text-slate-300 font-light">Moments logged</p>
            </div>
            <div className="text-center">
              <Wind className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <p
                className="text-2xl text-white mb-0.5"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
              >
                {practicesCompleted}
              </p>
              <p className="text-xs text-slate-300 font-light">Practices completed</p>
            </div>
          </div>
        </div>

        {/* Join Community */}
        <button
          onClick={() => window.open('https://www.skool.com/thriving-with-misophonia', '_blank')}
          className="w-full p-4 rounded-xl border-2 border-white/[0.33] hover:border-white/40 transition-all duration-[144ms] text-left mb-3"
          style={{ background: 'rgba(99,102,241,0.08)', boxShadow: '0 0 12px rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-white font-light mb-0.5">Join Our Community</p>
              <p className="text-sm text-slate-300 font-light">Thriving With Misophonia</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-300 shrink-0 mt-3" />
          </div>
        </button>

        {/* Export Data */}
        <button
          disabled
          className="w-full p-4 rounded-xl border-2 border-white/[0.33] transition-all duration-[144ms] text-left mb-8 opacity-50 cursor-not-allowed"
          style={{ background: 'rgba(30,41,59,0.3)', boxShadow: '0 0 12px rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-slate-300" />
              <span className="text-white font-light">Export My Data</span>
            </div>
            <span className="text-xs text-slate-400 font-light">Coming soon</span>
          </div>
        </button>

        {/* Sign Out */}
        <Button
          variant="danger"
          onClick={handleSignOut}
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Log Out
          </span>
        </Button>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              MisoCalm is a wellness tool designed to support self-regulation and awareness.
              It is not a substitute for professional mental health support.
            </p>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex justify-center gap-4 mt-6">
          <Link href={ROUTES.PRIVACY} className="text-xs text-indigo-400 hover:text-indigo-300 font-light transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-600">|</span>
          <Link href={ROUTES.TERMS} className="text-xs text-indigo-400 hover:text-indigo-300 font-light transition-colors">
            Terms of Service
          </Link>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-slate-400 mt-4 font-light">
          MisoCalm v0.1.0
        </p>
      </div>
    </AppLayout>
  );
}
