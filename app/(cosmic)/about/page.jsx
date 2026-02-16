/**
 * About / SEO Landing Page
 * Server component for full search engine indexability.
 * Rich content about misophonia and what MisoCalm offers.
 */

import Link from 'next/link';

export const metadata = {
  title: 'About MisoCalm - Misophonia Support App',
  description:
    'MisoCalm is a free companion app for living with misophonia. Breathwork, journaling, guided experiences, and AI support. Built with empathy, not pressure.',
  keywords: [
    'misophonia',
    'misophonia app',
    'misophonia help',
    'misophonia coping',
    'misophonia tools',
    'misophonia breathing',
    'misophonia support',
    'sound sensitivity',
    'sound sensitivity help',
    'misophonia journal',
  ],
  openGraph: {
    title: 'MisoCalm - A space for living with misophonia',
    description:
      'Free breathwork, journaling, guided experiences, and AI support for people living with misophonia.',
    type: 'website',
  },
};

/* ─── Sacred Glass card (static, server-safe) ──────────────────────── */
function GlassCard({ children, className = '', delay = 0 }) {
  return (
    <div
      className={`
        relative rounded-xl p-6 overflow-hidden
        border border-white/[0.18] backdrop-blur-2xl
        opacity-0 animate-fade-in-up
        ${className}
      `}
      style={{
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)',
        boxShadow:
          'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.25)',
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Glass top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)',
        }}
      />
      {/* Phi opacity layers */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background:
            'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.03) 40%, transparent 65%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ─── Feature item within a card ───────────────────────────────────── */
function Feature({ title, description, color = 'indigo' }) {
  const dotColors = {
    indigo: 'bg-indigo-400',
    cyan: 'bg-cyan-400',
    violet: 'bg-purple-400',
  };

  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-[7px] w-[6px] h-[6px] rounded-full shrink-0 ${dotColors[color] || dotColors.indigo}`}
      />
      <div>
        <h3
          className="text-lg text-white mb-1"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          {title}
        </h3>
        <p className="text-sm font-light text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16 sm:py-24">
      <div className="w-full max-w-xl">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          className="text-center mb-16"
          style={{ animation: 'fadeIn 987ms ease-out' }}
        >
          <h1
            className="text-3xl sm:text-4xl text-white mb-4 leading-tight"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              letterSpacing: '0.06em',
            }}
          >
            MisoCalm
          </h1>
          <p
            className="text-xl sm:text-2xl text-slate-200 leading-relaxed"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
            }}
          >
            A space for living with misophonia
          </p>
        </section>

        {/* ── What is misophonia? ──────────────────────────────── */}
        <section className="mb-16">
          <GlassCard delay={110}>
            <h2
              className="text-2xl text-white mb-4"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
              }}
            >
              What is misophonia?
            </h2>
            <div className="space-y-4 text-slate-200 font-light leading-relaxed">
              <p>
                If certain sounds make you feel a rush of anger, panic, or the
                overwhelming need to escape, you are not alone. Misophonia is a
                neurological condition where specific sounds trigger intense
                emotional and physical responses that go far beyond simple
                annoyance.
              </p>
              <p>
                It is not about being too sensitive. Your nervous system is
                responding to something real. And there are ways to work with it,
                gently.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* ── What MisoCalm offers ─────────────────────────────── */}
        <section className="mb-16">
          <h2
            className="text-2xl text-white mb-6 text-center"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              animation: 'fadeIn 987ms ease-out 220ms both',
            }}
          >
            What MisoCalm offers
          </h2>

          <div className="space-y-4">
            <GlassCard delay={275}>
              <div className="space-y-5">
                <Feature
                  title="Breathwork tools"
                  description="4-7-8 Breathing, Box Breathing, and Physiological Sigh. Techniques backed by research to calm your nervous system in the moment."
                  color="cyan"
                />
                <Feature
                  title="Guided experiences"
                  description="Mandala drawing, Pulse awareness, and an Impermanence meditation. Gentle practices that help you return to yourself when sounds pull you away."
                  color="violet"
                />
              </div>
            </GlassCard>

            <GlassCard delay={330}>
              <div className="space-y-5">
                <Feature
                  title="Journal and check-in tools"
                  description="Track triggers, log how you feel, and notice patterns over time. Not to score yourself, just to understand. A place to process what happened and honour what you felt."
                  color="indigo"
                />
                <Feature
                  title="AI companion"
                  description="A warm, patient space to talk through difficult moments. Not a therapist, not a chatbot with scripts. A companion that listens and helps you make sense of what you are going through."
                  color="cyan"
                />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ── Built for you, not at you ────────────────────────── */}
        <section className="mb-16">
          <GlassCard delay={385}>
            <h2
              className="text-2xl text-white mb-5"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 200,
              }}
            >
              Built for you, not at you
            </h2>
            <div className="space-y-4 text-slate-200 font-light leading-relaxed">
              <p>
                MisoCalm does not count your streaks, lock features behind
                gates, or push you to do more. There is no leaderboard.
                No daily targets. No guilt if you step away.
              </p>
              <p>
                Your data stays private. Your experience is yours. The app is
                free to use.
              </p>
              <p className="text-indigo-300">
                This is a space that meets you where you are, not where someone
                else thinks you should be.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section
          className="text-center"
          style={{ animation: 'fadeIn 987ms ease-out 440ms both' }}
        >
          <p
            className="text-lg text-slate-200 mb-6 font-light leading-relaxed"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
            }}
          >
            If you have been looking for something that understands,
            <br className="hidden sm:block" /> this is it.
          </p>

          <Link
            href="/"
            className="
              inline-block relative overflow-hidden
              py-4 px-10 rounded-full
              border border-white/[0.18] backdrop-blur-2xl
              hover:border-white/30 transition-all duration-[233ms]
              text-white text-base
            "
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              background:
                'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
              boxShadow:
                'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 30px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            Enter MisoCalm
          </Link>

          <p className="mt-10 text-xs text-slate-300 font-light">
            A Thriving With Misophonia App
          </p>
        </section>
      </div>
    </main>
  );
}
