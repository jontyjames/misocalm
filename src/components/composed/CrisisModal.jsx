/**
 * CrisisModal - Safety-critical support modal for intensity >= 9
 * Provides crisis helpline, in-app support, and continue options
 */

'use client';

import { Heart, Phone } from 'lucide-react';
import { Modal, Button } from '@/components/ui';

export default function CrisisModal({ isOpen, onContinue, onGetSupport, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showClose={false}>
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-rose-400" />
        </div>

        <h3
          className="text-xl text-white mb-3"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          We're here for you
        </h3>

        <p className="text-slate-300 font-light mb-6 text-sm leading-relaxed">
          You're going through something really difficult right now.
          Would you like some support?
        </p>

        <div className="space-y-3">
          {/* Crisis helplines */}
          <div className="space-y-2">
            <a
              href="tel:988"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-light text-sm hover:bg-rose-500/30 transition-colors"
            >
              <Phone className="w-4 h-4" />
              988 Suicide & Crisis Lifeline (US)
            </a>
            <a
              href="tel:116123"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300/80 font-light text-xs hover:bg-rose-500/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Samaritans 116 123 (UK/IE)
            </a>
            <a
              href="tel:131114"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300/80 font-light text-xs hover:bg-rose-500/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Lifeline 13 11 14 (AU)
            </a>
            <a
              href="tel:1737"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300/80 font-light text-xs hover:bg-rose-500/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Need to Talk? 1737 (NZ)
            </a>
            <p className="text-xs text-slate-400 font-light text-center pt-1">
              Text HOME to 741741 for Crisis Text Line
            </p>
          </div>

          {/* In-app support */}
          <Button onClick={onGetSupport} className="w-full" size="lg">
            Get in-app support
          </Button>

          {/* Continue without support */}
          <button
            onClick={onContinue}
            className="w-full text-sm text-slate-400 hover:text-white transition-colors font-light py-3"
          >
            Let me breathe through this
          </button>
        </div>
      </div>
    </Modal>
  );
}
