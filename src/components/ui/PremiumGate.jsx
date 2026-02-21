/**
 * PremiumGate — wraps premium content with gentle upgrade prompt
 * Never shames, never hard-walls. Language is warm and inviting.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { usePremiumContext } from '@/context/PremiumContext';
import { ROUTES } from '@/lib/constants';

export default function PremiumGate({ children, feature = 'this feature' }) {
  const { isPremium, isLoading } = usePremiumContext();
  const router = useRouter();

  if (isLoading) return null;

  if (isPremium) return children;

  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6 py-16"
      style={{ animation: 'fadeIn 610ms ease-out' }}
    >
      <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mb-6">
        <Sparkles className="w-7 h-7 text-violet-400" />
      </div>

      <h2
        className="text-xl text-white mb-3"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        Part of our deeper collection
      </h2>

      <p className="text-sm text-slate-300 font-light mb-8 max-w-xs">
        {feature} is available with MisoCalm Premium. More tools, more space, more support on your journey.
      </p>

      <button
        onClick={() => router.push(ROUTES.PREMIUM)}
        className="relative px-8 py-4 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms]"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(139,92,246,0.1) 60%, rgba(139,92,246,0.06) 100%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(255,255,255,0.04), 0 0 20px rgba(139,92,246,0.15), 0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        <span
          className="text-white"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Learn more
        </span>
      </button>
    </div>
  );
}
