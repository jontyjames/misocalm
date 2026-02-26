/**
 * Journal - Deeper Processing
 * Optional emotional processing after a trigger log
 */

'use client';

import { Suspense } from 'react';
import { useAuthGuard } from '@/hooks';
import { AppLayout, DeeperProcessing } from '@/components/composed';
import { Spinner } from '@/components/ui';

function DeeperContent() {
  return <DeeperProcessing />;
}

export default function JournalDeeperPage() {
  useAuthGuard();

  return (
    <AppLayout showNav={false}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
        <DeeperContent />
      </Suspense>
    </AppLayout>
  );
}
