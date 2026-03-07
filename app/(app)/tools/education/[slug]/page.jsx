/**
 * Education Terminal Page
 * Thin wrapper — loads module by slug, hides nav, renders TerminalGuide.
 */

'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuthGuard } from '@/hooks';
import { useNav } from '@/context/NavContext';
import { Spinner } from '@/components/ui';
import { getEducationModule } from '@/lib/educationData';
import { ROUTES } from '@/lib/constants';

const TerminalGuide = dynamic(
  () => import('@/components/composed/education/TerminalGuide'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030712' }}>
        <Spinner size="lg" />
      </div>
    ),
    ssr: false,
  }
);

export default function EducationPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { loading } = useAuthGuard();
  const { setShowNav } = useNav();

  const module = getEducationModule(slug);

  useEffect(() => {
    setShowNav(false);
    return () => setShowNav(true);
  }, [setShowNav]);

  useEffect(() => {
    if (!loading && !module) router.replace(ROUTES.TOOLS);
  }, [loading, module, router]);

  if (loading || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030712' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return <TerminalGuide module={module} />;
}
