/**
 * Grounding Experience Page
 * A guided 5-4-3-2-1 sensory grounding practice.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { ExperienceLoading } from '@/components/composed/skeletons';

const GroundingGuide = dynamic(
  () => import('@/components/composed/experiences/GroundingGuide'),
  {
    loading: () => <ExperienceLoading />,
    ssr: false,
  }
);

export default function GroundingPage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  if (loading || !isAuthenticated) return <ExperienceLoading />;

  return <GroundingGuide />;
}
