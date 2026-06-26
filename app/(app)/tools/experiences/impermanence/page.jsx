/**
 * Impermanence Experience Page
 * A guided experiment about sound, and what remains.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { ExperienceLoading } from '@/components/composed/skeletons';

const ImpermanenceGuide = dynamic(
  () => import('@/components/composed/experiences/ImpermanenceGuide'),
  {
    loading: () => <ExperienceLoading />,
    ssr: false,
  }
);

export default function ImpermanencePage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  if (loading || !isAuthenticated) return <ExperienceLoading />;

  return <ImpermanenceGuide />;
}
