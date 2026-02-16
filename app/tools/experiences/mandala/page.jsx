/**
 * Mandala Experience Page
 * A guided creation about touch, and what is already whole.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

const MandalaGuide = dynamic(
  () => import('@/components/composed/experiences/MandalaGuide'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    ),
    ssr: false,
  }
);

export default function MandalaPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Spinner size="lg" />
    </div>
  );

  return <MandalaGuide />;
}
