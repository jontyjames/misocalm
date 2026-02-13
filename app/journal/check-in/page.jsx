/**
 * Journal - Check In
 * Gentle emotional check-in after breathwork or standalone
 */

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout, BreathworkCheckIn } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

function CheckInContent() {
  const searchParams = useSearchParams();
  const fromBreathwork = searchParams.get('from') === 'breathwork';
  const { user } = useAuth();

  return <BreathworkCheckIn userId={user?.id} fromBreathwork={fromBreathwork} />;
}

export default function CheckInPage() {
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
        <CheckInContent />
      </Suspense>
    </AppLayout>
  );
}
