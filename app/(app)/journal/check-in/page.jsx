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
import { Spinner } from '@/components/ui';

function CheckInContent() {
  const searchParams = useSearchParams();
  const fromBreathwork = searchParams.get('from') === 'breathwork';
  const { user } = useAuth();

  return <BreathworkCheckIn userId={user?.id} fromBreathwork={fromBreathwork} />;
}

export default function CheckInPage() {
  useAuthGuard();

  return (
    <AppLayout showNav={false}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
        <CheckInContent />
      </Suspense>
    </AppLayout>
  );
}
