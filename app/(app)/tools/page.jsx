/**
 * Tools / Practices Page
 * Thin wrapper — all logic lives in ToolsClient.
 */

'use client';

import dynamic from 'next/dynamic';

const ToolsClient = dynamic(
  () => import('@/components/composed/tools/ToolsClient'),
  { ssr: false },
);

export default function ToolsPage() {
  return <ToolsClient />;
}
