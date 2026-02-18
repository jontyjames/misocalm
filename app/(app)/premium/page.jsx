/**
 * Premium Page — calm, no-pressure upgrade page
 * Single tier, simple pricing, Sacred Glass styling
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Sparkles, MessageCircle, BarChart3, Timer, Palette, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePremiumContext } from '@/context/PremiumContext';
import { supabase } from '@/services/supabase';
import { AppLayout } from '@/components/composed';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

const FEATURES = [
  { icon: MessageCircle, label: 'AI companion chat', description: 'Talk through difficult moments with Miso' },
  { icon: BarChart3, label: 'Pattern insights', description: 'See your journey through a deeper lens' },
  { icon: Timer, label: 'Custom timers', description: 'Longer durations and custom intervals' },
  { icon: Palette, label: 'Richer ambience', description: 'Parallax stars and ambient particles' },
];

function PremiumContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isPremium, subscription, isLoading } = usePremiumContext();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [manageLoading, setManageLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const success = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      if (!res.ok) throw new Error('Checkout request failed');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.url) throw new Error('No checkout URL returned');
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout failed:', err);
      setCheckoutError('Something went wrong opening checkout. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const handleManage = async () => {
    setCheckoutError(null);
    setManageLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: '{}',
      });
      if (!res.ok) throw new Error('Portal request failed');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.url) throw new Error('No portal URL returned');
      window.location.href = data.url;
    } catch (err) {
      console.error('Portal failed:', err);
      setCheckoutError('Something went wrong opening the portal. Please try again.');
      setManageLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ animation: 'fadeIn 610ms ease-out' }}
    >
      {/* Back */}
      <button
        onClick={() => router.push(ROUTES.DASHBOARD)}
        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-[233ms] mb-10"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-light">Back</span>
      </button>

      {/* Success message */}
      {success && (
        <div
          className="mb-8 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10"
          style={{ animation: 'fadeIn 377ms ease-out' }}
        >
          <p className="text-sm text-emerald-300 font-light">
            Welcome to Premium. Your deeper journey begins here.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-violet-400" />
        </div>
        <h1
          className="text-3xl text-white mb-2"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          MisoCalm Premium
        </h1>
        <p className="text-slate-300 font-light">
          More space for your journey
        </p>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-10">
        {FEATURES.map(({ icon: Icon, label, description }) => (
          <div
            key={label}
            className="relative p-4 rounded-xl overflow-hidden border border-white/[0.12] backdrop-blur-xl"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, rgba(139,92,246,0.04) 100%)',
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-white font-light mb-0.5">{label}</h3>
                <p className="text-sm text-slate-300 font-light">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Free tier note */}
      <div className="mb-8 text-center">
        <p className="text-xs text-slate-400 font-light">
          Breathing practices, basic journaling, and crisis resources are always free.
        </p>
      </div>

      {/* CTA */}
      <div className="max-w-xs mx-auto">
        {isPremium ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-light">You have Premium</span>
            </div>
            <button
              onClick={handleManage}
              disabled={manageLoading}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-light disabled:opacity-50"
            >
              {manageLoading ? 'Opening portal...' : 'Manage subscription'}
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || isLoading}
              className="relative w-full py-4 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms] disabled:opacity-50"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(139,92,246,0.12) 60%, rgba(139,92,246,0.06) 100%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(255,255,255,0.04), 0 0 20px rgba(139,92,246,0.2), 0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
              <span
                className="text-white"
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
              >
                {checkoutLoading ? 'Opening checkout...' : 'Start Premium'}
              </span>
            </button>
            {checkoutError && (
              <p
                className="text-sm text-slate-300 font-light mt-4 text-center"
                style={{ animation: 'fadeIn 0.377s ease-out' }}
              >
                {checkoutError}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PremiumPage() {
  return (
    <AppLayout showNav={false}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
        <PremiumContent />
      </Suspense>
    </AppLayout>
  );
}
