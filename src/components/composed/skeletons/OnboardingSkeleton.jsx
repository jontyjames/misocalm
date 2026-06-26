/**
 * OnboardingSkeleton - calm placeholder for onboarding route transitions.
 */

import { Skeleton, SkeletonCard } from '@/components/ui';

export default function OnboardingSkeleton() {
  return (
    <div
      className="min-h-screen flex flex-col px-6 py-8"
      aria-label="Loading onboarding step"
      aria-busy="true"
    >
      <div className="flex items-center gap-[10px] mb-[42px]">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton
            key={index}
            width={index === 0 ? 26 : 10}
            height={10}
            rounded="rounded-full"
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-[42px]">
            <Skeleton width={210} height={30} rounded="rounded-lg" className="mb-4" />
            <Skeleton width={140} height={14} rounded="rounded-full" />
          </div>

          <div className="space-y-4">
            <SkeletonCard height="4.5rem" />
            <SkeletonCard height="4.5rem" />
            <SkeletonCard height="4.5rem" />
          </div>
        </div>
      </div>

      <div className="pb-4">
        <Skeleton width="100%" height={52} rounded="rounded-full" />
      </div>
    </div>
  );
}
