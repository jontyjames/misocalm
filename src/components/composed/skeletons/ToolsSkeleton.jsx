/**
 * ToolsSkeleton - loading placeholder matching the tools page layout.
 * Hero card, horizontal tools row, experience grid, and coming-soon area.
 */

import { Skeleton, SkeletonCard } from '@/components/ui';

export default function ToolsSkeleton() {
  return (
    <div
      className="px-6 py-8 pb-32 space-y-8"
      aria-label="Preparing your practices"
      aria-busy="true"
    >
      <Skeleton width={120} height={28} rounded="rounded-lg" />

      <SkeletonCard height="10rem" />

      <div>
        <Skeleton width={60} height={22} className="mb-3" rounded="rounded-lg" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="shrink-0" style={{ width: 232 }}>
              <SkeletonCard height="8rem" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Skeleton width={100} height={22} className="mb-3" rounded="rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonCard key={index} height="10rem" />
          ))}
        </div>
      </div>
    </div>
  );
}
