/**
 * JournalInsights - Orchestrates insight cards
 * Shows meaningful patterns from trigger data
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePremiumContext } from '@/context/PremiumContext';
import { useInsights } from '@/hooks/useInsights';
import { Spinner, PremiumGate } from '@/components/ui';
import InsightCard from './InsightCard';

export default function JournalInsights() {
  const { user } = useAuth();
  const { isPremium, isLoading: premiumLoading } = usePremiumContext();
  const { insights, stats, loading } = useInsights(user?.id, 30);
  const [showWhy, setShowWhy] = useState(false);

  if (loading || premiumLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="md" />
      </div>
    );
  }

  if (!isPremium) {
    return <PremiumGate feature="Pattern insights" />;
  }

  if (!stats || stats.totalLogs < 2) {
    return (
      <div className="text-center py-16 px-4">
        <p
          className="text-lg text-slate-300 mb-2"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Insights are growing
        </p>
        <p className="text-sm text-slate-400 font-light">
          Log a few more moments and patterns will start to appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Why patterns matter */}
      <button
        onClick={() => setShowWhy(!showWhy)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/30 text-left transition-all duration-[233ms] hover:border-slate-600/50"
      >
        <span className="text-sm text-slate-300 font-light">Why look at patterns?</span>
        {showWhy
          ? <ChevronUp className="w-4 h-4 text-slate-400" />
          : <ChevronDown className="w-4 h-4 text-slate-400" />
        }
      </button>
      {showWhy && (
        <p
          className="text-sm text-slate-300 font-light leading-relaxed px-4 pb-2"
          style={{ animation: 'fadeIn 0.233s ease-out' }}
        >
          These patterns are here to help you understand, not to define you.
          Noticing what shows up most often can bring a sense of clarity, but
          your experience is always more than what numbers can hold.
          Take what feels useful, and leave the rest.
        </p>
      )}

      {/* Summary header */}
      <div className="mb-1">
        <p className="text-sm text-slate-400 font-light">
          Based on {stats.totalLogs} entries over the last 30 days
        </p>
      </div>

      {insights.map((insight, i) => (
        <InsightCard key={i} insight={insight} />
      ))}
    </div>
  );
}
