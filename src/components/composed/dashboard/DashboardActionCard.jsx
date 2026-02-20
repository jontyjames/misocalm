/**
 * DashboardActionCard — sacred glass card with icon, title, and subtitle
 * Used for Today's Practice, Go inward, etc.
 */

'use client';

import { useRouter } from 'next/navigation';

export default function DashboardActionCard({ href, icon: Icon, iconColor, accentRgba, title, subtitle, className = '' }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`relative overflow-hidden w-full p-5 rounded-xl border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms] text-left ${className}`}
      style={{
        background: `linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, ${accentRgba}0.08) 100%)`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px ${accentRgba}0.12), 0 4px 20px rgba(0,0,0,0.25)`,
      }}
    >
      {/* Glass top highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
      {/* Phi opacity layers */}
      <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
      {/* Torus flow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${accentRgba}0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, ${accentRgba}0.06) 0%, transparent 60%)` }} />
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
