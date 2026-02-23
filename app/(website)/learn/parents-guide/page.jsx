/**
 * /learn/parents-guide
 * Comprehensive guide for parents of children with misophonia.
 * Long-form SEO content from the 8-part parent guide.
 */

import ArticleLayout from '@/components/composed/ArticleLayout';
import {
  WhatIsMisophonia,
  CommonSigns,
  WhatNotToDo,
  WhatHelps,
  HavingTheConversation,
  BuildingSupportPlan,
  ToolsAndResources,
  NoteOfHope,
} from './sections';

export const metadata = {
  title: "Understanding Your Child's Misophonia: A Parent's Guide",
  description:
    "A practical, compassionate guide for parents of children with misophonia. What it is, what helps, what to avoid, and how to build a family support plan.",
  keywords: [
    'misophonia children',
    'misophonia parenting',
    'child misophonia help',
    'misophonia family',
    'misophonia parent guide',
    'child sound sensitivity',
    'misophonia at school',
    'misophonia dinner table',
    'helping child with misophonia',
    'misophonia what to do',
    'misophonia support plan',
  ],
  openGraph: {
    title: "Understanding Your Child's Misophonia | MisoCalm",
    description:
      'A practical, compassionate guide for parents who want to help their child navigate sound sensitivity.',
    url: 'https://misocalm.app/learn/parents-guide',
  },
};

export default function ParentsGuidePage() {
  return (
    <ArticleLayout slug="parents-guide">
      <h1
        className="text-3xl sm:text-4xl text-white mb-3 leading-tight"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        Understanding Your Child's Misophonia
      </h1>
      <p className="text-sm text-slate-400 font-light mb-3">15 min read</p>
      <p className="text-slate-300 font-light leading-relaxed mb-10">
        A practical, compassionate guide for parents who want to help their
        child navigate misophonia with confidence and care.
      </p>

      <nav className="mb-12 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
        <p
          className="text-sm text-slate-400 font-light mb-3"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          In this guide
        </p>
        <ol className="space-y-2 text-sm text-slate-300 font-light list-decimal list-inside">
          <li>What is misophonia?</li>
          <li>Common signs to watch for</li>
          <li>What not to do</li>
          <li>What helps</li>
          <li>Having the conversation</li>
          <li>Building a support plan together</li>
          <li>Tools and resources</li>
          <li>A note of hope</li>
        </ol>
      </nav>

      <div className="space-y-16">
        <WhatIsMisophonia />
        <CommonSigns />
        <WhatNotToDo />
        <WhatHelps />
        <HavingTheConversation />
        <BuildingSupportPlan />
        <ToolsAndResources />
        <NoteOfHope />
      </div>
    </ArticleLayout>
  );
}
