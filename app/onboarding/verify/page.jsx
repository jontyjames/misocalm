/**
 * Onboarding - Email Verification
 * Shows "Check your email" message
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { Starfield } from '@/components/composed';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

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
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Nebula glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nebula-cyan pointer-events-none" />

      <Starfield />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-indigo-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-thin text-white mb-4">
            Check your email
          </h1>

          {/* Description */}
          <p className="text-slate-300 font-light mb-2">
            We sent a magic link to
          </p>
          <p className="text-white font-light mb-8">
            {email}
          </p>

          <p className="text-sm text-slate-400 font-light mb-8">
            Click the link in your email to continue setting up your account.
            The link will expire in 1 hour.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              variant="secondary"
              onClick={handleResend}
              loading={resending}
              className="w-full"
            >
              {resent ? (
                'Email sent!'
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend email
                </>
              )}
            </Button>

            <button
              onClick={handleUseDifferentEmail}
              className="text-sm text-slate-400 hover:text-white transition-colors font-light"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
