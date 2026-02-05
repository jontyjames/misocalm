/**
 * Profile Page
 * User settings and account management
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronRight, Star, BarChart3, BookOpen, Download, AlertCircle, Users, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading, signOut } = useAuth();
  // TODO: Load actual triggers from database
  const [userTriggers] = useState(['Chewing', 'Sniffing', 'Typing']);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push(ROUTES.HOME);
  };

  if (loading || !profile) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" className="text-indigo-400" />
        </div>
      </AppLayout>
    );
  }

  const initial = profile.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <AppLayout>
      <div className="px-6 py-8">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
            <span className="text-3xl font-light text-white">{initial}</span>
          </div>
          <h1 className="text-2xl font-thin text-white mb-1">{profile.name}</h1>
          <p className="text-slate-500">{user?.email}</p>
        </div>

        {/* Severity Level */}
        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Severity Level</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-thin text-white">
                  {profile.severity_level || '--'}
                </span>
                <span className="text-slate-500">/10</span>
              </div>
            </div>
            <button
              onClick={() => router.push(ROUTES.ONBOARDING_ASSESSMENT)}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Retake Assessment
            </button>
          </div>
        </Card>

        {/* My Triggers */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-light">My Triggers</p>
            <button
              onClick={() => router.push(ROUTES.ONBOARDING_ASSESSMENT)}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Edit
            </button>
          </div>
          {userTriggers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userTriggers.map((trigger) => (
                <Badge key={trigger} color="slate">{trigger}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 font-light">
              No triggers set. Tap Edit to add your trigger sounds.
            </p>
          )}
        </Card>

        {/* Stats */}
        <Card className="mb-4">
          <p className="text-white font-light mb-4">Statistics</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <BarChart3 className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
              <p className="text-xl font-thin text-white">0</p>
              <p className="text-xs text-slate-500">Triggers Logged</p>
            </div>
            <div className="text-center">
              <Star className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className="text-xl font-thin text-white">0</p>
              <p className="text-xs text-slate-500">Day Streak</p>
            </div>
            <div className="text-center">
              <BookOpen className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <p className="text-xl font-thin text-white">0</p>
              <p className="text-xs text-slate-500">Tools Used</p>
            </div>
          </div>
        </Card>

        {/* Favorites Link */}
        <Card
          onClick={() => router.push('/tools?filter=favorites')}
          className="mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-400" />
              <span className="text-white font-light">Favorites</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge color="slate" size="sm">0</Badge>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </Card>

        {/* Join Community */}
        <Card
          variant="highlighted"
          className="mb-4 cursor-pointer"
          onClick={() => window.open('https://www.skool.com/thriving-with-misophonia', '_blank')}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <span className="text-white font-light block mb-1">Join Our Community</span>
              <span className="text-sm text-slate-400 font-light">Thriving With Misophonia</span>
            </div>
            <ExternalLink className="w-5 h-5 text-indigo-400 shrink-0 mt-3" />
          </div>
        </Card>

        {/* Export Data */}
        <Card className="mb-4">
          <button className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-slate-400" />
              <span className="text-white font-light">Export My Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </Card>

        {/* Sign Out */}
        <Button
          variant="danger"
          onClick={handleSignOut}
          className="w-full mt-8"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                MisoMind is a wellness tool designed to support self-regulation and awareness.
                It is not a substitute for professional mental health support. If you're experiencing
                severe distress, please reach out to a qualified healthcare provider.
              </p>
            </div>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-slate-600 mt-6">
          MisoMind v0.1.0
        </p>
      </div>
    </AppLayout>
  );
}
