/**
 * TerminalBackButton
 * Fixed top-left back button for terminal education screens.
 */

'use client';

import { ChevronLeft } from 'lucide-react';
import { MONO, PHI_SCALE } from '@/lib/constants';

export default function TerminalBackButton({ onClick, visible = true }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="fixed top-0 left-0 flex items-center safe-area-top"
      style={{
        padding: PHI_SCALE[2],
        gap: PHI_SCALE[0],
        fontSize: 13,
        ...MONO,
        color: 'rgba(148,163,184,0.6)',
        opacity: visible ? 0.4 : 0,
        transition: 'opacity 610ms ease',
        zIndex: 51,
        background: 'rgba(3,7,18,0.4)',
        borderRadius: `0 0 ${PHI_SCALE[1]}px 0`,
        minHeight: 44,
      }}
    >
      <ChevronLeft className="w-4 h-4" />
      back
    </button>
  );
}
