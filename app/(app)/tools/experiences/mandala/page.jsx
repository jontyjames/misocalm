/**
 * Mandala Experience Page
 * A guided creation about touch, and what is already whole.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { Spinner } from '@/components/ui';

const MandalaGuide = dynamic(
  () => import('@/components/composed/experiences/MandalaGuide'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <Spinner size="lg" />
      </div>
    ),
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

  if (loading || !isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-void-black">
      <Spinner size="lg" />
    </div>
  );

  return <MandalaGuide />;
}
