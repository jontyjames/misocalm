/**
 * useAnalyticsPageView
 * Automatically tracks page views on route change.
 * Uses Next.js usePathname + useSearchParams.
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { track, EVENTS } from '@/lib/analytics';

export default function useAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPath = useRef(null);

  useEffect(() => {
    // Avoid duplicate tracking on same path
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    track(EVENTS.PAGE_VIEWED, {
      path: pathname,
      search: searchParams?.toString() || '',
      referrer: document.referrer || '',
      title: document.title || '',
    });
  }, [pathname, searchParams]);
}
