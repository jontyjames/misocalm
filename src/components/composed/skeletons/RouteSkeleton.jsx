/**
 * RouteSkeleton - shared page-shaped loading placeholder.
 *
 * Keeps route transitions calm by preserving the final page rhythm while auth,
 * premium, or route data finishes resolving.
 */

import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui';

export default function RouteSkeleton({
  titleWidth = 120,
  introLines = 1,
  cardCount = 3,
  showHeader = true,
  showHero = false,
  showFooter = false,
  className = '',
}) {
  return (
    <div
      className={`px-6 py-8 pb-32 space-y-[26px] ${className}`}
      aria-label="Loading page"
      aria-busy="true"
    >
      {showHeader && (
        <div className="flex items-center gap-[10px]">
          <Skeleton width={42} height={42} circle />
          <Skeleton width={titleWidth} height={26} rounded="rounded-lg" />
        </div>
      )}

      {introLines > 0 && (
        <SkeletonText lines={introLines} className="max-w-sm" />
      )}

      {showHero && <SkeletonCard height="10rem" />}

      <div className="space-y-4">
        {Array.from({ length: cardCount }, (_, index) => (
          <SkeletonCard
            key={index}
            height={index === 0 && !showHero ? '7rem' : '5.5rem'}
          />
        ))}
      </div>

      {showFooter && (
        <div className="fixed inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
          <Skeleton width="100%" height={52} rounded="rounded-full" />
        </div>
      )}
    </div>
  );
}
