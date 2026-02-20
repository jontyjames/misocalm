/**
 * DashboardSkeleton — loading placeholder matching dashboard layout
 */

import { Skeleton, SkeletonCard } from '@/components/ui';

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col px-6 py-8 overflow-hidden" style={{ height: 'calc(100dvh - 5rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton width={120} height={24} rounded="rounded-lg" />
        <Skeleton width={44} height={44} circle />
      </div>

      {/* Content — centred */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Greeting */}
        <div className="w-full max-w-[16rem] mb-10 flex flex-col items-center">
          <Skeleton width="80%" height={28} className="mb-3" rounded="rounded-lg" />
          <Skeleton width="60%" height={16} rounded="rounded-lg" />
        </div>

        {/* Hero card */}
        <SkeletonCard height="7rem" className="w-full mb-[26px]" />

        {/* Action cards */}
        <SkeletonCard height="4.5rem" className="w-full mb-2.5" />
        <SkeletonCard height="4.5rem" className="w-full" />
      </div>
    </div>
  );
}
