/**
 * LogFormContainer - Trigger log form with per-trigger intensity
 * Each selected trigger expands into a sacred glass card with its own slider
 * Environment replaces source. Completable in under 10 seconds.
 */

'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, TriggerChips } from '@/components/ui';
import { ExpandingTriggerCard, CrisisModal } from '@/components/composed';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useUserTriggers } from '@/hooks/useUserTriggers';
import { useLogForm, TIME_OF_DAY_OPTIONS, BODY_RESPONSE_OPTIONS } from '@/hooks/useLogForm';
import { ROUTES, ENVIRONMENT_OPTIONS } from '@/lib/constants';

export default function LogFormContainer() {
  const router = useRouter();
  const { user } = useAuth();
  const { triggers: userTriggers, isUsingDefaults, addCustomTrigger } = useUserTriggers(user?.id);

  const {
    triggerEntries, toggleTrigger, setTriggerIntensity,
    environment, setEnvironment,
    timeOfDay, setTimeOfDay,
    bodyResponses, toggleBodyResponse,
    notes, setNotes,
    handleSave, handleCrisisContinue, handleCrisisSupport,
    saving, error, showCrisisModal, setShowCrisisModal,
  } = useLogForm(user?.id);

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTrigger, setCustomTrigger] = useState('');
  const [addedMessage, setAddedMessage] = useState(null);
  const [showBody, setShowBody] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const selectedNames = Object.keys(triggerEntries);
  const unselected = userTriggers.filter(t => !selectedNames.includes(t));

  const handleAddCustom = async () => {
    const trimmed = customTrigger.trim();
    if (!trimmed) return;
    const result = await addCustomTrigger(trimmed);
    if (result?.error) return;
    toggleTrigger(trimmed);
    setCustomTrigger('');
    setShowCustomInput(false);
    setAddedMessage('Added to your sounds');
    setTimeout(() => setAddedMessage(null), 1597);
  };

  return (
    <div className="px-6 py-8 pb-32" style={{ animation: 'fadeIn 0.61s ease-out' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.push(ROUTES.JOURNAL)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl text-white" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
          Log a moment
        </h1>
      </div>

      {/* 1. Triggers — selected as expanding cards, unselected as chips */}
      <section className="mb-[26px]">
        <h2 className="text-sm text-slate-300 font-light mb-[10px]">What sounds affected you?</h2>

        {isUsingDefaults && (
          <p className="text-xs text-slate-400 font-light mb-[10px]"
             style={{ animation: 'fadeIn 0.377s ease-out' }}>
            These are common triggers. You can personalise them in your profile.
          </p>
        )}

        {/* Selected triggers as expanding cards */}
        {selectedNames.length > 0 && (
          <div className="space-y-[10px] mb-[10px]">
            {selectedNames.map(name => (
              <ExpandingTriggerCard
                key={name}
                name={name}
                intensity={triggerEntries[name]}
                onIntensityChange={setTriggerIntensity}
                onRemove={toggleTrigger}
              />
            ))}
          </div>
        )}

        {/* Unselected triggers as chips */}
        <TriggerChips
          items={unselected}
          selected={[]}
          onToggle={toggleTrigger}
          searchable
        />

        {/* Add custom trigger */}
        <div className="flex justify-center mt-3">
          {showCustomInput ? (
            <div className="flex items-center gap-2" style={{ animation: 'fadeIn 0.377s ease-out' }}>
              <input
                type="text"
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                placeholder="Type a trigger..."
                maxLength={50}
                autoFocus
                className="px-4 py-2 rounded-full text-sm font-light bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
              />
              <button onClick={handleAddCustom} className="p-2 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-white">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={() => { setShowCustomInput(false); setCustomTrigger(''); }} className="p-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomInput(true)}
              className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-light"
            >
              <Plus className="w-3.5 h-3.5" />
              Add your own
            </button>
          )}
        </div>

        {/* Added confirmation */}
        {addedMessage && (
          <p className="text-sm text-indigo-400 font-light text-center mt-2"
             style={{ animation: 'fadeIn 0.377s ease-out' }}>
            {addedMessage}
          </p>
        )}
      </section>

      {/* 2. Environment (replaces Source) */}
      <section className="mb-[26px]">
        <h2 className="text-sm text-slate-300 font-light mb-[10px]">Where were you?</h2>
        <TriggerChips
          items={ENVIRONMENT_OPTIONS}
          selected={environment}
          onToggle={setEnvironment}
          multiSelect={false}
        />
      </section>

      {/* 3. Time of day */}
      <section className="mb-[26px]">
        <h2 className="text-sm text-slate-300 font-light mb-[10px]">When?</h2>
        <TriggerChips
          items={TIME_OF_DAY_OPTIONS}
          selected={timeOfDay}
          onToggle={setTimeOfDay}
          multiSelect={false}
        />
      </section>

      {/* 4. Body response (optional, expandable) */}
      <section className="mb-[26px]">
        <button
          onClick={() => setShowBody(!showBody)}
          className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors font-light"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-[233ms] ${showBody ? 'rotate-180' : ''}`} />
          Notice your body...
        </button>
        {showBody && (
          <div className="mt-3" style={{ animation: 'fadeIn 0.377s ease-out' }}>
            <p className="text-xs text-slate-300 font-light mb-3">How did your body respond?</p>
            <TriggerChips
              items={BODY_RESPONSE_OPTIONS}
              selected={bodyResponses}
              onToggle={toggleBodyResponse}
            />
          </div>
        )}
      </section>

      {/* 5. Notes (optional, expandable) */}
      <section className="mb-[26px]">
        {showNotes ? (
          <div style={{ animation: 'fadeIn 0.377s ease-out' }}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to capture..."
              rows={3}
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm font-light bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none resize-none"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowNotes(true)}
            className="text-sm text-slate-300 hover:text-slate-200 transition-colors font-light"
          >
            Add a note...
          </button>
        )}
      </section>

      {/* Error display (slate-300, not alarming) */}
      {error && (
        <p className="text-sm text-slate-300 font-light mb-4"
           style={{ animation: 'fadeIn 0.377s ease-out' }}>
          {error.message || 'Something went wrong. Your data is safe.'}
        </p>
      )}

      {/* Fixed save button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
        <Button
          onClick={() => handleSave()}
          loading={saving}
          disabled={selectedNames.length === 0}
          className="w-full"
          size="lg"
        >
          Save entry
        </Button>
      </div>

      {/* Crisis Modal — wrapped in ErrorBoundary so 988 number is always accessible */}
      <ErrorBoundary fallback={() => (
        <div role="alert" className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80">
          <div className="text-center max-w-sm">
            <p className="text-white font-light mb-4">If you are in crisis, please reach out for support.</p>
            <a
              href="tel:988"
              className="inline-block px-8 py-4 rounded-full bg-rose-600 text-white text-lg font-light"
            >
              Call 988
            </a>
            <p className="text-slate-400 text-sm font-light mt-4">
              Suicide and Crisis Lifeline — available 24/7
            </p>
          </div>
        </div>
      )}>
        <CrisisModal
          isOpen={showCrisisModal}
          onContinue={handleCrisisContinue}
          onGetSupport={handleCrisisSupport}
          onClose={() => setShowCrisisModal(false)}
        />
      </ErrorBoundary>
    </div>
  );
}
