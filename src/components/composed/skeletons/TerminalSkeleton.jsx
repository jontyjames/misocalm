/**
 * TerminalSkeleton - dark loading state for education terminal modules.
 */

import { Skeleton } from '@/components/ui';

export default function TerminalSkeleton() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-void-black px-6"
      aria-label="Loading education guide"
      aria-busy="true"
    >
      <div className="w-full max-w-sm space-y-[26px]">
        <div className="space-y-[10px]">
          <Skeleton width="62%" height={14} rounded="rounded-full" />
          <Skeleton width="86%" height={14} rounded="rounded-full" />
          <Skeleton width="74%" height={14} rounded="rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-[10px]">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4"
            >
              <Skeleton width={index === 1 ? '54%' : '68%'} height={12} rounded="rounded-full" />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-[10px] pt-[26px]">
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} width={6} height={6} circle />
          ))}
        </div>
      </div>
    </div>
  );
}
