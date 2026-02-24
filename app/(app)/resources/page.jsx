/**
 * Resources / Crisis Support Page
 * Safety-critical: always-visible crisis lines, misophonia support, therapy links
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Phone, MessageSquare, Heart, BookOpen, Wind } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/composed';
import { Spinner, PageHeader } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

function ExtLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-indigo-300 hover:text-indigo-200 transition-colors inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
    </a>
  );
}

function Section({ title, icon: Icon, iconColor = 'text-indigo-400', children }) {
  return (
    <div
      className="p-5 rounded-xl border border-white/[0.18] backdrop-blur-xl"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(99,102,241,0.06) 100%)',
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
        </div>
        <h2
          className="text-lg text-white"
          style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 200 }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

export default function ResourcesPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.HOME);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 py-8 pb-32" style={{ animation: 'fadeIn 1.597s ease-out' }}>
        <PageHeader title="Resources" backHref={ROUTES.DASHBOARD} className="mb-6" />

        {/* Warm intro */}
        <p className="text-slate-200 font-light leading-relaxed mb-8">
          You are not alone. Whether you are in crisis or simply looking for support,
          these are here whenever you need them.
        </p>

        <div className="space-y-4">
          {/* Emergency Resources */}
          <Section title="Emergency Support" icon={Phone} iconColor="text-rose-400">
            <ul className="space-y-4">
              <li>
                <p className="text-white font-light">988 Suicide & Crisis Lifeline</p>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Call or text <span className="text-indigo-300 font-normal">988</span> (US)
                  - available 24/7
                </p>
              </li>
              <li>
                <p className="text-white font-light">Crisis Text Line</p>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Text <span className="text-indigo-300 font-normal">HOME</span> to{' '}
                  <span className="text-indigo-300 font-normal">741741</span>
                </p>
              </li>
              <li>
                <ExtLink href="https://www.iasp.info/resources/Crisis_Centres/">
                  <span className="font-light">International Association for Suicide Prevention</span>
                </ExtLink>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Find a crisis centre in your country
                </p>
              </li>
            </ul>
          </Section>

          {/* Misophonia-Specific Support */}
          <Section title="Misophonia Support" icon={Heart} iconColor="text-violet-400">
            <ul className="space-y-4">
              <li>
                <ExtLink href="https://misophonia-association.org">
                  <span className="font-light">Misophonia Association</span>
                </ExtLink>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Research, advocacy, and community resources
                </p>
              </li>
              <li>
                <ExtLink href="https://www.reddit.com/r/misophonia">
                  <span className="font-light">r/misophonia</span>
                </ExtLink>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  A community of 87,000+ people who understand what you experience
                </p>
              </li>
              <li>
                <ExtLink href="https://misophoniainternational.com">
                  <span className="font-light">Misophonia International</span>
                </ExtLink>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Education, coping strategies, and provider directory
                </p>
              </li>
            </ul>
          </Section>

          {/* Find a Therapist */}
          <Section title="Find a Therapist" icon={MessageSquare} iconColor="text-cyan-400">
            <ul className="space-y-4">
              <li>
                <ExtLink href="https://www.psychologytoday.com/us/therapists">
                  <span className="font-light">Psychology Today Therapist Finder</span>
                </ExtLink>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Search by location, specialty, and insurance
                </p>
              </li>
              <li>
                <ExtLink href="https://www.betterhelp.com">
                  <span className="font-light">BetterHelp</span>
                </ExtLink>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Online therapy from anywhere
                </p>
              </li>
            </ul>
            <p className="text-sm text-slate-300 font-light mt-4 pt-3 border-t border-slate-700/50">
              Look for therapists experienced with sensory processing, CBT, or
              misophonia specifically. You deserve someone who gets it.
            </p>
          </Section>

          {/* Self-Help Resources */}
          <Section title="Self-Help Within MisoCalm" icon={Wind} iconColor="text-indigo-400">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => router.push(ROUTES.TOOLS)}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors font-light"
                >
                  Breathing & Calming Tools
                </button>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Guided breathing practices to calm your nervous system
                </p>
              </li>
              <li>
                <button
                  onClick={() => router.push(ROUTES.JOURNAL)}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors font-light"
                >
                  Journal
                </button>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  Process what you are feeling at your own pace
                </p>
              </li>
              <li>
                <ExtLink href="https://www.skool.com/thriving-with-misophonia">
                  <span className="font-light">Thriving With Misophonia Community</span>
                </ExtLink>
                <p className="text-sm text-slate-300 font-light mt-0.5">
                  A supportive space for people learning to live well with misophonia
                </p>
              </li>
            </ul>
          </Section>

          {/* Read more (internal nav) */}
          <button
            onClick={() => router.push(ROUTES.TOOLS)}
            className="w-full p-4 rounded-xl border border-white/[0.18] backdrop-blur-xl hover:border-white/30 transition-all duration-[233ms] text-left flex items-center gap-4"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          >
            <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-white font-light">Explore all tools</p>
              <p className="text-sm text-slate-300 font-light">Breathing, grounding, soundscapes, and more</p>
            </div>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p className="text-xs text-slate-300 font-light leading-relaxed">
            MisoCalm is a wellness tool, not a substitute for professional mental health care.
            If you are in immediate danger, please call your local emergency services.
            These resources are provided for informational purposes and may change over time.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
