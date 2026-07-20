'use client';

import dynamic from 'next/dynamic';
import AppLayout from '@/components/composed/AppLayout';
import RouteSkeleton from '@/components/composed/skeletons/RouteSkeleton';

function RegulationToolkitFallback() {
  return (
    <AppLayout>
      <RouteSkeleton titleWidth={190} introLines={2} cardCount={3} showHero />
    </AppLayout>
  );
}

const RegulationToolkitClient = dynamic(
  () => import('@/components/composed/regulation/RegulationToolkitClient'),
  {
    loading: () => <RegulationToolkitFallback />,
    ssr: false,
  },
);

export default function RegulationToolkitPage() {
  return <RegulationToolkitClient />;
}
