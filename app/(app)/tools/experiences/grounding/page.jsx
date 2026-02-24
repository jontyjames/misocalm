/**
 * Grounding Experience Page
 * A guided 5-4-3-2-1 sensory grounding practice.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useAuthGuard from '@/hooks/useAuthGuard';
import { useNav } from '@/context/NavContext';
import { Spinner } from '@/components/ui';

const GroundingGuide = dynamic(
  () => import('@/components/composed/experiences/GroundingGuide'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <Spinner size="lg" />
      </div>
    ),
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

  if (loading || !isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-void-black">
      <Spinner size="lg" />
    </div>
  );

  return <GroundingGuide />;
}
