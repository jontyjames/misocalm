/**
 * ToolsSkeleton — loading placeholder matching tools page layout
 */

import { Skeleton, SkeletonCard } from '@/components/ui';

export default function ToolsSkeleton() {
  return (
    <div className="px-6 py-8 pb-32">
      {/* Title */}
      <Skeleton width={120} height={28} className="mb-6" rounded="rounded-lg" />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <Skeleton width={36} height={36} circle />
        {[64, 56, 48, 52, 80].map((w, i) => (
          <Skeleton key={i} width={w} height={36} rounded="rounded-full" />
        ))}
      </div>

      {/* Tool cards */}
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonCard key={i} height="5.5rem" />
        ))}
      </div>
    </div>
  );
}
