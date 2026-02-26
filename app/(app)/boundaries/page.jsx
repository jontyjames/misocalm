/**
 * Boundaries Page
 * Scripts for setting gentle boundaries
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { usePremiumContext } from '@/context/PremiumContext';
import { useAuthGuard } from '@/hooks';
import { Card, Spinner, PremiumGate, PageHeader } from '@/components/ui';
import { AppLayout } from '@/components/composed';
import { ROUTES } from '@/lib/constants';

const boundaryScripts = {
  'With Family': [
    {
      title: 'At the dinner table',
      script: "I love spending time with you at meals. I've noticed I'm more relaxed when we eat a bit slower. Would you mind if we tried that?",
      tips: 'Keep your tone warm and avoid blaming. Focus on your experience, not their behavior.',
    },
    {
      title: 'When sounds are overwhelming',
      script: "I need to step away for a few minutes to reset. It's not about you - I just need some quiet time. I'll be back soon.",
      tips: 'Give yourself permission to take breaks without over-explaining.',
    },
    {
      title: 'Explaining your condition',
      script: "I have something called misophonia - certain sounds trigger a strong reaction in my brain. It's not something I can control, but I'm working on managing it.",
      tips: 'Keep it simple. Most people don\'t need a full explanation.',
    },
  ],
  'At Work': [
    {
      title: 'Requesting accommodation',
      script: "I work best when I can minimize auditory distractions. Would it be possible for me to use noise-canceling headphones or work in a quieter area sometimes?",
      tips: 'Frame it as a productivity enhancement, not a problem.',
    },
    {
      title: 'With a loud colleague',
      script: "Hey, I'm having trouble focusing right now. Would you mind if I put on headphones, or would you prefer I move to a different spot?",
      tips: 'Offer alternatives so they don\'t feel criticized.',
    },
    {
      title: 'During meetings',
      script: "I focus better when there's less background noise during meetings. Could we consider a quick reminder about muting mics when not speaking?",
      tips: 'Make it about the meeting, not any individual.',
    },
  ],
  'With Friends': [
    {
      title: 'At restaurants',
      script: "Do you mind if we grab a table in a quieter corner? I find it easier to enjoy our conversation without too much background noise.",
      tips: 'Present it as enhancing the experience for both of you.',
    },
    {
      title: 'When hanging out',
      script: "I might need to take a short break now and then - it helps me stay present when we're together.",
      tips: 'Good friends will understand. You don\'t owe detailed explanations.',
    },
    {
      title: 'Setting expectations',
      script: "Just a heads up, there are some sounds that really bother me. If I seem distracted sometimes, that's probably why. It's not you!",
      tips: 'A little humor can help normalize the conversation.',
    },
  ],
};

export default function BoundariesPage() {
  const router = useRouter();
  const { loading } = useAuthGuard();
  const [expandedSection, setExpandedSection] = useState('With Family');
  const [expandedScript, setExpandedScript] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleCopy = async (script, id) => {
    await navigator.clipboard.writeText(script);
    setCopied(id);
    setTimeout(() => setCopied(null), 1597); // fib-ceremony
  };

  const { isPremium, isLoading: premiumLoading } = usePremiumContext();

  if (loading || premiumLoading) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!isPremium) {
    return (
      <AppLayout showNav={false}>
        <PageHeader title="Gentle Boundaries" backHref={ROUTES.DASHBOARD} className="px-6 py-8" />
        <PremiumGate feature="Boundary scripts" />
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false}>
      <div className="px-6 py-8">
        <PageHeader title="Gentle Boundaries" backHref={ROUTES.DASHBOARD} className="mb-6" />

        {/* Intro */}
        <p className="text-slate-300 font-light mb-8">
          Ready-to-use scripts for communicating your needs with compassion.
          These are starting points. Adapt them to fit your situation and voice.
        </p>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {Object.entries(boundaryScripts).map(([section, scripts]) => (
            <div key={section}>
              {/* Section Header */}
              <button
                onClick={() => setExpandedSection(expandedSection === section ? null : section)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors group"
              >
                <span className="text-white font-light">{section}</span>
                {expandedSection === section ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
                )}
              </button>

              {/* Scripts */}
              {expandedSection === section && (
                <div className="mt-2 space-y-2 pl-4">
                  {scripts.map((script, i) => {
                    const id = `${section}-${i}`;
                    const isExpanded = expandedScript === id;

                    return (
                      <Card key={id} padding="p-4">
                        <button
                          onClick={() => setExpandedScript(isExpanded ? null : id)}
                          className="w-full flex items-center justify-between text-left focus:outline-none group/script"
                        >
                          <span className="text-white font-light">{script.title}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 group-hover/script:scale-110 transition-transform" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover/script:scale-110 transition-transform" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-800">
                            {/* Script text */}
                            <p className="text-slate-300 font-light mb-4 italic">
                              "{script.script}"
                            </p>

                            {/* Copy button */}
                            <button
                              onClick={() => handleCopy(script.script, id)}
                              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 mb-4"
                            >
                              {copied === id ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy to clipboard
                                </>
                              )}
                            </button>

                            {/* Tips */}
                            <div className="p-3 rounded-lg bg-slate-800/50">
                              <p className="text-xs text-slate-300">
                                <strong className="text-slate-200">Tip:</strong> {script.tips}
                              </p>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
