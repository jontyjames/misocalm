/**
 * Pulse Experience Page
 * A guided recognition about rhythm, and what has carried you.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';
import PulseGuide from '@/components/composed/experiences/PulseGuide';

export default function PulsePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return <PulseGuide />;
}
