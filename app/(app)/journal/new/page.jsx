/**
 * Journal - New Entry
 * Thin wrapper for the log form
 */

'use client';

import { useAuthGuard } from '@/hooks';
import { AppLayout } from '@/components/composed';
import { LogFormContainer } from '@/components/composed';

export default function JournalNewPage() {
  useAuthGuard();

  return (
    <AppLayout showNav={false}>
      <LogFormContainer />
    </AppLayout>
  );
}
