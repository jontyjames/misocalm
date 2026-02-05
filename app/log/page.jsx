/**
 * Trigger Log Page
 * Log a trigger event with details
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info, X, Plus, Clock, Heart, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { triggerLogService, streakService, userTriggerService } from '@/services';
import { Button, Input, Slider, Checkbox, Card, Spinner } from '@/components/ui';
import { AppLayout, TriggerGrid } from '@/components/composed';
import { ROUTES, SOURCE_OPTIONS, RESPONSE_OPTIONS, DEFAULT_TRIGGERS, STORAGE_KEYS, MISOPHONIA_LEVELS } from '@/lib/constants';
import { track, EVENTS } from '@/lib/analytics';

export default function LogPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading } = useAuth();

  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [source, setSource] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [location, setLocation] = useState('');
  const [response, setResponse] = useState('');
  const [otherResponse, setOtherResponse] = useState('');
  const [notes, setNotes] = useState('');
  const [wantsSupport, setWantsSupport] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // New features
  const [customTrigger, setCustomTrigger] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [triggerTime, setTriggerTime] = useState('now');
  const [customTime, setCustomTime] = useState('');

  // User's triggers - merge custom triggers from assessment with defaults
  const [userTriggers, setUserTriggers] = useState(DEFAULT_TRIGGERS);
  const [triggerStats, setTriggerStats] = useState(null);

  // Load user's triggers from database and sort by frequency
  useEffect(() => {
    const loadTriggers = async () => {
      if (!user?.id) return;

      // Get trigger frequency stats
      const { stats } = await triggerLogService.getStats(user.id, 90);
      if (stats) {
        setTriggerStats(stats);
      }

      // Try to load from database first
      const { data: dbTriggers } = await userTriggerService.getUserTriggers(user.id);

      let allTriggers = [...DEFAULT_TRIGGERS];

      if (dbTriggers && dbTriggers.length > 0) {
        // User has triggers in database - use those plus remaining defaults
        const userTriggerNames = dbTriggers.map(t => t.name);
        const remainingDefaults = DEFAULT_TRIGGERS.filter(
          (t) => !userTriggerNames.includes(t)
        );
        allTriggers = [...userTriggerNames, ...remainingDefaults];
      } else {
        // Fallback to localStorage (for users who onboarded before DB save)
        const onboardingData = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA) || '{}'
        );
        if (onboardingData.triggers && onboardingData.triggers.length > 0) {
          const userSelected = onboardingData.triggers;
          const remainingDefaults = DEFAULT_TRIGGERS.filter(
            (t) => !userSelected.includes(t)
          );
          allTriggers = [...userSelected, ...remainingDefaults];
        }
      }

      // Sort by frequency (most used first)
      if (stats?.triggerCounts) {
        allTriggers.sort((a, b) => {
          const countA = stats.triggerCounts[a] || 0;
          const countB = stats.triggerCounts[b] || 0;
          return countB - countA;
        });
      }

      setUserTriggers(allTriggers);
    };

    loadTriggers();
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  const handleToggleTrigger = (trigger) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleAddCustomTrigger = async () => {
    const trimmed = customTrigger.trim();
    if (!trimmed || userTriggers.includes(trimmed)) {
      setCustomTrigger('');
      setShowCustomInput(false);
      return;
    }

    // Add to local list immediately
    setUserTriggers((prev) => [trimmed, ...prev]);
    setSelectedTriggers((prev) => [...prev, trimmed]);
    setCustomTrigger('');
    setShowCustomInput(false);

    // Save to database in background
    if (user?.id) {
      await userTriggerService.addCustomTrigger(user.id, trimmed);
    }
  };

  const handleSave = async (skipSupportCheck = false) => {
    if (selectedTriggers.length === 0) return;

    // Show support modal for high intensity (9-10) before saving
    if (!skipSupportCheck && intensity >= 9) {
      setShowSupportModal(true);
      return;
    }

    setSaving(true);
    setError(null);

    // Determine timestamp
    const timestamp = triggerTime === 'earlier' && customTime
      ? new Date(customTime).toISOString()
      : new Date().toISOString();

    // Save to database via service
    const { error: saveError } = await triggerLogService.create({
      user_id: user.id,
      triggers: selectedTriggers,
      source,
      intensity,
      location,
      response: response === 'other' ? otherResponse : response,
      notes,
      wanted_support: wantsSupport,
      created_at: timestamp,
    });

    if (saveError) {
      setError(saveError);
      setSaving(false);
      return;
    }

    // Record activity for streak
    await streakService.recordActivity(user.id);

    // Track analytics event
    track(EVENTS.TRIGGER_LOGGED, {
      triggerCount: selectedTriggers.length,
      intensity,
      source,
      wantsSupport,
    });

    setSaving(false);

    if (wantsSupport) {
      router.push(ROUTES.LOG_SUPPORT);
    } else {
      router.push(ROUTES.LOG_SUCCESS);
    }
  };

  if (loading) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" className="text-indigo-400" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="px-6 py-8 pb-32">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-thin text-white">Log a Trigger</h1>
        </div>

        {/* Trigger Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-light text-white mb-2">
            What triggered you?
          </h2>
          <p className="text-sm text-slate-400 font-light mb-4">
            Select all that apply
          </p>
          <TriggerGrid
            triggers={userTriggers}
            selected={selectedTriggers}
            onToggle={handleToggleTrigger}
          />

          {/* Add custom trigger */}
          {showCustomInput ? (
            <div className="flex gap-2 mt-4 animate-fade-in-up">
              <Input
                placeholder="Enter custom trigger..."
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTrigger()}
                autoFocus
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { setShowCustomInput(false); setCustomTrigger(''); }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomInput(true)}
              className="mt-4 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add custom trigger
            </button>
          )}
        </div>

        {/* When did this happen? */}
        <div className="mb-6">
          <label className="text-sm font-light text-slate-300 mb-3 block">
            When did this happen?
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setTriggerTime('now')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-light transition-all ${
                triggerTime === 'now'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              Just now
            </button>
            <button
              onClick={() => setTriggerTime('earlier')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-light transition-all flex items-center justify-center gap-2 ${
                triggerTime === 'earlier'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Clock className="w-4 h-4" />
              Earlier
            </button>
          </div>
          {triggerTime === 'earlier' && (
            <div className="mt-3 animate-fade-in-up">
              <Input
                type="datetime-local"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Source */}
        <div className="mb-6">
          <Input.Select
            label="Who or what was the source?"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            options={SOURCE_OPTIONS}
            placeholder="Select source..."
          />
        </div>

        {/* Intensity / Response Level */}
        <div className="mb-6">
          <label className="text-sm font-light text-slate-300 mb-3 block">
            What was your response level?
          </label>

          <Slider
            value={intensity}
            onChange={setIntensity}
            min={0}
            max={10}
            leftLabel="0"
            rightLabel="10"
          />

          {/* Dynamic level description */}
          {(() => {
            const level = MISOPHONIA_LEVELS[intensity];
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

        {/* Location */}
        <div className="mb-6">
          <Input
            label="Where were you?"
            placeholder="e.g., At home, in the office..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Response */}
        <div className="mb-6">
          <Input.Select
            label="How did you respond?"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            options={RESPONSE_OPTIONS}
            placeholder="Select response..."
          />
        </div>

        {/* Other Response Text Input */}
        {response === 'other' && (
          <div className="mb-6 animate-fade-in-up">
            <Input
              label="Describe your response"
              placeholder="How did you respond to the trigger?"
              value={otherResponse}
              onChange={(e) => setOtherResponse(e.target.value)}
            />
          </div>
        )}

        {/* Additional Notes */}
        <div className="mb-6">
          <Input.Textarea
            label="Additional notes (optional)"
            placeholder="Any other thoughts or context you'd like to add..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Support checkbox */}
        <div className="mb-8">
          <Checkbox
            label="Would you like support right now?"
            checked={wantsSupport}
            onChange={setWantsSupport}
          />
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-4 bg-rose-500/10 border-rose-500/30">
            <p className="text-sm text-rose-300">{error}</p>
          </Card>
        )}

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-void-black to-transparent">
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={selectedTriggers.length === 0}
            className="w-full"
            size="lg"
          >
            {wantsSupport ? 'Save & Get Support' : 'Save Entry'}
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
              <h2 className="text-xl font-light text-white mb-2">We're here for you</h2>
              <p className="text-slate-300 font-light">
                It sounds like you're going through something really difficult right now.
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-300 font-light">
                Experiencing intense reactions is part of misophonia, and you're not alone.
                If you're feeling overwhelmed, please consider reaching out to someone you trust.
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

                <button
                  onClick={() => {
                    setShowSupportModal(false);
                    setWantsSupport(true);
                    handleSave(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-left"
                >
                  <Heart className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white font-light">Get in-app support</p>
                    <p className="text-xs text-slate-400">Breathing exercises & AI chat</p>
                  </div>
                </button>
              </div>

              {/* Continue button */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowSupportModal(false);
                    handleSave(true);
                  }}
                  className="w-full py-3 text-slate-400 hover:text-white font-light transition-colors"
                >
                  Continue without support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
