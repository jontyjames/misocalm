/**
 * Journal - Deeper Processing
 * Optional emotional processing after a trigger log
 */

'use client';

import { Suspense } from 'react';
import { useAuthGuard } from '@/hooks';
import { AppLayout, DeeperProcessing } from '@/components/composed';
import { RouteSkeleton } from '@/components/composed/skeletons';

function DeeperContent() {
  return <DeeperProcessing />;
}

export default function JournalDeeperPage() {
  const { isAuthenticated, loading } = useAuthGuard();

  if (loading || !isAuthenticated) {
    return (
      <AppLayout showNav={false}>
        <RouteSkeleton titleWidth={130} introLines={2} cardCount={3} showFooter />
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <Suspense fallback={<RouteSkeleton titleWidth={130} introLines={2} cardCount={3} showFooter />}>
        <DeeperContent />
      </Suspense>
    </AppLayout>
  );
}
