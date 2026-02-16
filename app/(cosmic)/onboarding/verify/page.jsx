/**
 * Onboarding - Verify Email
 * User enters 6-digit OTP code sent to their email
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, ProgressDots } from '@/components/ui';
import { Logo } from '@/components/composed';
import { ROUTES, STORAGE_KEYS, FIBONACCI_TIMING } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 4;
const CODE_LENGTH = 6;

export default function VerifyPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp, isAuthenticated, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [localError, setLocalError] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem(STORAGE_KEYS.PENDING_EMAIL);
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push(ROUTES.ONBOARDING_PROFILE);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.ONBOARDING_ASSESSMENT);
    }
  }, [isAuthenticated, router]);

  const handleInput = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setLocalError(null);
    clearError();

    // Auto-advance to next input
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (digit && index === CODE_LENGTH - 1 && next.every(d => d)) {
      submitCode(next.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;

    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setCode(next);

    if (pasted.length === CODE_LENGTH) {
      submitCode(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const submitCode = async (token) => {
    if (!email || verifying) return;
    setVerifying(true);
    setLocalError(null);

    const { error } = await verifyOtp(email, token);

    if (error) {
      setLocalError('That code didn\'t work. Check your email and try again.');
      setVerifying(false);
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
    // On success, onAuthStateChange fires and isAuthenticated redirects
  };

  const handleResend = async () => {
    setResending(true);
    setLocalError(null);
    clearError();
    await sendOtp(email);
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  const handleUseDifferentEmail = () => {
    localStorage.removeItem(STORAGE_KEYS.PENDING_EMAIL);
    router.push(ROUTES.ONBOARDING_PROFILE);
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: 'fadeIn 1.6s ease-out' }}>
      <div className="flex items-center justify-between mb-6">
        <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-10">
          <Logo size="lg" />
        </div>

        <h1
          className="text-2xl text-white mb-4"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Enter your code
        </h1>

        <p className="text-sm text-slate-200 font-light mb-1">
          We sent a code to
        </p>
        <p className="text-sm text-indigo-400 font-light mb-8">
          {email}
        </p>

        {/* 6-digit code input */}
        <div className="flex gap-3 mb-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={verifying}
              aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
              className="w-11 h-14 text-center text-base font-light rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:border-indigo-500/50 focus:outline-none transition-colors duration-[233ms]"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            />
          ))}
        </div>

        {displayError && (
          <p
            className="text-sm text-slate-300 font-light mb-4"
            style={{ animation: `fadeIn ${FIBONACCI_TIMING.flow}ms ease-out` }}
          >
            {displayError}
          </p>
        )}

        {verifying && (
          <p className="text-sm text-slate-300 font-light">
            Checking...
          </p>
        )}
      </div>

      <div className="text-center pb-4">
        <div className="mb-4">
          <Button
            variant="secondary"
            onClick={handleResend}
            loading={resending}
            className="w-full"
            size="lg"
          >
            {resent ? 'Code sent!' : 'Resend code'}
          </Button>
        </div>
        <p className="text-xs text-slate-300 font-light mb-4">
          Check your spam folder if you don't see it
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
