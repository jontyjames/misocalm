/**
 * Onboarding - Trigger Assessment
 * User rates severity and selects triggers
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Info, X, Heart, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Slider } from '@/components/ui';
import { Starfield, TriggerGrid } from '@/components/composed';
import { ROUTES, STORAGE_KEYS, DEFAULT_TRIGGERS, MISOPHONIA_LEVELS } from '@/lib/constants';

export default function AssessmentPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [severity, setSeverity] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [allTriggers, setAllTriggers] = useState(DEFAULT_TRIGGERS);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleToggleTrigger = (trigger) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleAddCustomTrigger = () => {
    const trimmed = customTrigger.trim();
    if (trimmed && !allTriggers.includes(trimmed)) {
      setAllTriggers((prev) => [...prev, trimmed]);
      setSelectedTriggers((prev) => [...prev, trimmed]);
      setCustomTrigger('');
    }
  };

  const handleContinue = (skipSupportCheck = false) => {
    // Show support modal for high severity (9-10) before continuing
    if (!skipSupportCheck && severity >= 9) {
      setShowSupportModal(true);
      return;
    }

    // Store assessment data
    const existingData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}'
    );
    localStorage.setItem(
      STORAGE_KEYS.ONBOARDING_DATA,
      JSON.stringify({
        ...existingData,
        severity,
        triggers: selectedTriggers,
      })
    );
    router.push(ROUTES.ONBOARDING_PLAN);
  };

  if (authLoading) {
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

      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-light">Back</span>
        </button>

        {/* Content */}
        <div className="flex-1 max-w-md mx-auto w-full">
          <h1 className="text-3xl font-thin text-white mb-2">
            Tell us about your experience
          </h1>
          <p className="text-slate-300 font-light mb-8">
            This helps us personalize your support
          </p>

          {/* Severity Slider */}
          <div className="mb-10">
            <h2 className="text-lg font-light text-white mb-4">
              What's your typical response level?
            </h2>
            <Slider
              value={severity}
              onChange={setSeverity}
              min={0}
              max={10}
              leftLabel="0"
              rightLabel="10"
            />

            {/* Dynamic level description */}
            {(() => {
              const level = MISOPHONIA_LEVELS[severity];
              const colorClasses = {
                emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
                rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
              };
              return (
                <div className={`mt-4 p-3 rounded-lg border ${colorClasses[level.color]}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Level {level.level}: {level.label}</span>
                  </div>
                  <p className="text-sm text-slate-300 font-light">{level.description}</p>
                </div>
              );
            })()}

            {/* View all levels button */}
            <button
              onClick={() => setShowLevelsModal(true)}
              className="mt-3 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Info className="w-4 h-4" />
              View all response levels
            </button>
          </div>

          {/* Trigger Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-light text-white mb-4">
              Which sounds trigger you?
            </h2>
            <p className="text-sm text-slate-400 font-light mb-4">
              Select all that apply
            </p>

            <TriggerGrid
              triggers={allTriggers}
              selected={selectedTriggers}
              onToggle={handleToggleTrigger}
            />

            {/* Add custom trigger */}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Add a custom trigger..."
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTrigger()}
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={handleAddCustomTrigger}
                disabled={!customTrigger.trim()}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Continue button */}
          <Button
            onClick={handleContinue}
            disabled={selectedTriggers.length === 0}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Misophonia Levels Modal */}
      {showLevelsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLevelsModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-light text-white">Misophonia Response Levels</h2>
              <button
                onClick={() => setShowLevelsModal(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              <p className="text-sm text-slate-400 font-light mb-4">
                These levels help describe the intensity of your misophonia response, from no discomfort to crisis level.
              </p>

              <div className="space-y-3">
                {MISOPHONIA_LEVELS.map((level) => {
                  const colorClasses = {
                    emerald: 'border-emerald-500/30 bg-emerald-500/5',
                    amber: 'border-amber-500/30 bg-amber-500/5',
                    orange: 'border-orange-500/30 bg-orange-500/5',
                    rose: 'border-rose-500/30 bg-rose-500/5',
                  };
                  const textClasses = {
                    emerald: 'text-emerald-400',
                    amber: 'text-amber-400',
                    orange: 'text-orange-400',
                    rose: 'text-rose-400',
                  };
                  return (
                    <div
                      key={level.level}
                      className={`p-3 rounded-lg border ${colorClasses[level.color]}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${textClasses[level.color]}`}>
                          Level {level.level}
                        </span>
                        <span className="text-white font-light">- {level.label}</span>
                      </div>
                      <p className="text-sm text-slate-400 font-light">{level.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Header with heart icon */}
            <div className="p-6 text-center border-b border-slate-700">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
              <h2 className="text-xl font-light text-white mb-2">You're not alone</h2>
              <p className="text-slate-300 font-light">
                Living with intense misophonia responses can be incredibly challenging.
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-300 font-light">
                We're glad you're here. MisoMind is designed to support you on your journey.
                If you're currently struggling, please know that help is available.
              </p>

              {/* Support options */}
              <div className="space-y-3">
                <a
                  href="tel:988"
                  className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors"
                >
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-white font-light">Crisis Helpline</p>
                    <p className="text-xs text-slate-400">Call or text 988 (US)</p>
                  </div>
                </a>
              </div>

              <p className="text-xs text-slate-400 font-light text-center">
                MisoMind includes breathing exercises, coping tools, and AI support to help you build resilience.
              </p>

              {/* Continue button */}
              <div className="pt-4 border-t border-slate-800">
                <Button
                  onClick={() => {
                    setShowSupportModal(false);
                    handleContinue(true);
                  }}
                  className="w-full"
                  size="lg"
                >
                  Continue to MisoMind
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
