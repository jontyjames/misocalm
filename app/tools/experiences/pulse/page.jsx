/**
 * Pulse Experience Page
 * A guided recognition about rhythm, and what has carried you.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import PulseGuide from '@/components/composed/experiences/PulseGuide';

export default function PulsePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Spinner size="lg" />
    </div>
  );

  return <PulseGuide />;
}
