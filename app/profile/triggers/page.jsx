/**
 * Profile - Edit Triggers
 * Manage trigger sounds: view, add custom, remove
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserTriggers } from '@/hooks/useUserTriggers';
import { userTriggerService } from '@/services';
import { TriggerChips } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { DEFAULT_TRIGGERS, ROUTES } from '@/lib/constants';

export default function EditTriggersPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { triggers: savedTriggers, addCustomTrigger } = useUserTriggers(user?.id);

  const [selected, setSelected] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTrigger, setCustomTrigger] = useState('');
  const [saving, setSaving] = useState(false);
  const [allTriggers, setAllTriggers] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  // Sync saved triggers into local state
  useEffect(() => {
    if (savedTriggers.length > 0) {
      setSelected([...savedTriggers]);
      // Build full list: saved triggers + any defaults not already included
      const remaining = DEFAULT_TRIGGERS.filter(t => !savedTriggers.includes(t));
      setAllTriggers([...savedTriggers, ...remaining]);
    } else {
      setAllTriggers([...DEFAULT_TRIGGERS]);
    }
  }, [savedTriggers]);

  const handleToggle = (trigger) => {
    setSelected(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleAddCustom = async () => {
    const trimmed = customTrigger.trim();
    if (!trimmed || allTriggers.includes(trimmed)) return;

    await addCustomTrigger(trimmed);
    setAllTriggers(prev => [trimmed, ...prev]);
    setSelected(prev => [...prev, trimmed]);
    setCustomTrigger('');
    setShowCustomInput(false);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    await userTriggerService.saveUserTriggers(user.id, selected);
    setSaving(false);
    router.back();
  };

  return (
    <AppLayout showNav={false}>
      <div className="px-6 py-8 pb-32" style={{ animation: 'fadeIn 0.61s ease-out' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1
            className="text-2xl text-white"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            My Triggers
          </h1>
        </div>

        <p className="text-slate-300 font-light mb-6">
          Select the sounds that affect you. Tap to add or remove.
        </p>

        {/* Trigger chips */}
        <TriggerChips
          items={allTriggers}
          selected={selected}
          onToggle={handleToggle}
        />

        {/* Add custom */}
        <div className="flex justify-center mt-4 mb-8">
          {showCustomInput ? (
            <div className="flex items-center gap-2" style={{ animation: 'fadeIn 0.377s ease-out' }}>
              <input
                type="text"
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                placeholder="Type a trigger..."
                autoFocus
                className="px-4 py-2 rounded-full text-sm font-light bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-indigo-500/50 focus:outline-none"
              />
              <button onClick={handleAddCustom} className="p-2 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-white">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={() => { setShowCustomInput(false); setCustomTrigger(''); }} className="p-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300">
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

        {/* Fixed save button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
          <button
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            className={`w-full py-4 rounded-full text-base font-light transition-all duration-150 border-2 ${
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
