/**
 * ChatSkeleton - loading placeholder matching the MisoAI chat layout
 */

import { Skeleton } from '@/components/ui';

export default function ChatSkeleton() {
  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-800">
        <Skeleton width={36} height={36} circle />
        <Skeleton width={32} height={32} circle />
        <div className="flex-1">
          <Skeleton width={96} height={18} className="mb-2" rounded="rounded-lg" />
          <Skeleton width={64} height={10} rounded="rounded-full" />
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-start">
          <div className="w-[78%] space-y-2">
            <Skeleton width="100%" height={44} rounded="rounded-2xl" />
            <Skeleton width="72%" height={18} rounded="rounded-full" />
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton width="56%" height={44} rounded="rounded-2xl" />
        </div>
        <div className="flex justify-start">
          <div className="w-[70%] space-y-2">
            <Skeleton width="100%" height={44} rounded="rounded-2xl" />
            <Skeleton width="84%" height={18} rounded="rounded-full" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-deep-space">
        <div className="flex gap-2">
          <Skeleton width="100%" height={48} rounded="rounded-xl" />
          <Skeleton width={48} height={48} rounded="rounded-xl" />
        </div>
      </div>
    </div>
  );
}
