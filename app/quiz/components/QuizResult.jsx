'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { quizService } from '@/services/quizService';
import { isValidEmail } from '@/lib/validators';

/**
 * Result display + email capture
 */
export default function QuizResult({ result, answers, utmParams, onEmailSubmitted }) {
  const { category, total } = result;
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fade in email capture after 987ms
  useEffect(() => {
    const timer = setTimeout(() => setShowEmail(true), 987);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: saveError } = await quizService.saveLead({
      email,
      result_category: category.key,
      total_score: total,
      answers,
      referrer: typeof document !== 'undefined' ? document.referrer : null,
      ...utmParams,
    });

    setSubmitting(false);

    if (saveError) {
      setError('Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
    onEmailSubmitted?.();
  };

  // Accent colour classes
  const accentMap = {
    cyan: 'text-cyan-300',
    indigo: 'text-indigo-300',
    violet: 'text-purple-300',
  };
  const accentClass = accentMap[category.accent] || 'text-indigo-300';

  const glowStyle = category.glow
    ? { textShadow: '0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.2)' }
    : {};

  return (
    <div
      className="w-full max-w-sm mx-auto"
      style={{ animation: 'fadeIn 610ms ease-out' }}
    >
      {/* Result heading */}
      <h2
        className={`text-2xl sm:text-3xl text-white text-center mb-8 leading-relaxed ${category.glow ? 'text-purple-200' : ''}`}
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          ...glowStyle,
        }}
      >
        {category.heading}
      </h2>

      {/* Result paragraphs */}
      <div className="space-y-4 mb-10">
        {category.paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-slate-200 font-light leading-relaxed"
            style={{
              animation: `fadeInUp 377ms ease-out ${110 + i * 110}ms both`,
            }}
          >
            {p}
          </p>
        ))}
      </div>

      {/* Email capture */}
      {showEmail && !submitted && (
        <div
          className="relative rounded-xl p-6 overflow-hidden border border-white/[0.18] backdrop-blur-2xl mb-6"
          style={{
            animation: 'fadeInUp 610ms ease-out',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.25)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)' }} />

          <p className={`text-lg font-light mb-2 ${accentClass}`} style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
            Get your personalized breakdown and 3 techniques that help
          </p>
          <p className="text-sm text-slate-300 font-light mb-4">
            We&apos;ll send a brief guide based on your responses. No spam, just support.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="
                w-full px-4 py-3 rounded-lg
                bg-white/[0.06] border border-white/[0.12]
                text-white placeholder-slate-500
                focus:outline-none focus:border-indigo-400/50
                transition-colors duration-[233ms]
                text-base font-light
              "
              autoComplete="email"
            />
            {error && <p className="text-sm text-rose-400 font-light">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="
                w-full py-3 rounded-lg
                border border-white/[0.18]
                text-white text-base font-light
                hover:border-white/30 transition-all duration-[233ms]
                disabled:opacity-50
              "
              style={{
                background: 'linear-gradient(160deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.08) 100%)',
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
              }}
            >
              {submitting ? 'Sending...' : 'Send my guide'}
            </button>
          </form>
        </div>
      )}

      {/* Success message */}
      {submitted && (
        <div
          className="text-center mb-6"
          style={{ animation: 'fadeIn 610ms ease-out' }}
        >
          <p className={`text-lg font-light ${accentClass}`} style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}>
            Check your inbox. Welcome to the community.
          </p>
        </div>
      )}

      {/* Explore MisoCalm link */}
      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-indigo-300 font-light hover:text-indigo-200 transition-colors duration-[233ms]"
        >
          Explore MisoCalm
        </Link>
      </div>
    </div>
  );
}
