'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useLocalStorage } from '@/hooks';

const STORAGE_KEY = 'regulation-toolkit-beta-seen';

/**
 * A gentle one-time notice that the Regulation Toolkit is still in development.
 * Shows once per person, then remembers it was dismissed.
 */
export default function RegulationBetaNotice() {
  const [seen, setSeen] = useLocalStorage(STORAGE_KEY, false);
  const [isOpen, setIsOpen] = useState(false);

  // Open on first visit only. Runs after mount so localStorage is available.
  useEffect(() => {
    if (!seen) setIsOpen(true);
  }, [seen]);

  const dismiss = () => {
    setSeen(true);
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={dismiss} size="sm" showClose={false}>
      <div className="flex flex-col items-center text-center">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10"
        >
          <Sparkles className="h-5 w-5 text-indigo-300" />
        </div>

        <h2
          className="text-xl text-white"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          Still being built
        </h2>

        <p className="mt-3 text-sm font-light leading-relaxed text-slate-300">
          The Regulation Toolkit is in early development. The first practices are
          here to explore, and more are on the way. Some pieces are still finding
          their shape, so take what serves you and leave the rest.
        </p>

        <Button variant="primary" size="md" onClick={dismiss} className="mt-6 w-full">
          Enter gently
        </Button>
      </div>
    </Modal>
  );
}
