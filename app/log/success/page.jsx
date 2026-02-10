/**
 * Trigger Log Success Page
 * Celebrates the user for logging their trigger with insights
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Home, Wind, MessageCircle, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { triggerLogService } from '@/services';
import { Button, Card } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

export default function LogSuccessPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    const loadInsight = async () => {
      if (!user?.id) return;

      const { stats } = await triggerLogService.getStats(user.id, 7);
      if (!stats || stats.totalLogs < 2) return;

      // Find most common trigger this week
      const topTrigger = Object.entries(stats.triggerCounts)
        .sort(([, a], [, b]) => b - a)[0];

      if (topTrigger && topTrigger[1] >= 2) {
        setInsight({
          type: 'frequency',
          trigger: topTrigger[0],
          count: topTrigger[1],
          totalLogs: stats.totalLogs,
          avgIntensity: stats.averageIntensity,
        });
      } else if (stats.totalLogs >= 3) {
        setInsight({
          type: 'streak',
          totalLogs: stats.totalLogs,
          avgIntensity: stats.averageIntensity,
        });
      }
    };

    loadInsight();
  }, [user?.id]);

  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-sm w-full text-center">
          {/* Celebration Icon */}
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 animate-scale-in">
            <Sparkles className="w-12 h-12 text-emerald-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-thin text-white mb-4 animate-fade-in-up stagger-1">
            Well Done!
          </h1>

          {/* Message */}
          <p className="text-slate-300 font-light mb-2 animate-fade-in-up stagger-2">
            You've taken an important step.
          </p>
          <p className="text-slate-300 font-light mb-8 animate-fade-in-up stagger-3">
            Awareness is the foundation of change. By recognizing and logging your triggers, you're building the self-understanding needed to thrive.
          </p>

          {/* Insight Card */}
          {insight && (
            <Card className="mb-6 text-left animate-fade-in-up stagger-4 bg-indigo-500/10 border-indigo-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  {insight.type === 'frequency' ? (
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Calendar className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-white font-light mb-1">Weekly Insight</p>
                  {insight.type === 'frequency' ? (
                    <p className="text-sm text-slate-300 font-light">
                      <span className="text-indigo-300">{insight.trigger}</span> has triggered you{' '}
                      <span className="text-indigo-300">{insight.count} times</span> this week.
                      {insight.avgIntensity >= 6 && " Consider trying a breathing exercise when this occurs."}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-300 font-light">
                      You've logged <span className="text-indigo-300">{insight.totalLogs} triggers</span> this week.
                      Avg intensity: <span className="text-indigo-300">{insight.avgIntensity}/10</span>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Encouragement Card */}
          <Card className="mb-8 text-left animate-fade-in-up stagger-4">
            <p className="text-sm text-slate-300 font-light italic">
              "Every trigger logged is a step toward understanding yourself better. Keep going - you're doing great."
            </p>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3 animate-fade-in-up stagger-5">
            <Button
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="w-full"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                onClick={() => router.push('/tools/1')}
                className="w-full"
              >
                <Wind className="w-4 h-4 mr-2" />
                Breathe
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push(ROUTES.CHAT)}
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Talk to AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
