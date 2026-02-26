/**
 * Coming Soon
 * Tool-specific placeholder for practices being crafted
 * Accepts tool data to render a personalized preview
 */

'use client';

import { Sparkles, ArrowLeft, Clock } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useReducedMotion } from '@/hooks';

// Tool-specific content — poetic, warm, never clinical
const TOOL_CONTENT = {
  '2': {
    subtitle: 'A guided return to your body',
    preview: [
      'Release stored tension, one layer at a time',
      'Reconnect with what your body is holding',
      'Gentle attention without judgment',
    ],
  },
  '6': {
    subtitle: 'Tense, release, discover stillness',
    preview: [
      'Systematic work through each muscle group',
      'Notice the contrast between tension and calm',
      'Your body already knows how to let go',
    ],
  },
  '7': {
    subtitle: 'See your sound sensitivities from a new angle',
    preview: [
      'Gentle perspective shifts, at your own pace',
      'Understand the story behind the reaction',
      'Rewrite the narrative when you are ready',
    ],
  },
};

const CATEGORY_COLORS = {
  somatic: 'cyan',
  cognitive: 'purple',
  breathwork: 'indigo',
};

export default function ComingSoon({ tool, onBack }) {
  const prefersReduced = useReducedMotion();
  const content = TOOL_CONTENT[tool?.id] || {};
  const title = tool?.title || 'New Practice';
  const subtitle = content.subtitle || 'Something new is being crafted';
  const preview = content.preview || [];
  const duration = tool?.duration_minutes;
  const category = tool?.category;
  const categoryColor = CATEGORY_COLORS[category] || 'indigo';

  return (
    <div
      className="flex-1 flex flex-col items-center px-6 pt-16 pb-10 text-center"
      style={{ animation: prefersReduced ? 'none' : 'fadeIn 610ms ease-out' }}
    >
      {/* Glowing icon */}
      <div
        className="w-20 h-20 rounded-full border-2 border-violet-500/30 flex items-center justify-center mb-10"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          boxShadow: '0 0 30px rgba(139,92,246,0.15)',
        }}
      >
        <Sparkles className="w-8 h-8 text-violet-400" />
      </div>

      {/* Title */}
      <h2
        className="text-2xl text-white mb-2"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          textShadow: '0 0 20px rgba(139,92,246,0.3)',
        }}
      >
        {title}
      </h2>

      {/* Subtitle */}
      <p
        className="text-sm text-indigo-300 font-light mb-6"
        style={{ animation: prefersReduced ? 'none' : 'fadeIn 987ms ease-out' }}
      >
        {subtitle}
      </p>

      {/* Meta badges */}
      <div
        className={`flex items-center gap-3 mb-10 ${prefersReduced ? '' : 'opacity-0'}`}
        style={{ animation: prefersReduced ? 'none' : 'fadeIn 377ms ease-out 377ms forwards' }}
      >
        {category && (
          <Badge color={categoryColor} size="sm">{category}</Badge>
        )}
        {duration && (
          <span className="text-xs text-slate-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            ~{duration} min
          </span>
        )}
      </div>

      {/* Preview card */}
      {preview.length > 0 && (
        <div
          className={`w-full max-w-sm rounded-xl p-6 mb-10 text-left ${prefersReduced ? '' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.04) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.2)',
            animation: prefersReduced ? 'none' : 'fadeInUp 610ms ease-out 610ms forwards',
          }}
        >
          <p
            className="text-xs text-slate-300 font-light uppercase tracking-wider mb-4"
            style={{ letterSpacing: '0.1em' }}
          >
            What to expect
          </p>
          <ul className="space-y-3">
            {preview.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-400/60 mt-1.5 shrink-0"
                />
                <span className="text-sm text-slate-200 font-light">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Being crafted indicator */}
      <p
        className={`text-sm text-slate-300 font-light mb-10 ${prefersReduced ? '' : 'opacity-0'}`}
        style={{ animation: prefersReduced ? 'none' : 'fadeIn 377ms ease-out 987ms forwards' }}
      >
        Being carefully crafted. When it arrives, it will be here waiting for you.
      </p>

      {/* Back button */}
      <button
        onClick={onBack}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-light border-2 border-white/[0.33] hover:border-white/40 text-white transition-all duration-[233ms] ${prefersReduced ? '' : 'opacity-0'}`}
        style={{
          background: 'rgba(139,92,246,0.08)',
          boxShadow: '0 0 12px rgba(255,255,255,0.06)',
          animation: prefersReduced ? 'none' : 'fadeIn 377ms ease-out 1597ms forwards',
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to practices
      </button>
    </div>
  );
}
