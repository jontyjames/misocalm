/**
 * Journal - Check In
 * Gentle emotional check-in after breathwork or standalone
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard } from '@/hooks';
import { AppLayout, BreathworkCheckIn } from '@/components/composed';
import { RouteSkeleton } from '@/components/composed/skeletons';

function CheckInContent() {
  const searchParams = useSearchParams();
  const fromBreathwork = searchParams.get('from') === 'breathwork';
  const { user } = useAuth();

  return <BreathworkCheckIn userId={user?.id} fromBreathwork={fromBreathwork} />;
}

export default function CheckInPage() {
  const { isAuthenticated, loading } = useAuthGuard();

  if (loading || !isAuthenticated) {
    return (
      <AppLayout showNav={false}>
        <RouteSkeleton titleWidth={120} introLines={2} cardCount={3} showFooter />
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <Suspense fallback={<RouteSkeleton titleWidth={120} introLines={2} cardCount={3} showFooter />}>
        <CheckInContent />
      </Suspense>
    </AppLayout>
  );
}
