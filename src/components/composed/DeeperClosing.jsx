/**
 * DeeperClosing - Closing animation + path buttons after deeper processing
 * Letter-by-letter message reveal, then sacred glass path buttons
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Home } from 'lucide-react';
import { ROUTES, FIBONACCI_TIMING } from '@/lib/constants';
import { useReducedMotion } from '@/hooks';
import { SACRED_GLASS_CLASSES, sacredGlassStyle, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE, torusFlowStyle } from '@/lib/sacredGlass';

export default function DeeperClosing({ message, practicesRoute = ROUTES.TOOLS }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [closingChars, setClosingChars] = useState(0);
  const [showPaths, setShowPaths] = useState(false);

  useEffect(() => {
    if (closingChars < message.length) {
      const timer = setTimeout(() => setClosingChars(v => v + 1), FIBONACCI_TIMING.micro);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowPaths(true), FIBONACCI_TIMING.ceremony);
      return () => clearTimeout(timer);
    }
  }, [closingChars, message]);

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
            const words = message.split(' ');
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
                        transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  {wi < words.length - 1 && (
                    <span style={{ opacity: startIdx + word.length < closingChars ? 1 : 0, transition: prefersReduced ? 'none' : 'opacity 0.377s ease-out' }}>&nbsp;</span>
                  )}
                </span>
              );
            });
          })()}
        </h1>

        {showPaths && (
          <div className="space-y-4" style={{ animation: prefersReduced ? 'none' : 'fadeIn 0.377s ease-out' }}>
            <button
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className={`relative w-full p-5 rounded-2xl overflow-hidden ${SACRED_GLASS_CLASSES} text-left`}
              style={sacredGlassStyle('indigo')}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={GLASS_HIGHLIGHT_STYLE} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={PHI_LAYERS_STYLE} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={torusFlowStyle('indigo')} />
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl border border-indigo-500/30 bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
                    Return to sanctuary
                  </h3>
                  <p className="text-sm text-slate-300 font-light">
                    Head back when you are ready
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push(practicesRoute)}
              className={`relative w-full p-5 rounded-2xl overflow-hidden ${SACRED_GLASS_CLASSES} text-left`}
              style={sacredGlassStyle('cyan')}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={GLASS_HIGHLIGHT_STYLE} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={PHI_LAYERS_STYLE} />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={torusFlowStyle('cyan')} />
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl border border-cyan-500/30 bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white mb-1" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
                    Return to practices
                  </h3>
                  <p className="text-sm text-slate-300 font-light">
                    Find another practice when you are ready
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
