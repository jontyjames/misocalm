/**
 * Focus Experience Page
 * A guided attentional training practice with expanding mandala tunnel.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { ExperienceLoading } from '@/components/composed/skeletons';

const FocusGuide = dynamic(
  () => import('@/components/composed/experiences/FocusGuide'),
  {
    loading: () => <ExperienceLoading />,
    ssr: false,
  }
);

export default function FocusPage() {
  const { isAuthenticated, loading } = useAuthGuard();
  const { setShowNav } = useNav();

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  if (loading || !isAuthenticated) return <ExperienceLoading />;

  return <FocusGuide />;
}
