/**
 * Onboarding - Plan Summary
 * Shows personalized plan based on assessment
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, MessageCircle, LineChart, BookOpen, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userTriggerService } from '@/services';
import { Button, Card } from '@/components/ui';
import { Starfield, Logo } from '@/components/composed';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

const features = [
  { icon: MessageCircle, text: '24/7 AI support companion' },
  { icon: LineChart, text: 'Track triggers and patterns' },
  { icon: BookOpen, text: 'Evidence-based coping tools' },
  { icon: Users, text: 'Community support (coming soon)' },
];

export default function PlanPage() {
  const router = useRouter();
  const { user, upsertProfile, isAuthenticated, loading: authLoading } = useAuth();
  const [onboardingData, setOnboardingData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}'
    );
    setOnboardingData(data);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleContinue = async () => {
    if (!onboardingData) return;

    setSaving(true);

    // Save profile to database
    await upsertProfile({
      name: onboardingData.name,
      severity_level: onboardingData.severity,
      onboarding_completed: true,
    });

    // Save triggers to database
    if (user?.id && onboardingData.triggers && onboardingData.triggers.length > 0) {
      await userTriggerService.saveUserTriggers(user.id, onboardingData.triggers);
    }

    // Clean up storage
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
    localStorage.removeItem(STORAGE_KEYS.PENDING_EMAIL);

    router.push(ROUTES.DASHBOARD);
  };

  const getSeverityMessage = (level) => {
    if (level <= 3) return 'mild symptoms';
    if (level <= 6) return 'moderate symptoms';
    return 'significant symptoms';
  };

  if (!onboardingData) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Nebula glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-indigo pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nebula-cyan pointer-events-none" />

      <Starfield />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-thin text-white mb-2">
            You're all set, {onboardingData.name}!
          </h1>
          <p className="text-slate-300 font-light mb-8">
            Your personalized plan is ready
          </p>

          {/* Plan card */}
          <Card variant="highlighted" className="text-left mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Logo size="sm" animate={false} />
              <div>
                <p className="text-white font-light">Your MisoMind Plan</p>
                <p className="text-sm text-slate-300">
                  Tailored for {getSeverityMessage(onboardingData.severity)}
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-300 mb-4">
              Based on your assessment (severity {onboardingData.severity}/10),
              we've prepared tools and techniques to help you manage{' '}
              {onboardingData.triggers?.length || 0} trigger sounds.
            </div>

            <div className="pt-4 border-t border-slate-700 space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-sm text-slate-300 font-light">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* CTA */}
          <Button
            onClick={handleContinue}
            loading={saving}
            className="w-full"
            size="lg"
          >
            Try Your First Practice
          </Button>

          {/* Disclaimer */}
          <p className="text-xs text-slate-500 text-center mt-6 font-light">
            MisoMind is a wellness tool, not a substitute for professional mental health support.
          </p>
        </div>
      </div>
    </div>
  );
}
