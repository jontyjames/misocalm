/**
 * Alive Experience Page
 * A breath-reactive guided practice that builds a bioluminescent organism from breath.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { ExperienceLoading } from '@/components/composed/skeletons';

const AliveGuide = dynamic(
  () => import('@/components/composed/experiences/AliveGuide'),
  {
    loading: () => <ExperienceLoading />,
    ssr: false,
  }
);

export default function AlivePage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  if (loading || !isAuthenticated) return <ExperienceLoading />;

  return <AliveGuide />;
}
