/**
 * Journal - Saved (Post-Log Integration)
 * Beautiful page after logging with affirmation + paths forward
 */

'use client';

import { Suspense } from 'react';
import { useAuthGuard } from '@/hooks';
import { AppLayout, PostLogIntegration } from '@/components/composed';
import { RouteSkeleton } from '@/components/composed/skeletons';

function SavedContent() {
  return <PostLogIntegration />;
}

export default function JournalSavedPage() {
  const { isAuthenticated, loading } = useAuthGuard();

  if (loading || !isAuthenticated) {
    return (
      <AppLayout showNav={false}>
        <RouteSkeleton titleWidth={120} introLines={2} cardCount={3} />
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <Suspense fallback={<RouteSkeleton titleWidth={120} introLines={2} cardCount={3} />}>
        <SavedContent />
      </Suspense>
    </AppLayout>
  );
}
