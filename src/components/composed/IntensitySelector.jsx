/**
 * IntensitySelector - Slider with dynamic level card and levels modal
 * Wraps the Slider primitive with misophonia response level context
 */

'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { Slider, Modal } from '@/components/ui';
import { MISOPHONIA_LEVELS } from '@/lib/constants';

const LEVEL_COLORS = {
  emerald: 'border-emerald-500/30 bg-emerald-500/10',
  amber: 'border-amber-500/30 bg-amber-500/10',
  orange: 'border-orange-500/30 bg-orange-500/10',
  rose: 'border-rose-500/30 bg-rose-500/10',
};

const LEVEL_TEXT_COLORS = {
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  orange: 'text-orange-400',
  rose: 'text-rose-400',
};

export default function IntensitySelector({ value, onChange, className = '' }) {
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const level = MISOPHONIA_LEVELS[value] || MISOPHONIA_LEVELS[5];

  return (
    <div className={className}>
      <Slider
        label="How intense?"
        value={value}
        onChange={onChange}
        min={0}
        max={10}
        leftLabel="Mild"
        rightLabel="Severe"
      />

      {/* Dynamic level card */}
      <div
        className={`mt-4 p-3 rounded-xl border transition-all duration-[233ms] ${LEVEL_COLORS[level.color]}`}
      >
        <p className={`text-sm font-light ${LEVEL_TEXT_COLORS[level.color]}`}>
          <span className="font-normal">{level.label}</span>
        </p>
        <p className="text-xs text-slate-300 font-light mt-1">
          {level.description}
        </p>
      </div>

      {/* View all levels link */}
      <button
        type="button"
        onClick={() => setShowLevelsModal(true)}
        className="flex items-center gap-1.5 mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-light"
      >
        <Info className="w-3.5 h-3.5" />
        View all response levels
      </button>

      {/* Levels modal */}
      <Modal
        isOpen={showLevelsModal}
        onClose={() => setShowLevelsModal(false)}
        title="Misophonia Response Levels"
        size="lg"
      >
        <Modal.Body>
          <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
            {MISOPHONIA_LEVELS.map((l) => (
              <div
                key={l.level}
                className={`p-3 rounded-xl border ${LEVEL_COLORS[l.color]} ${
                  l.level === value ? 'ring-1 ring-white/20' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-normal ${LEVEL_TEXT_COLORS[l.color]}`}>
                    {l.level}
                  </span>
                  <span className="text-sm text-white font-light">{l.label}</span>
                </div>
                <p className="text-xs text-slate-300 font-light">{l.description}</p>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
