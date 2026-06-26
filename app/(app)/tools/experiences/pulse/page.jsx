/**
 * Pulse Experience Page
 * A guided recognition about rhythm, and what has carried you.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { ExperienceLoading } from '@/components/composed/skeletons';

const PulseGuide = dynamic(
  () => import('@/components/composed/experiences/PulseGuide'),
  {
    loading: () => <ExperienceLoading />,
    ssr: false,
  }
);

export default function PulsePage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  if (loading || !isAuthenticated) return <ExperienceLoading />;

  return <PulseGuide />;
}
