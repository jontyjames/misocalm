/**
 * Journal - Deeper Processing
 * Optional emotional processing after a trigger log
 */

'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppLayout, DeeperProcessing } from '@/components/composed';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

function DeeperContent() {
  return <DeeperProcessing />;
}

export default function JournalDeeperPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  return (
    <AppLayout showNav={false}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
        <DeeperContent />
      </Suspense>
    </AppLayout>
  );
}
