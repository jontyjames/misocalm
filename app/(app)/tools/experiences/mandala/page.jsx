/**
 * Mandala Experience Page
 * A guided creation about touch, and what is already whole.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { ExperienceLoading } from '@/components/composed/skeletons';

const MandalaGuide = dynamic(
  () => import('@/components/composed/experiences/MandalaGuide'),
  {
    loading: () => <ExperienceLoading />,
    ssr: false,
  }
);

export default function MandalaPage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  if (loading || !isAuthenticated) return <ExperienceLoading />;

  return <MandalaGuide />;
}
