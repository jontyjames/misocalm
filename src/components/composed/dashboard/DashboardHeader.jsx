/**
 * DashboardHeader — logo + profile avatar button
 */

'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function DashboardHeader({ profileName }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-end gap-2">
        <img
          src="/icons/MisoCalm-logo-v1.png"
          alt="MisoCalm"
          className="w-5 h-5 translate-y-[-3px]"
        />
        <span
          className="text-xl text-white leading-none"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          MisoCalm
        </span>
      </div>
      <button
        onClick={() => router.push(ROUTES.PROFILE)}
        aria-label="View profile"
        className="w-11 h-11 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-500/30 transition-all duration-[233ms]"
      >
        <span
          className="text-sm text-indigo-300 leading-none"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}
        >
          {profileName?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </button>
    </div>
  );
}
