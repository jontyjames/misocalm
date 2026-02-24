/**
 * Profile - Edit Triggers
 * Manage trigger sounds: your sounds first, available defaults below
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserTriggers } from '@/hooks';
import { userTriggerService } from '@/services';
import { TriggerChips, PageHeader } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { DEFAULT_TRIGGERS, ROUTES } from '@/lib/constants';
import { isValidTriggerName } from '@/lib/validators';

export default function EditTriggersPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { triggers: savedTriggers, addCustomTrigger, refresh: refreshTriggers } = useUserTriggers(user?.id);

  const [selected, setSelected] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTrigger, setCustomTrigger] = useState('');
  const [inputError, setInputError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (savedTriggers.length > 0) {
      setSelected([...savedTriggers]);
    }
  }, [savedTriggers]);

  // Available defaults not already selected
  const availableDefaults = DEFAULT_TRIGGERS.filter(t => !selected.includes(t));

  const handleToggle = (trigger) => {
    setSelected(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleAddCustom = async () => {
    const { valid, error } = isValidTriggerName(customTrigger);
    if (!valid) {
      setInputError(error);
      return;
    }
    const trimmed = customTrigger.trim();
    if (selected.includes(trimmed)) {
      setInputError('Already in your list');
      return;
    }
    await addCustomTrigger(trimmed);
    setCustomTrigger('');
    setShowCustomInput(false);
    setInputError(null);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setErrorMsg(null);
    const { error } = await userTriggerService.saveUserTriggers(user.id, selected);
    if (error) {
      setErrorMsg('Something went wrong. Your triggers are safe.');
      setSaving(false);
      return;
    }
    await refreshTriggers();
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.back(), 1597);
  };

  // Save confirmation screen
  if (saved) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center px-6">
          <p className="text-lg text-indigo-300 font-light"
             style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200, animation: 'fadeIn 0.377s ease-out' }}>
            Triggers updated
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="px-6 py-8 pb-32" style={{ animation: 'fadeIn 0.61s ease-out' }}>
        <PageHeader title="My Triggers" backHref={ROUTES.PROFILE} className="mb-8" />

        <p className="text-slate-300 font-light mb-[26px]">
          These are the sounds you're working with. You can update them anytime.
        </p>

        {/* Error display */}
        {errorMsg && (
          <p className="text-sm text-slate-300 font-light text-center mb-4"
             style={{ animation: 'fadeIn 0.377s ease-out' }}>
            {errorMsg}
          </p>
        )}

        {/* Your sounds */}
        <div className="mb-[26px]">
          <h2 className="text-sm text-slate-300 font-light mb-[10px]">Your sounds</h2>
          <TriggerChips
            items={selected}
            selected={selected}
            onToggle={handleToggle}
            searchable
          />
        </div>

        {/* Available defaults */}
        {availableDefaults.length > 0 && (
          <div className="mb-[26px]">
            <h2 className="text-sm text-slate-300 font-light mb-[10px]">Add more</h2>
            <TriggerChips
              items={availableDefaults}
              selected={selected}
              onToggle={handleToggle}
            />
          </div>
        )}

        {/* Add custom */}
        <div className="flex justify-center mt-4 mb-[26px]">
          {showCustomInput ? (
            <div style={{ animation: 'fadeIn 0.377s ease-out' }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customTrigger}
                  onChange={(e) => { setCustomTrigger(e.target.value); setInputError(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                  placeholder="Type a trigger..."
                  maxLength={50}
                  autoFocus
                  className="px-4 py-2 rounded-full text-base font-light bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-indigo-500/50 focus:outline-none"
                />
                <button onClick={handleAddCustom} aria-label="Add custom trigger" className="p-2 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-white">
                  <Plus className="w-4 h-4" />
                </button>
                <button onClick={() => { setShowCustomInput(false); setCustomTrigger(''); setInputError(null); }} aria-label="Cancel" className="p-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {inputError && (
                <p className="text-xs text-slate-300 font-light mt-2 text-center">{inputError}</p>
              )}
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

        <p className="text-xs text-slate-400 font-light text-center">
          Changes here update your logging form
        </p>

        {/* Fixed save button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
          <button
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            className={`w-full py-4 rounded-full text-base font-light transition-all duration-[144ms] border-2 ${
              selected.length === 0
                ? 'border-slate-700 bg-slate-900/30 text-slate-600 cursor-not-allowed'
                : 'border-white/[0.33] hover:border-white/40 bg-primary-cta text-white active:scale-[0.98]'
            }`}
            style={selected.length > 0 ? { boxShadow: '0 0 12px rgba(255,255,255,0.06)' } : undefined}
          >
            {saving ? 'Saving...' : `Save ${selected.length} trigger${selected.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
