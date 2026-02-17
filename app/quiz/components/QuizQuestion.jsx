'use client';

import { useState } from 'react';

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
              border border-white/[0.18] backdrop-blur-2xl
              hover:border-white/30 transition-all duration-[233ms]
              ${selected === i
                ? '!border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : ''
              }
            `}
            style={{
              background: selected === i
                ? 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 30%, rgba(99,102,241,0.15) 100%)'
                : 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.25)',
            }}
          >
            {/* Glass top highlight */}
            <div
              className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)' }}
            />
            {/* Phi opacity layer */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 20%, transparent 45%)' }}
            />

            <p className="relative text-lg text-white font-light">{option.label}</p>
            <p className="relative text-sm text-indigo-300 font-light mt-1">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
