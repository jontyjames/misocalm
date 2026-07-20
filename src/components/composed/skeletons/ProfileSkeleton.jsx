/**
 * ProfileSkeleton — loading placeholder matching profile page layout
 */

import { Skeleton, SkeletonCard } from '@/components/ui';

export default function ProfileSkeleton() {
  return (
    <div
      className="px-6 py-8 pb-32"
      aria-label="Preparing your profile"
      aria-busy="true"
    >
      {/* Avatar & Name */}
      <div className="flex flex-col items-center mb-10">
        <Skeleton width={80} height={80} circle className="mb-4" />
        <Skeleton width={140} height={28} className="mb-2" rounded="rounded-lg" />
        <Skeleton width={180} height={14} rounded="rounded-full" />
      </div>

      {/* Cards */}
      <SkeletonCard height="4.5rem" className="mb-3" />
      <SkeletonCard height="5.5rem" className="mb-3" />
      <SkeletonCard height="5rem" className="mb-3" />
      <SkeletonCard height="4rem" className="mb-3" />
      <SkeletonCard height="4rem" className="mb-8" />

      {/* Sign out button placeholder */}
      <Skeleton width="100%" height={48} rounded="rounded-full" />
    </div>
  );
}
