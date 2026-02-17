'use client';

/**
 * Quiz landing / intro screen
 */
export default function QuizIntro({ onStart }) {
  return (
    <div
      className="w-full max-w-sm mx-auto text-center"
      style={{ animation: 'fadeIn 987ms ease-out' }}
    >
      <h1
        className="text-3xl sm:text-4xl text-white mb-4 leading-tight"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          letterSpacing: '0.04em',
        }}
      >
        Do I have misophonia?
      </h1>

      <p
        className="text-lg text-slate-200 font-light leading-relaxed mb-3"
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
      >
        A 2-minute self-assessment to understand your sound sensitivity
      </p>

      <p className="text-sm text-slate-300 font-light leading-relaxed mb-10">
        13 questions. No sign-up required. Your result is shown immediately.
      </p>

      <button
        onClick={onStart}
        className="
          relative overflow-hidden
          py-4 px-10 rounded-full
          border border-white/[0.18] backdrop-blur-2xl
          hover:border-white/30 transition-all duration-[233ms]
          text-white text-base
        "
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 30px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        Begin
      </button>

      <p className="mt-10 text-xs text-slate-400 font-light">
        This is not a clinical diagnosis. It is a self-assessment to help you understand your experience.
      </p>
    </div>
  );
}
