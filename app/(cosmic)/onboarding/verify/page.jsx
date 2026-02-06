/**
 * Onboarding - Verify Email
 * Waiting screen while user checks inbox for magic link
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { Logo } from '@/components/composed';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 4;

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${i + 1 === current
              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
              : i + 1 < current
                ? 'bg-cyan-400/50'
                : 'bg-slate-700'
            }
          `}
        />
      ))}
    </div>
  );
}

export default function VerifyPage() {
  const router = useRouter();
  const { sendMagicLink, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem(STORAGE_KEYS.PENDING_EMAIL);
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push(ROUTES.ONBOARDING_PROFILE);
    }
  }, [router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.ONBOARDING_ASSESSMENT);
    }
  }, [isAuthenticated, router]);

  const handleResend = async () => {
    setResending(true);
    await sendMagicLink(email);
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  const handleUseDifferentEmail = () => {
    localStorage.removeItem(STORAGE_KEYS.PENDING_EMAIL);
    router.push(ROUTES.ONBOARDING_PROFILE);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.6s ease-out' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
      </div>

      {/* Content — centred */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Pulsing logo */}
        <div className="mb-10 animate-pulse">
          <Logo size="lg" />
        </div>

        {/* Header */}
        <h1
          className="text-2xl text-white mb-4"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Check your inbox
        </h1>

        <p className="text-sm text-slate-200 font-light mb-1">
          We've sent a magic link to
        </p>
        <p className="text-sm text-indigo-400 font-light mb-8">
          {email}
        </p>

        <p className="text-sm text-slate-300 font-light leading-relaxed">
          Tap the link in your email to continue
        </p>
      </div>

      {/* Bottom section */}
      <div className="text-center pb-4">
        <div className="mb-4">
          <Button
            variant="secondary"
            onClick={handleResend}
            loading={resending}
            className="w-full"
            size="lg"
          >
            {resent ? 'Link sent!' : 'Resend link'}
          </Button>
        </div>
        <p className="text-xs text-slate-300 font-light mb-4">
          Didn't receive it? Check your spam folder
        </p>
        <button
          onClick={handleUseDifferentEmail}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}
