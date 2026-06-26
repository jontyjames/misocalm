/**
 * Journal - New Entry
 * Thin wrapper for the log form
 */

'use client';

import { useAuthGuard } from '@/hooks';
import { AppLayout } from '@/components/composed';
import { LogFormContainer } from '@/components/composed';
import { RouteSkeleton } from '@/components/composed/skeletons';

export default function JournalNewPage() {
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
      <LogFormContainer />
    </AppLayout>
  );
}
