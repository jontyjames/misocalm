/**
 * BreathworkCheckIn - Gentle emotional check-in
 * Energy + Pleasantness sliders (Russell's Circumplex) + optional body sensation
 * Context-aware: back button and post-save paths differ based on origin
 */

'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Slider } from '@/components/ui';
import { CHECK_IN_SCALES, ROUTES } from '@/lib/constants';
import { useCheckInForm, useReducedMotion } from '@/hooks';
import { SACRED_GLASS_CLASSES, GLASS_HIGHLIGHT_STYLE } from '@/lib/sacredGlass';

export default function BreathworkCheckIn({ userId, fromBreathwork = false }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const backRoute = fromBreathwork ? ROUTES.DASHBOARD : ROUTES.JOURNAL;
  const {
    energy, setEnergy,
    pleasantness, setPleasantness,
    bodySensation, setBodySensation,
    handleSave,
    saving, error,
  } = useCheckInForm(userId, fromBreathwork);

  return (
    <div
      className="min-h-screen flex flex-col px-6 py-8 safe-area-bottom"
      style={{ animation: prefersReduced ? 'none' : 'fadeIn 1.597s ease-out' }}
    >
      {/* Back */}
      <button
        onClick={() => router.push(backRoute)}
        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-[233ms] mb-10"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-light">Back</span>
      </button>

      {/* Heading */}
      <h1
        className="text-2xl text-white mb-2"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        How are you feeling?
      </h1>
      <p className="text-sm text-slate-300 font-light mb-10">
        No right answers. Just notice.
      </p>

      {/* Energy slider */}
      <div style={{ marginBottom: '42px' }}>
        <Slider
          label="Energy"
          value={energy}
          onChange={setEnergy}
          min={CHECK_IN_SCALES.energy.min}
          max={CHECK_IN_SCALES.energy.max}
          step={1}
          showValue={false}
          leftLabel={CHECK_IN_SCALES.energy.leftLabel}
          rightLabel={CHECK_IN_SCALES.energy.rightLabel}
        />
      </div>

      {/* Pleasantness slider */}
      <div style={{ marginBottom: '42px' }}>
        <Slider
          label="Pleasantness"
          value={pleasantness}
          onChange={setPleasantness}
          min={CHECK_IN_SCALES.pleasantness.min}
          max={CHECK_IN_SCALES.pleasantness.max}
          step={1}
          showValue={false}
          leftLabel={CHECK_IN_SCALES.pleasantness.leftLabel}
          rightLabel={CHECK_IN_SCALES.pleasantness.rightLabel}
        />
      </div>

      {/* Body sensation */}
      <div style={{ marginBottom: '42px' }}>
        <label className="text-sm font-light text-slate-300 block mb-3">
          What are you noticing in your body?
        </label>
        <textarea
          value={bodySensation}
          onChange={(e) => setBodySensation(e.target.value)}
          placeholder="Optional"
          rows={3}
          className="w-full bg-slate-800 text-slate-200 placeholder-slate-500 rounded-xl p-4 text-sm font-light border border-slate-700 focus:border-indigo-500/40 focus:outline-none transition-colors duration-[233ms] resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-rose-400 font-light mb-4">{typeof error === 'string' ? error : (error.message || 'Something went wrong')}</p>
      )}

      {/* Actions */}
      <div className="mt-auto flex flex-col items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`relative w-full py-4 rounded-2xl overflow-hidden ${SACRED_GLASS_CLASSES} disabled:opacity-50`}
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(139,92,246,0.1) 60%, rgba(139,92,246,0.06) 100%)',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(255,255,255,0.04), 0 0 20px rgba(139,92,246,0.15), 0 4px 20px rgba(0,0,0,0.25)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={GLASS_HIGHLIGHT_STYLE} />
          <span
            className="text-white"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            {saving ? 'Saving...' : 'Save check-in'}
          </span>
        </button>

        <button
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="text-sm text-slate-400 font-light hover:text-slate-300 transition-colors duration-[233ms] py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
