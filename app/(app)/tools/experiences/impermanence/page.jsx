/**
 * Impermanence Experience Page
 * A guided experiment about sound, and what remains.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useAuthGuard from '@/hooks/useAuthGuard';
import { useNav } from '@/context/NavContext';
import { Spinner } from '@/components/ui';

const ImpermanenceGuide = dynamic(
  () => import('@/components/composed/experiences/ImpermanenceGuide'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <Spinner size="lg" />
      </div>
    ),
    ssr: false,
  }
);

export default function ImpermanencePage() {
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

  return <ImpermanenceGuide />;
}
