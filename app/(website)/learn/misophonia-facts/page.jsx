/**
 * /learn/misophonia-facts
 * Article: 13 Things About Misophonia Most People Don't Know
 */

import ArticleLayout from '@/components/composed/ArticleLayout';

export const metadata = {
  title: "13 Things About Misophonia Most People Don't Know",
  description:
    'Research-backed facts about misophonia that change how you understand sound sensitivity. From neuroscience to prevalence to what actually helps.',
  keywords: [
    'misophonia facts',
    'misophonia statistics',
    'misophonia research',
    'misophonia prevalence',
    'misophonia neurological',
    'misophonia brain science',
    'sound sensitivity facts',
    'misophonia awareness',
    'is misophonia real',
    'how common is misophonia',
  ],
  openGraph: {
    title: "13 Things About Misophonia Most People Don't Know | MisoCalm",
    description:
      'Research-backed facts that change how you understand sound sensitivity.',
    url: 'https://misocalm.app/learn/misophonia-facts',
  },
};

function Fact({ number, title, children }) {
  return (
    <div className="space-y-3">
      <h2
        className="text-xl text-white flex items-baseline gap-3"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        <span className="text-indigo-400 text-sm">{number}.</span>
        {title}
      </h2>
      <div className="text-slate-200 font-light leading-relaxed">{children}</div>
    </div>
  );
}

export default function MisophoniaFactsPage() {
  return (
    <ArticleLayout slug="misophonia-facts">
      <h1
        className="text-3xl sm:text-4xl text-white mb-3 leading-tight"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
        }}
      >
        13 Things About Misophonia Most People Don't Know
      </h1>
      <p className="text-sm text-slate-400 font-light mb-10">5 min read</p>

      <div className="space-y-10">
        <Fact number={1} title="Misophonia is neurological, not psychological">
          <p>
            Your brain is wired differently. Brain imaging studies show that
            people with misophonia have heightened activity in the areas
            responsible for processing emotions and threat detection. This isn't
            a mindset problem. It's how your nervous system is built.
          </p>
        </Fact>

        <Fact
          number={2}
          title="It activates the same response your body uses when it senses danger"
        >
          <p>
            When a trigger sound hits, your fight-or-flight system fires. Heart
            rate spikes. Muscles tense. Adrenaline surges. Your body is genuinely
            preparing you to survive a threat, even though the sound itself is
            harmless. That's how real this is.
          </p>
        </Fact>

        <Fact number={3} title="The reaction is completely involuntary">
          <p>
            You can't "just ignore it" any more than you can ignore a fire alarm
            going off in your living room. The response happens before your
            conscious mind even has a chance to weigh in. It's automatic, not a
            choice.
          </p>
        </Fact>

        <Fact
          number={4}
          title="It often starts in childhood, usually between ages 9 and 13"
        >
          <p>
            Most people can trace their misophonia back to a specific moment in
            childhood. A family dinner. A classroom. A sound that suddenly became
            unbearable and never stopped being unbearable. If you remember the
            exact moment yours started, you're not alone.
          </p>
        </Fact>

        <Fact number={5} title="It's not about volume. It's about specific sounds">
          <p>
            A jackhammer outside your window might not bother you at all. But the
            quiet sound of someone chewing across the table can feel unbearable.
            Misophonia is pattern-specific, not volume-specific. Your brain has
            learned to flag certain sounds as threats, regardless of how loud
            they are.
          </p>
        </Fact>

        <Fact
          number={6}
          title="It can quietly reshape your closest relationships"
        >
          <p>
            Many people with misophonia carry guilt about avoiding meals with
            family, leaving rooms when partners are eating, or feeling rage
            toward people they love. The condition doesn't just affect your ears.
            It affects your connections, your social life, and sometimes your
            sense of self-worth.
          </p>
        </Fact>

        <Fact
          number={7}
          title="It's far more common than most people realise"
        >
          <p>
            A 2024 nationally representative U.S. study found that 4.6% of
            adults have clinically significant misophonia. That's roughly 12
            million Americans. In a room of 20 people, at least one is likely
            dealing with this at a level that affects their daily life. You've
            probably never heard them talk about it, because most people carry it
            in silence.
          </p>
        </Fact>

        <Fact number={8} title="It was only given a name in 2001">
          <p>
            The term "misophonia" was coined by neuroscientists Pawel and
            Margaret Jastreboff just over two decades ago. Before that, millions
            of people experienced it with no language to describe what was
            happening to them. Many were told they were overreacting,
            oversensitive, or making it up.
          </p>
        </Fact>

        <Fact
          number={9}
          title="Your brain literally processes trigger sounds differently"
        >
          <p>
            Functional MRI studies show that trigger sounds activate the anterior
            insular cortex in ways that neutral sounds do not. Your brain assigns
            emotional weight and urgency to specific sounds that it treats as
            background noise for everyone else. The difference is measurable.
          </p>
        </Fact>

        <Fact
          number={10}
          title="Avoiding triggers feels like relief, but it can make things worse"
        >
          <p>
            Every time you leave a room or put in earplugs to escape a sound,
            your brain gets a small confirmation: "That sound really was
            dangerous." Over time, avoidance can actually strengthen the trigger
            response. Learning to regulate through it, gently and at your own
            pace, is what changes the pattern.
          </p>
        </Fact>

        <Fact
          number={11}
          title="Simple breathing techniques can help calm the nervous system"
        >
          <p>
            Because misophonia activates the fight-or-flight response, tools that
            calm that system can genuinely help. Slow, rhythmic breathing
            activates the parasympathetic nervous system and brings your body
            back toward a regulated state. It won't erase the trigger, but it
            gives you something to work with instead of just reacting.
          </p>
        </Fact>

        <Fact
          number={12}
          title="Having misophonia doesn't mean you're 'too sensitive'"
        >
          <p>
            This is one of the most damaging things people with misophonia hear.
            Sensitivity is not a flaw. Your nervous system is doing exactly what
            it's designed to do. It's just calibrated differently. Recognising
            that can be the beginning of healing, because it replaces shame with
            understanding.
          </p>
        </Fact>

        <Fact
          number={13}
          title="There are tools, practices, and communities that genuinely help"
        >
          <p>
            You don't have to white-knuckle your way through this alone.
            Breathing exercises, journaling, nervous system regulation, and
            connecting with others who understand can all make a real difference.
            The path forward isn't about eliminating triggers. It's about
            building a new relationship with your own nervous system.
          </p>
        </Fact>

        <p className="text-indigo-300 pt-4">
          If any of these facts resonated with you, share this with someone who
          needs to hear it. Sometimes just knowing there's a name for it changes
          everything.
        </p>
      </div>
    </ArticleLayout>
  );
}
