'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage, useReducedMotion } from '@/hooks';
import { STORAGE_KEYS, FIBONACCI_TIMING } from '@/lib/constants';
import { SACRED_GLASS_STATIC_CLASSES } from '@/lib/sacredGlass';

function getPlatform() {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  if (isStandalone) return 'installed';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

export default function BetaInstallBanner() {
  const [dismissed, setDismissed] = useLocalStorage(STORAGE_KEYS.BETA_BANNER_DISMISSED, false);
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState('unknown');
  const buttonRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const dismiss = useCallback(() => setDismissed(true), [setDismissed]);

  useEffect(() => {
    if (dismissed) return;
    setPlatform(getPlatform());
    const timer = setTimeout(() => setVisible(true), FIBONACCI_TIMING.ceremony);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Focus the button when modal becomes visible
  useEffect(() => {
    if (visible && !dismissed) {
      buttonRef.current?.focus();
    }
  }, [visible, dismissed]);

  // Escape key handler
  useEffect(() => {
    if (!visible || dismissed) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, dismissed, dismiss]);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="beta-banner-title"
      style={{ animation: prefersReduced ? 'none' : 'fadeIn 0.61s ease-out' }}
      onKeyDown={(e) => {
        // Focus trap: only one focusable element (the button), so trap is implicit
        if (e.key === 'Tab') {
          e.preventDefault();
          buttonRef.current?.focus();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-sm rounded-2xl ${SACRED_GLASS_STATIC_CLASSES} p-6`}
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(34,211,238,0.06) 100%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 0 30px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.4)',
        }}
      >
        <h2
          id="beta-banner-title"
          className="text-cyan-300 text-base mb-2"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Welcome to MisoCalm
        </h2>
        <p className="text-slate-200 text-sm font-light leading-relaxed mb-4">
          You're one of the first people here. This is an early beta, so things may shift as we grow.
        </p>

        {platform !== 'installed' && platform !== 'unknown' && (
          <div className="mb-4 pt-3 border-t border-white/[0.08]">
            <p
              className="text-indigo-300 text-sm mb-2"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              For the best experience
            </p>
            {platform === 'ios' && (
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Tap the Share icon in Safari, then "Add to Home Screen". This gives you the full app experience.
              </p>
            )}
            {platform === 'android' && (
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Tap the menu (<span className="text-slate-200" aria-hidden="true">&#8942;</span>) in Chrome, then "Add to Home Screen". This gives you the full app experience.
              </p>
            )}
            {platform === 'desktop' && (
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Visit misocalm.app on your phone and save it to your home screen. MisoCalm is designed for mobile.
              </p>
            )}
          </div>
        )}

        <button
          ref={buttonRef}
          onClick={dismiss}
          aria-label="Dismiss welcome banner"
          className="w-full py-3 rounded-xl text-sm text-slate-200 font-light transition-all duration-[233ms] border border-white/[0.12] hover:border-white/[0.25]"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
