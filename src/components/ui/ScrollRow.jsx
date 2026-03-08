/**
 * ScrollRow
 * Horizontal scroll container for card rows.
 * Phi-spaced gap, full-bleed with page-matching padding,
 * overscroll containment to prevent background jitter.
 *
 * Sacred geometry: gap = PHI_SCALE[1] (10px, phi-2).
 * pb-[6px] = PHI_SCALE[0] (phi-1) — room for card shadow/glow.
 */

import { PHI_SCALE } from '@/lib/constants';

export default function ScrollRow({ children, className = '' }) {
  return (
    <div
      className={`flex overflow-x-auto scrollbar-hide -mx-6 px-6 pb-[6px] ${className}`}
      style={{ gap: PHI_SCALE[1], overscrollBehaviorX: 'contain' }}
    >
      {children}
    </div>
  );
}
