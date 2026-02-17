'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, FIBONACCI_TIMING } from '@/lib/constants';

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

  useEffect(() => {
    if (dismissed) return;
    setPlatform(getPlatform());
    const timer = setTimeout(() => setVisible(true), FIBONACCI_TIMING.ceremony);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm"
      style={{ animation: 'fadeIn 0.61s ease-out' }}
    >
      <div
        className="rounded-2xl border border-white/[0.18] backdrop-blur-2xl p-5"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(34,211,238,0.06) 100%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 0 20px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <p
          className="text-cyan-300 text-sm font-light mb-2"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          MisoCalm is in early beta
        </p>
        <p className="text-slate-200 text-sm font-light leading-relaxed mb-3">
          You're one of the first people here. Things may shift as we grow.
        </p>

        {platform === 'ios' && (
          <p className="text-slate-300 text-xs font-light leading-relaxed mb-3">
            In Safari, tap the Share icon, then scroll down and tap "Add to Home Screen". If you don't see it, look for "More" at the bottom right first.
          </p>
        )}
        {platform === 'android' && (
          <p className="text-slate-300 text-xs font-light leading-relaxed mb-3">
            For the best experience, tap the menu (<span className="text-slate-200">&#8942;</span>) in Chrome, then "Add to Home Screen"
          </p>
        )}
        {platform === 'desktop' && (
          <p className="text-slate-300 text-xs font-light leading-relaxed mb-3">
            For the best experience on mobile, visit misocalm.app on your phone and save it to your home screen.
          </p>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="text-sm text-slate-300 hover:text-white transition-colors duration-[233ms] font-light"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
