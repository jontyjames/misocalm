/**
 * /learn/understanding-misophonia
 * Article: What I Wish People Understood About Misophonia
 */

import ArticleLayout from '@/components/composed/ArticleLayout';

export const metadata = {
  title: 'What I Wish People Understood About Misophonia',
  description:
    'The invisible weight of living with sound sensitivity. What misophonia really feels like, from someone who has lived with it for over 20 years.',
  keywords: [
    'misophonia',
    'living with misophonia',
    'misophonia personal story',
    'sound sensitivity',
    'misophonia awareness',
    'what is misophonia like',
    'misophonia experience',
  ],
  openGraph: {
    title: 'What I Wish People Understood About Misophonia | MisoCalm',
    description:
      'The invisible weight of living with sound sensitivity, and what it really feels like from the inside.',
    url: 'https://misocalm.app/learn/understanding-misophonia',
  },
};

export default function UnderstandingMisophoniaPage() {
  return (
    <ArticleLayout>
      <h1
        className="text-3xl sm:text-4xl text-white mb-3 leading-tight"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        What I Wish People Understood About Misophonia
      </h1>
      <p className="text-sm text-slate-400 font-light mb-10">4 min read</p>

      <div className="space-y-6 text-slate-200 font-light leading-relaxed">
        <p>
          There's a moment I replay in my head sometimes.
        </p>
        <p>
          I'm sitting at a dinner table with people I love. Someone starts
          chewing. And inside me, something shifts. My chest tightens. My jaw
          locks. Every nerve in my body screams at me to leave. But I stay,
          because how do you explain that to people? How do you say "the sound of
          you eating makes me feel like I'm in danger" without sounding like
          you've lost it?
        </p>
        <p>That's misophonia. And if you're reading this, you probably already know.</p>
        <p>But here's what I wish the people around me understood.</p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          It's not a choice
        </h2>
        <p>
          I can't just "tune it out." I've tried. For years. You know those
          moments where someone says "just ignore it" and you want to scream?
          Yeah. If I could ignore it, don't you think I would have by now? My
          brain processes certain sounds as threats. That's not a preference.
          That's neurology.
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          It's not about you
        </h2>
        <p>
          When I flinch at the sound of your typing or leave the table mid-meal,
          it has nothing to do with how I feel about you. I love you. I want to
          be here. My nervous system just has a different opinion right now.
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          It's exhausting in ways people don't see
        </h2>
        <p>
          The sound itself is only part of it. There's the anticipation. The
          scanning. Walking into a space and immediately mapping every potential
          trigger. Choosing where to sit based on who's likely to eat, tap, or
          sniff. That background hum of hypervigilance? It runs all day. By
          evening, I'm not just tired. I'm depleted.
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          It carries shame
        </h2>
        <p>
          Because the reactions feel irrational, even to us. I've felt guilty for
          being upset by sounds that don't bother anyone else. I've questioned
          whether something is wrong with me. I've hidden it, minimized it,
          apologized for it. For years.
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          But here's what's changing for me
        </h2>
        <p>
          I've started to understand that my nervous system isn't broken. It's
          sensitive. And sensitivity, when you learn to work with it instead of
          against it, can actually become a strength. I've been learning
          regulation techniques, breathing practices, and ways to create space
          between the trigger and my response. It doesn't make the sounds
          disappear. But it gives me something I didn't have before: a way
          through.
        </p>
        <p className="text-indigo-300">
          You're not alone in this. And you're not broken.
        </p>
      </div>
    </ArticleLayout>
  );
}
