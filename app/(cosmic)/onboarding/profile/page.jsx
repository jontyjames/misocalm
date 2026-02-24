/**
 * Onboarding - Save Your Sanctuary
 * Signup framed as saving progress, value before commitment
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useReducedMotion } from '@/hooks';
import { Button, Input, ProgressDots } from '@/components/ui';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

const TOTAL_ONBOARDING_STEPS = 6;
const CURRENT_STEP = 3;

const CODE_MESSAGE = 'Check your email for a code.';

export default function ProfilePage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const { sendOtp, error: authError, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    setLoading(true);
    clearError();

    // Store data for later (merge with existing to preserve triggers from step 2)
    localStorage.setItem(STORAGE_KEYS.PENDING_EMAIL, email);
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}');
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify({ ...existingData, name }));

    // Send OTP code
    const { error } = await sendOtp(email);

    if (error) {
      setErrors({ submit: error });
      setLoading(false);
    } else {
      setSubmitted(true);
      setTimeout(() => router.push(ROUTES.ONBOARDING_VERIFY), 1597);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="flex items-center justify-center flex-wrap">
          {CODE_MESSAGE.split('').map((char, i) => (
            <span
              key={i}
              className={`text-2xl text-white ${prefersReduced ? '' : 'opacity-0'}`}
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
                animation: prefersReduced ? 'none' : `fadeIn 0.377s ease-out ${i * 0.034}s forwards`,
                width: char === ' ' ? '0.4em' : undefined,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ animation: prefersReduced ? 'none' : 'fadeIn 1.597s ease-out' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <ProgressDots current={CURRENT_STEP} total={TOTAL_ONBOARDING_STEPS} />
      </div>

      {/* Content, centred in available space */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-2xl text-white mb-4"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            Save your sanctuary
          </h1>
          <p className="text-sm text-indigo-400 font-light">
            Keep your progress as you go
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-sm space-y-5">
          <Input
            label="First name"
            placeholder="What should we call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          {/* Error message */}
          {(errors.submit || authError) && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <p className="text-sm text-rose-300">{errors.submit || authError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="text-center pb-4">
        <div className="mb-5">
          <Button
            onClick={handleContinue}
            loading={loading}
            disabled={!name.trim() || !email.trim()}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-slate-300" />
          <p className="text-xs text-slate-300 font-light">
            We'll send a code. No password needed
          </p>
        </div>
      </div>
    </div>
  );
}
