/**
 * WelcomeSkeleton - first-load placeholder for the public entry screen.
 */

import { Skeleton } from '@/components/ui';

export default function WelcomeSkeleton() {
  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-6"
      aria-label="Loading welcome screen"
      aria-busy="true"
    >
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '28%' }}>
        <Skeleton width={110} height={110} circle />
      </div>

      <div className="absolute left-0 right-0 flex flex-col items-center gap-[16px]" style={{ top: 'calc(28% + 9rem)' }}>
        <Skeleton width={210} height={34} rounded="rounded-lg" />
        <Skeleton width={260} height={14} rounded="rounded-full" />
        <Skeleton width={210} height={52} rounded="rounded-full" className="mt-[26px]" />
      </div>
    </div>
  );
}
