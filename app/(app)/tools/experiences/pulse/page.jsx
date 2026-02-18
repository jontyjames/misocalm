/**
 * Pulse Experience Page
 * A guided recognition about rhythm, and what has carried you.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useAuthGuard from '@/hooks/useAuthGuard';
import { useNav } from '@/context/NavContext';
import { Spinner } from '@/components/ui';

const PulseGuide = dynamic(
  () => import('@/components/composed/experiences/PulseGuide'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <Spinner size="lg" />
      </div>
    ),
    ssr: false,
  }
);

export default function PulsePage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(false);
  }, [setShowNav]);

  if (loading || !isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-void-black">
      <Spinner size="lg" />
    </div>
  );

  return <PulseGuide />;
}
