'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/composed/AppLayout';
import RouteSkeleton from '@/components/composed/skeletons/RouteSkeleton';

function RegulationPracticeFallback() {
  return (
    <AppLayout showNav={false}>
      <RouteSkeleton titleWidth={170} introLines={2} cardCount={3} />
    </AppLayout>
  );
}

const RegulationPracticeClient = dynamic(
  () => import('@/components/composed/regulation/RegulationPracticeClient'),
  {
    loading: () => <RegulationPracticeFallback />,
    ssr: false,
  },
);

export default function RegulationPracticePage() {
  const params = useParams();
  return <RegulationPracticeClient practiceId={params.practiceId} />;
}
