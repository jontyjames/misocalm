'use client';

import { useEffect, useMemo, useState } from 'react';
import { Mic2, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui';
import { PHI_SCALE } from '@/lib/constants';

export default function PracticeVoiceControls({ transcript }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const voiceText = useMemo(() => transcript.map((line) => line.text).join('. '), [transcript]);

  useEffect(() => {
    const canSpeak = typeof window !== 'undefined'
      && 'speechSynthesis' in window
      && 'SpeechSynthesisUtterance' in window;
    setSupported(canSpeak);

    return () => {
      if (canSpeak) window.speechSynthesis?.cancel();
    };
  }, []);

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const play = () => {
    if (!supported || !voiceText) return;
    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(voiceText);
    utterance.rate = 0.86;
    utterance.pitch = 0.92;
    utterance.volume = 0.72;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
      <div className="flex items-start" style={{ gap: PHI_SCALE[1] }}>
        <Mic2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-200" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white">Temporary guide voice</p>
          <p className="mt-1 text-xs font-light leading-relaxed text-slate-400">
            Uses the browser voice for now. Your recording can replace this later.
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2" style={{ gap: PHI_SCALE[1] }}>
        <Button onClick={play} disabled={!supported || speaking} size="sm">
          <span className="inline-flex items-center gap-2">
            <Play className="h-4 w-4" />
            Play guide
          </span>
        </Button>
        <Button onClick={stop} disabled={!supported || !speaking} size="sm" variant="secondary">
          <span className="inline-flex items-center gap-2">
            <Pause className="h-4 w-4" />
            Stop
          </span>
        </Button>
      </div>

      {!supported && (
        <p className="mt-3 text-[11px] font-light leading-relaxed text-slate-500">
          Voice playback is not available in this test browser. The transcript still works.
        </p>
      )}
    </div>
  );
}
