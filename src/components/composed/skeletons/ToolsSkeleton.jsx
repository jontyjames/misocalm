/**
 * ToolsSkeleton — loading placeholder matching new tools page layout
 * Hero card, horizontal tools row, 2x2 experience grid, coming soon
 */

import { Skeleton, SkeletonCard } from '@/components/ui';

export default function ToolsSkeleton() {
  return (
    <div className="px-6 py-8 pb-32 space-y-8">
      {/* Title */}
      <Skeleton width={120} height={28} rounded="rounded-lg" />

      {/* Hero experience card */}
      <SkeletonCard height="10rem" />

      {/* Tools heading + horizontal row */}
      <div>
        <Skeleton width={60} height={22} className="mb-3" rounded="rounded-lg" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="shrink-0" style={{ width: 232 }}>
              <SkeletonCard height="8rem" />
            </div>
          ))}
        </div>
      </div>

      {/* Experiences heading + 2x2 grid */}
      <div>
        <Skeleton width={100} height={22} className="mb-3" rounded="rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} height="10rem" />
          ))}
        </div>
      </div>
    </div>
  );
}
