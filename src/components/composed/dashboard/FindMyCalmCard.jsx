/**
 * FindMyCalmCard — the sanctuary's heart
 * Hero button with ambient glow, sacred glass layers, and solfeggio breathing
 */

'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function FindMyCalmCard() {
  const router = useRouter();

  return (
    <div className="relative w-full" style={{ marginBottom: '26px' }}>
      {/* Ambient glow — toroidal field */}
      <div
        className="absolute rounded-3xl pointer-events-none"
        style={{
          top: '-2rem', bottom: '-2rem', left: '-1.5rem', right: '-1.5rem',
          background: 'radial-gradient(ellipse 90% 140% at center, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 45%, transparent 70%)',
          filter: 'blur(24px)',
          animation: 'glow-breathe 7.1s ease-in-out infinite',
        }}
      />
      <button
        onClick={() => router.push(ROUTES.CALM)}
        className="
          relative w-full py-8 rounded-2xl overflow-hidden
          border border-white/[0.18]
          backdrop-blur-xl
          transition-all duration-[610ms]
          hover:border-white/30
        "
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(139,92,246,0.08) 60%, rgba(99,102,241,0.06) 100%)',
          boxShadow: `
            inset 0 1px 0 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 0 rgba(255,255,255,0.04),
            0 0 30px rgba(139,92,246,0.15),
            0 8px 32px rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* Glass highlight */}
        <div
          className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 70%, transparent 95%)',
          }}
        />
        {/* Phi opacity layers */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
          }}
        />
        {/* Torus flow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 40% at 50% 110%, rgba(99,102,241,0.06) 0%, transparent 60%)',
          }}
        />
        {/* Solfeggio breathing — violet 852Hz */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse 120% 80% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)',
            backgroundSize: '100% 200%',
            animation: 'solfeggio-breathe-852 3.7s ease-in-out infinite',
          }}
        />
        {/* Slow shimmer */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 60%, transparent 70%)',
            backgroundSize: '250% 100%',
            animation: 'shimmer 13s ease-in-out infinite',
          }}
        />
        <span
          className="relative block text-2xl text-white mb-2"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            letterSpacing: '0.04em',
          }}
        >
          Find my calm
        </span>
        <span className="relative block text-sm text-slate-300 font-light">
          A guided breathing practice, ready when you are
        </span>
      </button>
    </div>
  );
}
