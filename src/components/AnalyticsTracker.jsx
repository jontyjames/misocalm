/**
 * AnalyticsTracker
 * Client component that tracks page views across the app.
 * Drop into any layout to enable automatic route tracking.
 */

'use client';

import { Suspense } from 'react';
import useAnalyticsPageView from '@/hooks/useAnalyticsPageView';

function PageViewTracker() {
  useAnalyticsPageView();
  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
