/**
 * Journal - Saved (Post-Log Integration)
 * Beautiful page after logging with affirmation + paths forward
 */

'use client';

import { Suspense } from 'react';
import { useAuthGuard } from '@/hooks';
import { AppLayout, PostLogIntegration } from '@/components/composed';
import { Spinner } from '@/components/ui';

function SavedContent() {
  return <PostLogIntegration />;
}

export default function JournalSavedPage() {
  useAuthGuard();

  return (
    <AppLayout showNav={false}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
        <SavedContent />
      </Suspense>
    </AppLayout>
  );
}
