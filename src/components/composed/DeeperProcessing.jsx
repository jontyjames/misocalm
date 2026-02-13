/**
 * DeeperProcessing - Optional emotional processing after logging
 * Guided prompts, one at a time, saved with the original entry
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Wind, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { triggerLogService } from '@/services';
import { ROUTES } from '@/lib/constants';

// Daily practices for the "Breathe" path
const PRACTICES = [
  { id: '1', duration: 'quick' },
  { id: '1', duration: 'deep' },
  { id: '1', duration: 'full' },
  { id: '3', duration: 'quick' },
  { id: '3', duration: 'deep' },
  { id: '3', duration: 'full' },
  { id: '4', duration: 'quick' },
  { id: '4', duration: 'medium' },
  { id: '4', duration: 'full' },
];

const PROMPTS = [
  'What did this moment remind you of?',
  'What boundary felt crossed?',
  'What emotion is underneath the trigger?',
];

export default function DeeperProcessing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get('entry');
  const { user } = useAuth();

  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState(['', '', '']);
  const [saving, setSaving] = useState(false);
  const [showClosing, setShowClosing] = useState(false);
  const [closingChars, setClosingChars] = useState(0);
  const [showPaths, setShowPaths] = useState(false);

  const practice = useMemo(() => {
    const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return PRACTICES[day % PRACTICES.length];
  }, []);

  const closingMessage = 'Thank you for going there';

  // Letter-by-letter for closing message
  useEffect(() => {
    if (!showClosing) return;
    if (closingChars < closingMessage.length) {
      const timer = setTimeout(() => setClosingChars(v => v + 1), 34);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowPaths(true), 1597);
      return () => clearTimeout(timer);
    }
  }, [showClosing, closingChars, router]);

  const saveAndExit = async () => {
    if (!entryId || !user?.id) {
      router.push(ROUTES.DASHBOARD);
      return;
    }

    setSaving(true);

    const deeperProcessing = {};
    PROMPTS.forEach((prompt, i) => {
      if (responses[i]?.trim()) {
        deeperProcessing[`prompt_${i + 1}`] = responses[i].trim();
      }
    });

    if (Object.keys(deeperProcessing).length > 0) {
      await triggerLogService.update(entryId, {
        deeper_processing: deeperProcessing,
      });
    }

    setSaving(false);
    setShowClosing(true);
  };

  const handleNext = () => {
    if (currentPrompt < PROMPTS.length - 1) {
      setCurrentPrompt(p => p + 1);
    } else {
      saveAndExit();
    }
  };

  const updateResponse = (text) => {
    setResponses(prev => {
      const next = [...prev];
      next[currentPrompt] = text;
      return next;
    });
  };

  // Closing animation + paths
  if (showClosing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <h1
            className="text-2xl leading-relaxed mb-16"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              textShadow: '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)',
              minHeight: '4rem',
            }}
          >
            {(() => {
              const words = closingMessage.split(' ');
              let charIndex = 0;
              return words.map((word, wi) => {
                const startIdx = charIndex;
                charIndex += word.length + 1;
                return (
                  <span key={wi} className="inline-block whitespace-nowrap">
                    {word.split('').map((char, ci) => (
                      <span
                        key={ci}
                        style={{
                          opacity: startIdx + ci < closingChars ? 1 : 0,
                          transition: 'opacity 0.377s ease-out',
                        }}
                      >
                        {char}
                      </span>
                    ))}
                    {wi < words.length - 1 && (
                      <span style={{ opacity: startIdx + word.length < closingChars ? 1 : 0, transition: 'opacity 0.377s ease-out' }}>&nbsp;</span>
                    )}
                  </span>
                );
              });
            })()}
          </h1>

          {showPaths && (
            <div className="space-y-4" style={{ animation: 'fadeIn 0.377s ease-out' }}>
              <button
                onClick={() => router.push(`/tools/${practice.id}?duration=${practice.duration}`)}
                className="relative w-full p-5 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 text-left transition-all duration-[233ms]"
                style={{
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(34,211,238,0.08) 100%)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px rgba(34,211,238,0.12), 0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(34,211,238,0.06) 0%, transparent 60%)' }} />
                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-cyan-500/30 bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Wind className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-white mb-1"
                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                    >
                      Breathe
                    </h3>
                    <p className="text-sm text-slate-300 font-light">
                      Go straight into a calming practice
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push(ROUTES.DASHBOARD)}
                className="relative w-full p-5 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-2xl hover:border-white/30 text-left transition-all duration-[233ms]"
                style={{
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />
                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-indigo-500/30 bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-white mb-1"
                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                    >
                      Return to sanctuary
                    </h3>
                    <p className="text-sm text-slate-300 font-light">
                      Head back when you are ready
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8" style={{ animation: 'fadeIn 0.61s ease-out' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push(ROUTES.JOURNAL)}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1
          className="text-2xl text-white"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
            textShadow: '0 0 16px rgba(139,92,246,0.3)',
          }}
        >
          Going a little deeper
        </h1>
      </div>

      <p className="text-slate-300 font-light mb-10">
        There are no right answers. Write as much or as little as feels right.
      </p>

      {/* Current prompt */}
      <div
        key={currentPrompt}
        style={{ animation: 'fadeIn 0.377s ease-out' }}
      >
        <h2
          className="text-lg text-violet-300 mb-4"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          {PROMPTS[currentPrompt]}
        </h2>

        <textarea
          value={responses[currentPrompt]}
          onChange={(e) => updateResponse(e.target.value)}
          placeholder="Write here..."
          rows={5}
          autoFocus
          className="w-full px-4 py-3 rounded-xl text-sm font-light bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none resize-none mb-6"
        />

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          {PROMPTS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-[233ms] ${
                i <= currentPrompt ? 'bg-violet-500/50' : 'bg-slate-700/50'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={saveAndExit}
            disabled={saving}
            className="text-sm text-slate-300 hover:text-slate-200 transition-colors font-light"
          >
            {saving ? 'Saving...' : "That's enough for now"}
          </button>

          <button
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-2.5 rounded-full text-sm font-light bg-violet-500/20 border border-violet-500/40 text-violet-300 hover:bg-violet-500/30 transition-all duration-[233ms]"
          >
            {currentPrompt < PROMPTS.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
}
