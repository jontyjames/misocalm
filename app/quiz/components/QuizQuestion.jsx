'use client';

import { useState } from 'react';
import { SACRED_GLASS_STATIC_CLASSES, sacredGlassStaticStyle, GLASS_HIGHLIGHT_STYLE, PHI_LAYERS_STYLE } from '@/lib/sacredGlass';

/**
 * Single quiz question with 3 glass card options
 * Auto-advances after 377ms on selection
 */
export default function QuizQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (optionIndex, score) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setTimeout(() => onAnswer(score), 377);
  };

  return (
    <div
      className="w-full max-w-sm mx-auto"
      style={{ animation: 'fadeInUp 377ms ease-out' }}
    >
      <h2
        className="text-xl sm:text-2xl text-white text-center mb-8 leading-relaxed"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i, option.score)}
            className={`
              relative w-full text-left p-4 rounded-xl overflow-hidden
              ${SACRED_GLASS_STATIC_CLASSES}
              hover:border-white/30 transition-all duration-[233ms]
              ${selected === i
                ? '!border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : ''
              }
            `}
            style={{
              background: selected === i
                ? 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(99,102,241,0.15) 100%)'
                : sacredGlassStaticStyle().background,
              boxShadow: sacredGlassStaticStyle().boxShadow,
            }}
          >
            {/* Glass top highlight */}
            <div
              className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
              style={GLASS_HIGHLIGHT_STYLE}
            />
            {/* Phi opacity layer */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={PHI_LAYERS_STYLE}
            />

            <p className="relative text-lg text-white font-light">{option.label}</p>
            <p className="relative text-sm text-indigo-300 font-light mt-1">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
