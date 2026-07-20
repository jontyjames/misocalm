'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Shield } from 'lucide-react';
import { Button } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import { PHI_SCALE } from '@/lib/constants';
import EmergencyPhraseEditor from './EmergencyPhraseEditor';
import EmergencyStepCard from './EmergencyStepCard';
import { EMERGENCY_DEFAULT_PHRASES, EMERGENCY_PROTOCOL_STEPS } from './practicePanelData';

export default function EmergencyProtocolPanel({ onOpen, onComplete }) {
  const [phrases, setPhrases] = useLocalStorage('misocalm-emergency-phrases', EMERGENCY_DEFAULT_PHRASES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPhrase, setSelectedPhrase] = useState(EMERGENCY_DEFAULT_PHRASES[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!phrases.includes(selectedPhrase)) {
      setSelectedPhrase(phrases[0] || EMERGENCY_DEFAULT_PHRASES[0]);
    }
  }, [phrases, selectedPhrase]);

  const updatePhrase = (index, value) => {
    setPhrases((current) => {
      const next = current.map((phrase, i) => (i === index ? value : phrase));
      if (selectedPhrase === current[index]) setSelectedPhrase(value);
      return next;
    });
  };

  const resetPhrases = () => {
    setPhrases(EMERGENCY_DEFAULT_PHRASES);
    setSelectedPhrase(EMERGENCY_DEFAULT_PHRASES[0]);
  };

  const copyPhrase = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(selectedPhrase);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1597);
  };

  return (
    <div
      className="rounded-xl border border-white/[0.08] bg-slate-900/70 p-4"
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 24px rgba(148,163,184,0.08)',
      }}
    >
      <div className="flex flex-col" style={{ gap: PHI_SCALE[2] }}>
        <div className="flex items-start" style={{ gap: PHI_SCALE[2] }}>
          <Shield className="mt-1 h-5 w-5 shrink-0 text-slate-200" />
          <div>
            <p className="text-sm text-white">Emergency Protocol</p>
            <p className="mt-1 text-sm font-light leading-relaxed text-slate-300">
              Leave if you safely can. Use one true phrase. Recover before explaining.
            </p>
          </div>
        </div>

        <EmergencyStepCard activeIndex={activeIndex} onSelect={setActiveIndex} />
        <EmergencyPhraseEditor
          phrases={phrases}
          selectedPhrase={selectedPhrase}
          copied={copied}
          onCopy={copyPhrase}
          onFocusPhrase={setSelectedPhrase}
          onUpdatePhrase={updatePhrase}
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <Button onClick={() => onOpen('/tools/4?duration=quick')} solfeggio="indigo">
            Fast breath
          </Button>
          <Button onClick={() => onOpen('/tools/experiences/grounding')} variant="secondary">
            Grounding
          </Button>
        </div>

        <div className="grid grid-cols-2" style={{ gap: PHI_SCALE[1] }}>
          <Button
            onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
            variant="secondary"
            disabled={activeIndex === 0}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </span>
          </Button>
          <Button
            onClick={() => setActiveIndex((current) => Math.min(EMERGENCY_PROTOCOL_STEPS.length - 1, current + 1))}
            disabled={activeIndex === EMERGENCY_PROTOCOL_STEPS.length - 1}
          >
            <span className="inline-flex items-center gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </div>

        {activeIndex === EMERGENCY_PROTOCOL_STEPS.length - 1 && (
          <Button onClick={onComplete} className="w-full" solfeggio="slate">
            Complete protocol
          </Button>
        )}

        <button
          onClick={resetPhrases}
          className="inline-flex items-center text-left text-xs font-light text-slate-500 transition-colors duration-[144ms] hover:text-slate-300"
          style={{ gap: PHI_SCALE[1] }}
        >
          <RotateCcw className="h-3 w-3" />
          Restore starter phrases
        </button>
      </div>
    </div>
  );
}
