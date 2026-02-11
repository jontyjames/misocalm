/**
 * Duration Selector
 * Sacred Glass cards for choosing breathing session length
 */

import { ArrowLeft, Star } from 'lucide-react';

const DURATION_OPTIONS_BY_TYPE = {
  '478': [
    { id: 'quick', name: 'A Soft Reset', rounds: 4, time: '~1.5 min', description: 'A few breaths to bring you back to centre' },
    { id: 'deep', name: 'Settling In', rounds: 8, time: '~2.5 min', description: 'Enough space to let your body fully calm' },
    { id: 'full', name: 'Deep Stillness', rounds: 16, time: '~5 min', description: 'A full session to sink into calm' },
  ],
  'box': [
    { id: 'quick', name: 'Finding Ground', rounds: 4, time: '~1.5 min', description: 'A few breaths to steady yourself' },
    { id: 'deep', name: 'Steady State', rounds: 8, time: '~3 min', description: 'Enough space to build real balance' },
    { id: 'full', name: 'Full Anchor', rounds: 12, time: '~4 min', description: 'A full session to find unshakeable ground' },
  ],
  'sigh': [
    { id: 'quick', name: 'Quick Release', rounds: 3, time: '~30 sec', description: 'A quick breath to take the edge off' },
    { id: 'medium', name: 'Letting Go', rounds: 6, time: '~1 min', description: 'Enough space to let the tension leave' },
    { id: 'full', name: 'Complete Unwind', rounds: 10, time: '~1.5 min', description: 'A full session to fully release' },
  ],
};

const BREATH_INSTRUCTIONS = {
  '478': {
    steps: [
      { text: 'Breathe in through your nose for', time: '4 seconds' },
      { text: 'Hold your breath for', time: '7 seconds' },
      { text: 'Breathe out through your mouth for', time: '8 seconds' },
    ],
  },
  'box': {
    steps: [
      { text: 'Breathe in through your nose for', time: '4 seconds' },
      { text: 'Hold your breath for', time: '4 seconds' },
      { text: 'Breathe out through your mouth for', time: '4 seconds' },
      { text: 'Hold empty for', time: '4 seconds' },
    ],
  },
  'sigh': {
    steps: [
      { text: 'Deep breath in through nose for', time: '2 seconds' },
      { text: 'Sip in more air through nose for', time: '1 second' },
      { text: 'Slow exhale through mouth for', time: '6 seconds' },
    ],
  },
};

const CARD_COLORS = [
  { color: 'rgba(99,102,241,', breathe: 'solfeggio-breathe-528 5.28s ease-in-out infinite', badge: 'text-indigo-400 bg-indigo-400/10' },
  { color: 'rgba(139,92,246,', breathe: 'solfeggio-breathe-852 3.7s ease-in-out infinite', badge: 'text-violet-400 bg-violet-400/10' },
  { color: 'rgba(34,211,238,', breathe: 'solfeggio-breathe-741 5.3s ease-in-out infinite', badge: 'text-cyan-400 bg-cyan-400/10' },
];

export { DURATION_OPTIONS_BY_TYPE, BREATH_INSTRUCTIONS };

export default function DurationSelector({ tool, isFavorite, onToggleFavorite, onSelect, onBack }) {
  const options = DURATION_OPTIONS_BY_TYPE[tool.breathType] || DURATION_OPTIONS_BY_TYPE['478'];
  const instructions = tool.breathType && BREATH_INSTRUCTIONS[tool.breathType];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-light">{tool.title}</span>
        <button onClick={onToggleFavorite} className={isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-slate-300'}>
          <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex-1 px-4 py-6">
        <p className="text-slate-300 font-light mb-6">{tool.description}</p>

        {instructions && (
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 mb-6">
            <p className="text-sm text-white font-light mb-2"><strong>How it works:</strong></p>
            <ul className="text-sm text-slate-300 font-light space-y-1">
              {instructions.steps.map((step, i) => (
                <li key={i}>• {step.text} <span className="text-cyan-400">{step.time}</span></li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-lg font-light text-white mb-4">Choose your session</h2>

        <div className="space-y-3">
          {options.map((option, i) => {
            const colors = CARD_COLORS[i];
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option)}
                className="relative w-full p-4 rounded-xl overflow-hidden border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms] text-left"
                style={{
                  background: `linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, ${colors.color}0.08) 100%)`,
                  boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 16px ${colors.color}0.12), 0 4px 20px rgba(0,0,0,0.25)`,
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)' }} />
                <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${colors.color}0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, ${colors.color}0.06) 0%, transparent 60%)` }} />
                <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: `radial-gradient(ellipse 120% 80% at 50% 50%, ${colors.color}0.08) 0%, transparent 70%)`, backgroundSize: '100% 200%', animation: colors.breathe }} />

                <div className="relative flex items-start justify-between mb-2">
                  <p className="text-white font-light text-lg">{option.name}</p>
                  <span className={`text-sm ${colors.badge} px-2 py-0.5 rounded-full`}>{option.time}</span>
                </div>
                <div className="relative">
                  <p className="text-sm text-slate-200 mb-2">{option.description}</p>
                  <p className="text-xs text-slate-300">{option.rounds} rounds</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
