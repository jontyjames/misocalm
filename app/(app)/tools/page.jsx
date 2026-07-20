/**
 * Tools / Practices Page
 * Thin wrapper: all logic lives in ToolsClient.
 */

'use client';

import dynamic from 'next/dynamic';
import ToolsSkeleton from '@/components/composed/skeletons/ToolsSkeleton';

const ToolsClient = dynamic(
  () => import('@/components/composed/tools/ToolsClient'),
  {
    loading: () => <ToolsSkeleton />,
    ssr: false,
  },
);

export default function ToolsPage() {
  return <ToolsClient />;
}
