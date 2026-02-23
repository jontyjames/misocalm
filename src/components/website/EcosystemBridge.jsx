/**
 * EcosystemBridge — Side-by-side comparison: free app vs TWM community.
 * Dual funnel: free app (lead magnet) + TWM community ($47/month).
 */

'use client';

import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import { FIBONACCI_TIMING } from '@/lib/constants';

function GlassColumn({ children, borderClass = 'border-white/[0.18]', bg, shadow }) {
  return (
    <div
      className={`relative rounded-xl p-8 overflow-hidden border ${borderClass} backdrop-blur-2xl h-full flex flex-col`}
      style={{ background: bg, boxShadow: shadow }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{
          background: borderClass.includes('violet')
            ? 'linear-gradient(90deg, transparent 10%, rgba(139,92,246,0.35) 50%, transparent 90%)'
            : 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 50%, transparent 90%)',
        }}
      />
      <div className="relative flex-1 flex flex-col">{children}</div>
    </div>
  );
}

function BulletList({ items, dotColor }) {
  return (
    <ul className="space-y-2 text-sm text-slate-300 font-light mb-6 flex-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className={`${dotColor} mt-0.5 shrink-0`}>&bull;</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

const FREE_FEATURES = [
  'Breathwork and somatic tools',
  'Trigger journal and check-ins',
  'AI companion',
  'Guided meditative experiences',
];

const TWM_FEATURES = [
  'Live group sessions and Q&A',
  'Structured courses and workshops',
  'Community of people who understand',
  'Direct support from someone who lives with it',
];

const GLASS_BTN = "inline-flex items-center justify-center py-3 px-6 rounded-full text-sm text-white transition-all duration-[233ms]";
const JOSEFIN = { fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 };

export default function EcosystemBridge() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl text-white mb-3" style={JOSEFIN}>
            Two paths, one intention
          </h2>
          <p className="text-slate-300 font-light max-w-lg mx-auto">
            Start free with the app. Go deeper with the community.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ScrollReveal delay={0}>
            <GlassColumn
              bg="linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)"
              shadow="inset 0 1px 0 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.25)"
            >
              <span className="text-xs text-cyan-300 font-light tracking-wide uppercase mb-3">Free forever</span>
              <h3 className="text-xl text-white mb-3" style={JOSEFIN}>MisoCalm App</h3>
              <BulletList items={FREE_FEATURES} dotColor="text-cyan-400" />
              <Link href="/" className={`${GLASS_BTN} border border-white/[0.18] hover:border-white/30`} style={{ ...JOSEFIN, background: 'linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 30%, rgba(99,102,241,0.08) 100%)', width: 'fit-content' }}>
                Start free
              </Link>
            </GlassColumn>
          </ScrollReveal>

          <ScrollReveal delay={FIBONACCI_TIMING.shift}>
            <GlassColumn
              borderClass="border-violet-400/20"
              bg="linear-gradient(160deg, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.05) 100%)"
              shadow="inset 0 1px 0 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.25), 0 0 40px rgba(139,92,246,0.1)"
            >
              <span className="text-xs text-violet-300 font-light tracking-wide uppercase mb-3">Community</span>
              <h3 className="text-xl text-white mb-3" style={JOSEFIN}>Thriving With Misophonia</h3>
              <BulletList items={TWM_FEATURES} dotColor="text-violet-400" />
              <a href="https://www.skool.com/thriving-with-misophonia" target="_blank" rel="noopener noreferrer" className={`${GLASS_BTN} border border-violet-400/30 hover:border-violet-400/50`} style={{ ...JOSEFIN, background: 'linear-gradient(160deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 30%, rgba(99,102,241,0.08) 100%)', width: 'fit-content' }}>
                Learn more
              </a>
            </GlassColumn>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
