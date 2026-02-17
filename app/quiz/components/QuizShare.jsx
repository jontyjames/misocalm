'use client';

import { useState } from 'react';

const SHARE_TEXT = 'I just took this misophonia self-assessment. If certain sounds make you feel rage, disgust, or panic, this might help you understand why.';
const SHARE_URL = 'https://misocalm.app/quiz';

/**
 * Share prompt after email submitted
 */
export default function QuizShare() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Mobile share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Misophonia Quiz', text: SHARE_TEXT, url: SHARE_URL });
        return;
      } catch {
        // User cancelled or not supported, fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT}\n${SHARE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2584);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div
      className="w-full max-w-sm mx-auto text-center mt-8"
      style={{ animation: 'fadeInUp 610ms ease-out' }}
    >
      <p
        className="text-slate-200 font-light mb-4"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        Know someone who might need this?
      </p>

      <button
        onClick={handleShare}
        className="
          py-3 px-8 rounded-full
          border border-white/[0.18] backdrop-blur-2xl
          hover:border-white/30 transition-all duration-[233ms]
          text-white text-sm font-light
        "
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        {copied ? 'Link copied' : 'Share this quiz'}
      </button>
    </div>
  );
}
