/**
 * /learn/what-to-say
 * Article: 7 Things to Say (and Not Say) to Someone With Misophonia
 */

import ArticleLayout from '@/components/composed/ArticleLayout';

export const metadata = {
  title: '7 Things to Say (and Not Say) to Someone With Misophonia',
  description:
    'A guide for partners, parents, friends, and anyone who wants to support someone with misophonia. What helps, what hurts, and why it matters.',
  keywords: [
    'misophonia support',
    'how to help misophonia',
    'misophonia partner',
    'misophonia family',
    'misophonia relationships',
    'what to say misophonia',
    'supporting someone with misophonia',
    'misophonia validation',
    'misophonia communication',
  ],
  openGraph: {
    title:
      '7 Things to Say (and Not Say) to Someone With Misophonia | MisoCalm',
    description:
      'A guide for partners, parents, friends, and anyone who wants to be supportive.',
    url: 'https://misocalm.app/learn/what-to-say',
  },
};

function DoAndDont({ number, doSay, dontSay, why }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400 font-light">{number}</p>
      <div className="space-y-2">
        <p className="text-slate-200 font-light leading-relaxed">
          <span className="text-emerald-400 text-sm mr-2">Say:</span>
          <span className="text-white">"{doSay}"</span>
        </p>
        <p className="text-slate-200 font-light leading-relaxed">
          <span className="text-rose-400/80 text-sm mr-2">Not:</span>
          <span className="text-slate-300">"{dontSay}"</span>
        </p>
      </div>
      <p className="text-sm text-slate-300 font-light leading-relaxed">{why}</p>
    </div>
  );
}

export default function WhatToSayPage() {
  return (
    <ArticleLayout slug="what-to-say">
      <h1
        className="text-3xl sm:text-4xl text-white mb-3 leading-tight"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        7 Things to Say (and Not Say) to Someone With Misophonia
      </h1>
      <p className="text-sm text-slate-400 font-light mb-3">4 min read</p>
      <p className="text-sm text-slate-300 font-light mb-10">
        A guide for partners, parents, friends, and anyone who wants to be
        supportive.
      </p>

      <div className="space-y-10">
        <DoAndDont
          number="1"
          doSay="I believe you. I can see this is really hard."
          dontSay="You're overreacting."
          why="The single most helpful thing you can do is validate their experience. People with misophonia have often spent years being told their reactions aren't real or aren't proportional. Simply believing them can be profoundly healing."
        />

        <div className="border-t border-white/[0.06]" />

        <DoAndDont
          number="2"
          doSay="What would help right now? Do you need to step away?"
          dontSay="Just ignore it."
          why="Offering a way out, without judgement, gives them agency. Telling them to ignore it suggests they haven't tried, when in reality they've probably been trying to ignore it for years. It's like telling someone with a broken arm to ignore the pain."
        />

        <div className="border-t border-white/[0.06]" />

        <DoAndDont
          number="3"
          doSay="It's okay to leave the room. I won't take it personally."
          dontSay="Why does it bother you so much? It's just chewing."
          why="When someone with misophonia leaves a room, they often feel guilty about it. Giving them explicit permission to take space, without making it about you, removes a layer of stress they carry every single day."
        />

        <div className="border-t border-white/[0.06]" />

        <DoAndDont
          number="4"
          doSay="I looked into misophonia so I could understand better."
          dontSay="Everyone has things that annoy them."
          why="Taking the time to learn about their condition shows genuine care. Comparing misophonia to ordinary annoyance minimises a neurological response and makes them feel like they need to justify something they can't control."
        />

        <div className="border-t border-white/[0.06]" />

        <DoAndDont
          number="5"
          doSay="Let's figure out what works for both of us."
          dontSay="You need to get over this."
          why="Misophonia affects relationships, and navigating it together builds trust. Framing it as a shared problem (not their problem) makes all the difference. Telling someone to 'get over' a neurological condition is like asking someone to think away an allergy."
        />

        <div className="border-t border-white/[0.06]" />

        <DoAndDont
          number="6"
          doSay="I noticed you seemed tense. Are you okay?"
          dontSay="You're making everyone uncomfortable."
          why="Quietly checking in shows awareness without drawing attention. Telling them they're making others uncomfortable adds shame on top of an already overwhelming experience, and makes them less likely to ask for help next time."
        />

        <div className="border-t border-white/[0.06]" />

        <DoAndDont
          number="7"
          doSay="I'm glad you told me about this."
          dontSay="That's not a real condition."
          why="It takes courage to tell someone about misophonia. Many people with it have been dismissed, laughed at, or told they're making it up. When someone trusts you enough to share it, honouring that trust is one of the most supportive things you can do."
        />

        <p className="text-indigo-300 pt-4">
          If you found this helpful, pass it along to someone in your life who
          could use it. Understanding is the first step toward support.
        </p>
      </div>
    </ArticleLayout>
  );
}
