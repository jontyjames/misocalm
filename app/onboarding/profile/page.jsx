/**
 * Onboarding - Profile Setup
 * User enters name and email
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card } from '@/components/ui';
import { Starfield } from '@/components/composed';
import { ROUTES, STORAGE_KEYS, ATTRIBUTION_OPTIONS } from '@/lib/constants';

export default function ProfilePage() {
  const router = useRouter();
  const { sendMagicLink, error: authError, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attribution, setAttribution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    // Store data for later
    localStorage.setItem(STORAGE_KEYS.PENDING_EMAIL, email);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify({ name, attribution }));

    // Send magic link
    const { error } = await sendMagicLink(email);

    if (error) {
      setErrors({ submit: error });
      setLoading(false);
    } else {
      router.push(ROUTES.ONBOARDING_VERIFY);
    }
  };

  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Nebula glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nebula-cyan pointer-events-none" />

      <Starfield />

      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8 animate-fade-in" style={{ animation: 'fadeIn 0.8s ease-out' }}>
        {/* Back button */}
        <button
          onClick={() => router.push(ROUTES.HOME)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-light">Back</span>
        </button>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-3xl font-thin text-white mb-2">
            Let's get to know you
          </h1>
          <p className="text-slate-300 font-light mb-8">
            We'll use this to personalize your experience
          </p>

          {/* Form */}
          <div className="space-y-6">
            <Input
              label="Your name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input.Select
              label="How did you find MisoMind?"
              value={attribution}
              onChange={(e) => setAttribution(e.target.value)}
              options={ATTRIBUTION_OPTIONS}
              placeholder="Select an option..."
            />

            {/* Privacy notice */}
            <Card className="mt-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-light text-white">
                    Your privacy matters
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    We'll never share your data. Your trigger logs and personal
                    information stay private and secure.
                  </p>
                </div>
              </div>
            </Card>

            {/* Error message */}
            {(errors.submit || authError) && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <p className="text-sm text-rose-300">{errors.submit || authError}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              onClick={handleContinue}
              loading={loading}
              disabled={!name.trim() || !email.trim()}
              className="w-full mt-8"
              size="lg"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
