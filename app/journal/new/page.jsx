/**
 * Journal - New Entry
 * Thin wrapper for the log form
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/composed';
import { LogFormContainer } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

export default function JournalNewPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  return (
    <AppLayout showNav={false}>
      <LogFormContainer />
    </AppLayout>
  );
}
