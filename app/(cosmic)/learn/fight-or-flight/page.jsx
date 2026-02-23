/**
 * /learn/fight-or-flight
 * Article: Why Your Fight-or-Flight Response Isn't Broken
 */

import ArticleLayout from '@/components/composed/ArticleLayout';

export const metadata = {
  title: "Why Your Fight-or-Flight Response Isn't Broken",
  description:
    'Understanding the neuroscience behind misophonia. Your nervous system is doing exactly what it was designed to do, just a little too well.',
  keywords: [
    'misophonia neuroscience',
    'misophonia fight or flight',
    'misophonia nervous system',
    'misophonia not broken',
    'sound sensitivity neuroscience',
    'misophonia brain',
    'misophonia amygdala',
    'misophonia self compassion',
  ],
  openGraph: {
    title: "Why Your Fight-or-Flight Response Isn't Broken | MisoCalm",
    description:
      'Understanding the neuroscience behind misophonia, and why sensitivity is not a defect.',
    url: 'https://misocalm.app/learn/fight-or-flight',
  },
};

export default function FightOrFlightPage() {
  return (
    <ArticleLayout>
      <h1
        className="text-3xl sm:text-4xl text-white mb-3 leading-tight"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        Why Your Fight-or-Flight Response Isn't Broken
      </h1>
      <p className="text-sm text-slate-400 font-light mb-10">5 min read</p>

      <div className="space-y-6 text-slate-200 font-light leading-relaxed">
        <p>
          If you have misophonia, you've probably thought some version of this:
          "What is wrong with me?"
        </p>
        <p>
          You hear someone chewing and your entire body tenses. A pen clicking
          sends your heart rate through the roof. Someone sniffing repeatedly and
          you want to scream, or cry, or both. And afterwards, when the logic
          catches up, you think: why can't I just be normal?
        </p>
        <p>
          Here's what I want you to consider. What if nothing is wrong with you?
          What if your nervous system is doing exactly what it was designed to do,
          just a little too well?
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          Your brain is doing its job
        </h2>
        <p>
          The fight-or-flight response exists to keep you alive. When your brain
          detects a threat, the amygdala fires before your conscious mind even
          gets involved. Adrenaline surges. Muscles tense. Heart rate climbs.
          You're ready to fight or run.
        </p>
        <p>
          In misophonia, your brain has categorised certain sounds as threats. We
          don't fully understand why yet. Research points to enhanced connectivity
          between the auditory cortex and the limbic system (the emotional
          processing centre of the brain). Essentially, the wiring between "I
          hear this sound" and "this is dangerous" is stronger than typical.
        </p>
        <p>That's not a defect. That's a sensitivity.</p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          It's a volume problem, not a broken system
        </h2>
        <p>
          Think of it this way. Everyone's nervous system has a threat detection
          dial. For most people, chewing sounds register as background noise,
          somewhere near zero on the dial. For people with misophonia, those same
          sounds register closer to a seven or eight. The system itself is
          working perfectly. The calibration is just turned up.
        </p>
        <p>And here's what's hopeful about that: calibration can shift.</p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          Your nervous system can learn
        </h2>
        <p>
          Neuroplasticity means your brain is constantly rewiring based on
          experience. The same sensitivity that makes you reactive to triggers
          can, with the right practices, help you build new responses. Regulation
          techniques like controlled breathing, grounding exercises, and vagus
          nerve stimulation aren't just coping strategies. They're actually
          retraining the connection between sound and response.
        </p>
        <p>
          Every time you notice a trigger, pause, and consciously regulate
          instead of just reacting, you're building a new neural pathway. It's
          slow. It's not linear. But it's real.
        </p>

        <h2
          className="text-xl text-white pt-4"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 200,
          }}
        >
          The shame is the heaviest part
        </h2>
        <p>
          Honestly, for me, the hardest thing about misophonia has never been the
          sounds themselves. It's the shame. Feeling like I'm overreacting.
          Feeling like I should be able to handle what everyone else handles.
          Hiding it because explaining it feels impossible.
        </p>
        <p>
          But once I understood the neuroscience, something shifted. I stopped
          seeing myself as broken and started seeing myself as someone with a
          finely tuned system that needed better tools.
        </p>
        <p className="text-indigo-300">
          You're not broken. You're not weak. You're not overreacting. You have a
          nervous system that is trying very hard to protect you. Your job isn't
          to fight it. It's to work with it.
        </p>
        <p className="text-indigo-300">
          You're not starting from broken. You're starting from sensitive. That's
          a very different place.
        </p>
      </div>
    </ArticleLayout>
  );
}
