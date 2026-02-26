/**
 * DashboardActionCard — sacred glass card with icon, title, and subtitle
 * Used for Today's Practice, Go inward, etc.
 */

'use client';

import { useRouter } from 'next/navigation';
import { SACRED_GLASS_CLASSES, sacredGlassStyle, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE, torusFlowStyle, SOLFEGGIO_RGBA } from '@/lib/sacredGlass';

export default function DashboardActionCard({ href, icon: Icon, iconColor, accent = 'indigo', title, subtitle, className = '' }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`relative overflow-hidden w-full p-5 rounded-xl ${SACRED_GLASS_CLASSES} text-left ${className}`}
      style={sacredGlassStyle(accent)}
    >
      {/* Glass top highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={GLASS_HIGHLIGHT_STYLE} />
      {/* Phi opacity layers */}
      <div className="absolute inset-0 pointer-events-none rounded-xl" style={PHI_LAYERS_STYLE} />
      {/* Torus flow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl" style={torusFlowStyle(accent)} />
      <div className="relative flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl ${iconColor.bg} border ${iconColor.border} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-light mb-0.5">{title}</h2>
          <p className={`text-sm font-light ${iconColor.text}`}>{subtitle}</p>
        </div>
      </div>
    </button>
  );
}
