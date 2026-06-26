import { Skeleton, SkeletonCard } from '@/components/ui';

export const TABS = ['Overview', 'Live', 'Journeys', 'Funnel', 'Sessions'];

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  return `${Math.floor(diff / 86400_000)}d ago`;
}

export function formatDuration(ms) {
  if (!ms) return '-';
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60_000)}m`;
}

export function AnalyticsLoading() {
  return (
    <div className="space-y-3" aria-label="Loading analytics" aria-busy="true">
      <div className="flex items-center gap-2">
        <Skeleton width={18} height={18} circle />
        <Skeleton width={120} height={14} rounded="rounded-full" />
      </div>
      <SkeletonCard height="5rem" />
      <SkeletonCard height="5rem" />
      <Skeleton width={180} height={12} rounded="rounded-full" />
    </div>
  );
}
