/**
 * Journal - Saved (Post-Log Integration)
 * Beautiful page after logging with affirmation + paths forward
 */

'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppLayout, PostLogIntegration } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

function SavedContent() {
  return <PostLogIntegration />;
}

export default function JournalSavedPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  return (
    <AppLayout showNav={false}>
      <Suspense>
        <SavedContent />
      </Suspense>
    </AppLayout>
  );
}
