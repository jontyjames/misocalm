'use client';

import Link from 'next/link';

/**
 * Guide content renderer — personalized techniques page
 */
export default function GuideContent({ guide }) {
  const accentMap = {
    cyan: { text: 'text-cyan-300', border: 'border-cyan-400/30', dot: 'bg-cyan-400' },
    indigo: { text: 'text-indigo-300', border: 'border-indigo-400/30', dot: 'bg-indigo-400' },
    violet: { text: 'text-purple-300', border: 'border-purple-400/30', dot: 'bg-purple-400' },
  };
  const accent = accentMap[guide.accent] || accentMap.indigo;

  const glowStyle = guide.glow
    ? { textShadow: '0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.2)' }
    : {};

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 sm:py-16">
      <div className="w-full max-w-lg">

        {/* Header */}
        <header
          className="text-center mb-12"
          style={{ animation: 'fadeIn 987ms ease-out' }}
        >
          <p className={`text-sm ${accent.text} font-light mb-3 tracking-wide uppercase`}>
            Your personalized guide
          </p>
          <h1
            className={`text-3xl sm:text-4xl text-white mb-3 leading-tight ${guide.glow ? 'text-purple-200' : ''}`}
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              ...glowStyle,
            }}
          >
            {guide.title}
          </h1>
          <p
            className="text-lg text-slate-200 font-light"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            {guide.subtitle}
          </p>
        </header>

        {/* Intro */}
        <section
          className="mb-10"
          style={{ animation: 'fadeInUp 377ms ease-out 144ms both' }}
        >
          <p className="text-slate-200 font-light leading-relaxed">
            {guide.intro}
          </p>
        </section>

        {/* What's happening */}
        <section
          className="mb-12"
          style={{ animation: 'fadeInUp 377ms ease-out 233ms both' }}
        >
          <GlassCard>
            <h2
              className="text-xl text-white mb-4"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              {guide.whatsHappening.heading}
            </h2>
            <p className="text-slate-200 font-light leading-relaxed">
              {guide.whatsHappening.body}
            </p>
          </GlassCard>
        </section>

        {/* Techniques */}
        <section className="mb-12">
          <h2
            className="text-2xl text-white text-center mb-8"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              animation: 'fadeInUp 377ms ease-out 377ms both',
            }}
          >
            3 practices that help
          </h2>

          <div className="space-y-6">
            {guide.techniques.map((technique, i) => (
              <div
                key={i}
                style={{ animation: `fadeInUp 377ms ease-out ${610 + i * 144}ms both` }}
              >
                <GlassCard>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`mt-[6px] w-[6px] h-[6px] rounded-full shrink-0 ${accent.dot}`} />
                    <h3
                      className="text-lg text-white"
                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                    >
                      {technique.name}
                    </h3>
                  </div>

                  <p className={`text-sm ${accent.text} font-light mb-3`}>
                    {technique.why}
                  </p>

                  <p className="text-slate-200 font-light leading-relaxed mb-3">
                    {technique.how}
                  </p>

                  <p className="text-sm text-slate-400 font-light">
                    <span className="text-slate-300">When to use it:</span> {technique.when}
                  </p>
                </GlassCard>
              </div>
            ))}
          </div>
        </section>

        {/* Learn more */}
        {guide.learnMore?.length > 0 && (
          <section
            className="mb-12"
            style={{ animation: 'fadeInUp 377ms ease-out 770ms both' }}
          >
            <h2
              className="text-xl text-white mb-6"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
            >
              Learn more about misophonia
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guide.learnMore.map((article) => (
                <Link
                  key={article.slug}
                  href={`/learn/${article.slug}`}
                  className="block group"
                >
                  <GlassCard>
                    <h3
                      className="text-sm text-white mb-1 group-hover:text-indigo-200 transition-colors duration-[233ms]"
                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
                    >
                      {article.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-light">
                      {article.readingTime} read
                    </span>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          className="text-center"
          style={{ animation: 'fadeInUp 377ms ease-out 880ms both' }}
        >
          <p
            className="text-lg text-slate-200 font-light mb-6"
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
          >
            These techniques are built into MisoCalm
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
              background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 0 30px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            Try MisoCalm free
          </Link>

          <p className="mt-8 text-xs text-slate-400 font-light">
            Breathwork, journaling, and nervous system tools. No sign-up pressure. No guilt.
          </p>
        </section>
      </div>
    </div>
  );
}

/* ─── Glass Card (local, matches app pattern) ────────────────────── */
function GlassCard({ children }) {
  return (
    <div
      className="relative rounded-xl p-6 overflow-hidden border border-white/[0.18] backdrop-blur-2xl"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)',
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)' }} />
      <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 20%, transparent 45%)' }} />
      <div className="relative">{children}</div>
    </div>
  );
}
