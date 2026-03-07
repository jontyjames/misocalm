/**
 * TerminalGuide
 * Orchestrator for the full-screen terminal education experience.
 * Phase: 'select' (voice selector) → 'terminal' (teaching) → 'select' (pick another).
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useLocalStorage } from '@/hooks';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';
import useTerminalState from './useTerminalState';
import TerminalStars from './TerminalStars';
import TerminalWindow from './TerminalWindow';
import VoiceSelector from './VoiceSelector';

export default function TerminalGuide({ module }) {
  const router = useRouter();
  const [phase, setPhase] = useState('select');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [starsVisible, setStarsVisible] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);

  const [visits] = useLocalStorage(STORAGE_KEYS.EDUCATION_VISITS, {});

  // Get pages for selected voice
  const pages = selectedVoice ? module.voices[selectedVoice]?.pages : null;

  const {
    currentPage,
    totalPages,
    visibleLines,
    typingComplete,
    allComplete,
    transitioning,
    showExit,
    advance,
  } = useTerminalState(pages, module.slug, selectedVoice);

  // Entry sequence — Fibonacci timed
  useEffect(() => {
    const t1 = setTimeout(() => setStarsVisible(true), 89);
    return () => clearTimeout(t1);
  }, []);

  // Terminal fade-in when entering terminal phase
  useEffect(() => {
    if (phase === 'terminal') {
      setTerminalVisible(false);
      setExitVisible(false);
      const t1 = setTimeout(() => setTerminalVisible(true), 233);
      const t2 = setTimeout(() => setExitVisible(true), 610);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase, selectedVoice]);

  // When terminal completes, return to selector
  useEffect(() => {
    if (allComplete && phase === 'terminal') {
      const t = setTimeout(() => {
        setPhase('select');
        setSelectedVoice(null);
        setTerminalVisible(false);
        setExitVisible(false);
      }, 987);
      return () => clearTimeout(t);
    }
  }, [allComplete, phase]);

  const handleVoiceSelect = useCallback((voiceKey) => {
    setSelectedVoice(voiceKey);
    setPhase('terminal');
  }, []);

  const handleExit = () => router.push(ROUTES.TOOLS);

  const handleTap = () => {
    if (allComplete) return; // auto-returns to select
    advance();
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center safe-area-top safe-area-bottom"
      style={{ background: '#030712', zIndex: 50 }}
    >
      {/* Stars */}
      <div style={{ opacity: starsVisible ? 1 : 0, transition: 'opacity 610ms ease' }}>
        <TerminalStars />
      </div>

      {/* Voice selector phase */}
      {phase === 'select' && (
        <VoiceSelector
          module={module}
          visits={visits}
          onSelect={handleVoiceSelect}
        />
      )}

      {/* Terminal phase */}
      {phase === 'terminal' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          onClick={handleTap}
        >
          {/* Exit button — top left */}
          <button
            onClick={(e) => { e.stopPropagation(); setPhase('select'); setSelectedVoice(null); }}
            className="fixed top-0 left-0 flex items-center text-slate-400 safe-area-top"
            style={{
              padding: 16,
              gap: 6,
              fontSize: 13,
              fontFamily: 'var(--font-mono), monospace',
              fontWeight: 300,
              opacity: exitVisible ? 0.4 : 0,
              transition: 'opacity 610ms ease',
              zIndex: 51,
              background: 'rgba(3,7,18,0.4)',
              borderRadius: '0 0 10px 0',
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            back
          </button>

          {/* Terminal */}
          <div
            style={{
              opacity: terminalVisible ? 1 : 0,
              transform: terminalVisible ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 987ms ease, transform 987ms ease',
              zIndex: 1,
            }}
          >
            <TerminalWindow
              visibleLines={visibleLines}
              typingComplete={typingComplete}
              transitioning={transitioning}
            />
          </div>

          {/* Progress dots — bottom centre */}
          <div
            className="fixed bottom-0 left-0 right-0 flex justify-center safe-area-bottom"
            style={{ paddingBottom: 26, gap: 10, zIndex: 51 }}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  background: i === currentPage
                    ? '#00ff41'
                    : i < currentPage
                      ? 'rgba(0,255,65,0.3)'
                      : 'rgba(0,255,65,0.1)',
                  boxShadow: i === currentPage ? '0 0 6px rgba(0,255,65,0.6)' : 'none',
                  transition: 'all 233ms ease',
                }}
              />
            ))}
          </div>

          {/* Exit prompt on final page */}
          {showExit && (
            <div
              className="fixed bottom-0 left-0 right-0 text-center safe-area-bottom"
              style={{
                paddingBottom: 42,
                fontFamily: 'var(--font-mono), monospace',
                fontWeight: 300,
                fontSize: 12,
                color: 'rgba(0,255,65,0.4)',
                animation: 'fadeIn 610ms ease forwards',
              }}
            >
              returning...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
