/**
 * /learn/misophonia-at-work
 * Article: The Invisible Weight of Misophonia at Work
 */

import ArticleLayout from '@/components/composed/ArticleLayout';

export const metadata = {
  title: 'The Invisible Weight of Misophonia at Work',
  description:
    'Navigating open-plan offices, meetings, and desk lunches when your nervous system won\'t filter sounds. Practical strategies for managing misophonia in the workplace.',
  keywords: [
    'misophonia at work',
    'misophonia office',
    'misophonia workplace',
    'misophonia open plan office',
    'sound sensitivity at work',
    'misophonia coping strategies',
    'workplace accessibility misophonia',
    'noise cancelling headphones misophonia',
    'misophonia meetings',
  ],
  openGraph: {
    title: 'The Invisible Weight of Misophonia at Work | MisoCalm',
    description:
      'Navigating open-plan offices, meetings, and desk lunches when sound sensitivity won\'t let you focus.',
    url: 'https://misocalm.app/learn/misophonia-at-work',
  },
};

export default function MisophoniaAtWorkPage() {
  return (
    <ArticleLayout>
      <h1
        className="text-3xl sm:text-4xl text-white mb-3 leading-tight"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        The Invisible Weight of Misophonia at Work
      </h1>
      <p className="text-sm text-slate-400 font-light mb-10">5 min read</p>

      <div className="space-y-6 text-slate-200 font-light leading-relaxed">
        <p>
          8:47am. You sit down at your desk, open your laptop, and before you've
          even read your first email, you hear it. Three desks over. Crunching.
          Someone's having an early morning apple.
        </p>
        <p>
          Your shoulders climb toward your ears. Your jaw tightens. Your focus,
          the focus you'll spend the rest of the morning trying to get back,
          fractures.
        </p>
        <p>Welcome to misophonia at work.</p>
        <p>
          If this is your life, you're not alone. And you're carrying more than
          most people around you will ever realise.
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          The invisible tax
        </h2>
        <p>
          People without misophonia hear office sounds as background noise. For
          us, certain sounds are foreground, always. The colleague who clicks
          their pen during meetings. The keyboard that sounds like a typewriter
          two desks away. The person who eats lunch at their desk every single
          day. Each one is a small tax on your energy, your focus, and your
          nervous system.
        </p>
        <p>
          And it adds up. By 3pm, you're not just tired from working. You're
          tired from surviving the soundscape of your own office.
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          The part nobody talks about
        </h2>
        <p>
          It's the social cost. Turning down lunch invitations because eating
          sounds in close quarters are unbearable. Choosing a desk based on who
          sits nearby. Wearing headphones so constantly that people think you're
          antisocial. The guilt of being irritated by someone who's doing
          absolutely nothing wrong.
        </p>
        <p>
          You end up managing two jobs: the one you're paid for, and the
          invisible one of constantly monitoring, adapting, and suppressing your
          reactions to sound.
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          What actually helps
        </h2>
        <p>
          I won't pretend there's a perfect fix. But after years of navigating
          this, here's what's made the biggest difference for me.
        </p>

        <h3 className="text-lg text-white pt-2 font-light">
          Noise-cancelling headphones are non-negotiable
        </h3>
        <p>
          Not earbuds. Over-ear, active noise cancelling. They won't block
          everything, but they reduce the overall noise floor, which gives your
          nervous system less to react to. If your workplace pushes back, frame
          it as a focus tool. Because that's exactly what it is.
        </p>

        <h3 className="text-lg text-white pt-2 font-light">
          Have a regulation practice
        </h3>
        <p>
          When a trigger hits mid-meeting and you can't leave, you need something
          you can do invisibly. The physiological sigh (two quick inhales through
          the nose, one long exhale through the mouth) is silent, fast, and
          genuinely effective. Practice it enough that it becomes automatic.
        </p>

        <h3 className="text-lg text-white pt-2 font-light">
          Identify your worst triggers and plan around them
        </h3>
        <p>
          If lunchtime in the open plan is your worst hour, take your break then.
          Walk outside. Eat somewhere quiet. This isn't avoidance. It's strategy.
          You wouldn't sit in direct sunlight if you burned easily. Same logic.
        </p>

        <h3 className="text-lg text-white pt-2 font-light">
          Talk to your manager (if safe to do so)
        </h3>
        <p>
          You don't need to explain the full neuroscience. "I have a sound
          sensitivity condition that affects my focus. Having the option to work
          from a quieter space or use noise-cancelling headphones would help me
          do my best work." Most reasonable managers will work with that.
        </p>

        <h3 className="text-lg text-white pt-2 font-light">
          Build recovery into your day
        </h3>
        <p>
          Even five minutes of quiet breathing between meetings can reset your
          nervous system. Don't wait until you're completely overwhelmed.
          Regulate early and often.
        </p>

        <p>
          The workplace wasn't designed for sensitive nervous systems. That's not
          your fault. But you can design your experience within it.
        </p>
        <p className="text-indigo-300">
          You're doing harder work than anyone around you knows. Give yourself
          credit for that.
        </p>
      </div>
    </ArticleLayout>
  );
}
