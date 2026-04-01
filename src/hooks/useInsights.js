/**
 * useInsights Hook
 * Computes meaningful patterns from trigger log data.
 * Consumes useTriggerStats for automatic cache deduplication.
 */

import { useMemo } from 'react';
import { useTriggerStats } from './useTriggerLogs';
import { SOURCE_OPTIONS } from '@/lib/constants';

function getSourceLabel(value) {
  return SOURCE_OPTIONS.find(s => s.value === value)?.label || value;
}

function buildInsights(stats) {
  if (!stats || stats.totalLogs < 2) return [];

  const insights = [];

  // 1. Top trigger by frequency
  const topTriggers = Object.entries(stats.triggerCounts)
    .sort(([, a], [, b]) => b - a);

  if (topTriggers.length > 0) {
    const [trigger, count] = topTriggers[0];
    const pct = Math.round((count / stats.totalLogs) * 100);
    insights.push({
      type: 'frequency',
      accent: 'indigo',
      message: `${trigger} is your most common sound sensitivity, appearing in ${pct}% of entries`,
    });
  }

  // 2. Time pattern
  const timeEntries = Object.entries(stats.timeOfDayCounts)
    .filter(([key]) => key !== 'now')
    .sort(([, a], [, b]) => b - a);

  if (timeEntries.length > 0) {
    const [peakTime] = timeEntries[0];
    insights.push({
      type: 'time',
      accent: 'cyan',
      message: `You tend to experience difficult sounds most in the ${peakTime}`,
    });
  }

  // 3. Source pattern (highest average intensity)
  const sourceIntensities = {};
  Object.entries(stats.triggerSourcePairs).forEach(([pair, data]) => {
    const source = pair.split('::')[1];
    if (!sourceIntensities[source]) {
      sourceIntensities[source] = { total: 0, count: 0 };
    }
    sourceIntensities[source].total += data.totalIntensity;
    sourceIntensities[source].count += data.count;
  });

  const sourcesWithAvg = Object.entries(sourceIntensities)
    .map(([source, d]) => ({ source, avg: d.total / d.count, count: d.count }))
    .filter(s => s.count >= 2)
    .sort((a, b) => b.avg - a.avg);

  if (sourcesWithAvg.length > 0) {
    const top = sourcesWithAvg[0];
    insights.push({
      type: 'source',
      accent: 'indigo',
      message: `Sounds from ${getSourceLabel(top.source)} tend to feel more intense (avg ${top.avg.toFixed(1)}/10)`,
    });
  }

  // 4. Body response pattern
  const bodyEntries = Object.entries(stats.bodyResponseCounts)
    .sort(([, a], [, b]) => b - a);

  if (bodyEntries.length > 0) {
    const [topBody, bodyCount] = bodyEntries[0];
    insights.push({
      type: 'body',
      accent: 'violet',
      message: `${topBody} is your most common body response, happening ${bodyCount} time${bodyCount > 1 ? 's' : ''}`,
    });
  }

  // 5. Intensity trend (compare first half vs second half of entries)
  if (stats.totalLogs >= 4) {
    const days = Object.keys(stats.byDay).sort();
    const mid = Math.floor(days.length / 2);
    if (mid > 0) {
      const avg = stats.averageIntensity;
      if (avg <= 4) {
        insights.push({
          type: 'trend',
          accent: 'cyan',
          message: `Your average intensity is ${avg}/10, which is on the lighter side`,
        });
      } else if (avg >= 7) {
        insights.push({
          type: 'trend',
          accent: 'cyan',
          message: `Your average intensity is ${avg}/10. Consider trying a breathing practice after logging`,
        });
      }
    }
  }

  // 6. Deeper processing count
  if (stats.deeperCount > 0) {
    insights.push({
      type: 'deeper',
      accent: 'violet',
      message: `You have gone deeper ${stats.deeperCount} time${stats.deeperCount > 1 ? 's' : ''}. This kind of reflection builds real understanding`,
    });
  }

  // Return max 7 insights (prime)
  return insights.slice(0, 7);
}

export function useInsights(userId, days = 30) {
  const { stats, loading, error, refresh } = useTriggerStats(userId, days);
  const insights = useMemo(() => buildInsights(stats), [stats]);

  return {
    insights,
    stats,
    loading,
    error,
    refresh,
    aiSummary: null,
  };
}

export default useInsights;
