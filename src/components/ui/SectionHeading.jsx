/**
 * SectionHeading
 * Josefin Sans 200-weight section title with solfeggio-coloured glow.
 * Used above ScrollRow sections on the Practices page.
 *
 * Sacred geometry: marginBottom = PHI_SCALE[1] (10px, phi-2).
 * textShadow spread = 16px (PHI_SCALE[2], phi-3).
 */

import { PHI_SCALE } from '@/lib/constants';

export default function SectionHeading({ children, glowColor = 'rgba(99,102,241,0.3)' }) {
  return (
    <h2
      className="text-lg text-white"
      style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontWeight: 200,
        marginBottom: PHI_SCALE[1],
        textShadow: `0 0 ${PHI_SCALE[2]}px ${glowColor}`,
      }}
    >
      {children}
    </h2>
  );
}
