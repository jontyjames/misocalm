/**
 * Sanctuary Experience Page
 * A breath-reactive guided practice that builds sacred geometry from breath.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { Spinner } from '@/components/ui';

const SanctuaryGuide = dynamic(
  () => import('@/components/composed/experiences/SanctuaryGuide'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <Spinner size="lg" />
      </div>
    ),
    ssr: false,
  }
);

export default function SanctuaryPage() {
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

  return <SanctuaryGuide />;
}
