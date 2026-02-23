/**
 * Parent guide section components.
 * Extracted to keep the page thin and each section under 300 lines.
 */

const sectionHeading = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontWeight: 200,
};

const subHeading = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontWeight: 200,
};

export function WhatIsMisophonia() {
  return (
    <section>
      <h2 className="text-2xl text-white mb-6" style={sectionHeading}>
        1. What is misophonia?
      </h2>
      <div className="space-y-5 text-slate-200 font-light leading-relaxed">
        <h3 className="text-lg text-white" style={subHeading}>
          The simple version
        </h3>
        <p>
          Misophonia literally means "hatred of sound," but that name is a bit
          misleading. Your child doesn't hate sound. They have a nervous system
          that reacts intensely to certain specific sounds, often ones that most
          people barely notice.
        </p>
        <p>
          Think of it this way: you know the feeling of nails on a chalkboard?
          That visceral, full-body reaction you can't control? For a child with
          misophonia, everyday sounds like chewing, sniffling, or pen-clicking
          can trigger that same level of intensity. Sometimes worse.
        </p>
        <p>
          It's not a choice. It's not drama. It's their nervous system firing a
          threat response to sounds that, for reasons researchers are still
          working to fully understand, register as dangerous or deeply
          distressing.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          What it feels like from the inside
        </h3>
        <p>
          Imagine sitting at the dinner table. Everyone is talking, laughing,
          having a normal evening. But one sound cuts through everything else.
          Maybe it's the way someone chews. Maybe it's a fork scraping a plate.
          That sound gets louder and louder in your mind until it's all you can
          hear. Your heart rate spikes. Your muscles tense. You feel a rush of
          anger, panic, or the overwhelming need to escape. You can't think about
          anything else.
        </p>
        <p>
          Now imagine being eight years old and having no idea why this is
          happening to you. Imagine thinking something is wrong with you because
          nobody else at the table seems bothered.
        </p>
        <p>That's what your child may be experiencing.</p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          It's neurological, not behavioural
        </h3>
        <p>
          This is perhaps the most important thing to understand: misophonia is a
          neurological condition. Brain imaging studies have shown that people
          with misophonia have measurably different activity in the anterior
          insular cortex and amygdala, the parts of the brain that process
          emotions, body sensations, and the fight-or-flight response.
        </p>
        <p>
          Your child is not choosing to be upset. They are not being dramatic,
          manipulative, or difficult. Their brain is processing certain sounds
          differently, and the emotional and physical response that follows is
          genuine, involuntary, and often overwhelming.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          It doesn't always start with one big event
        </h3>
        <p>
          Many parents look for a single moment that "caused" their child's
          misophonia. Sometimes there is one. But research has found that
          misophonia severity is more strongly connected to everyday accumulated
          stress than to a single traumatic event.
        </p>
        <p>
          This means it might not be one incident. It might be the daily weight
          of a tense home, repeated small overwhelms, the anxiety of uncertainty
          during the exact years the nervous system is developing (ages 8-13).
          The nervous system doesn't need a dramatic origin story. The daily
          weight was enough.
        </p>
        <p>
          If you're a loving, well-meaning parent thinking "but nothing bad
          happened," please know: it's not about blame. It's about understanding
          that a sensitive nervous system, shaped by the ordinary stresses of
          growing up, can wire itself to respond to certain sounds as threats.
          That's not your fault. It's how nervous systems work.
        </p>
      </div>
    </section>
  );
}

export function CommonSigns() {
  return (
    <section>
      <h2 className="text-2xl text-white mb-6" style={sectionHeading}>
        2. Common signs to watch for
      </h2>
      <div className="space-y-5 text-slate-200 font-light leading-relaxed">
        <h3 className="text-lg text-white" style={subHeading}>
          Physical responses
        </h3>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>Covering their ears during meals or in quiet spaces</li>
          <li>Leaving the table suddenly or asking to eat separately</li>
          <li>
            Tensing up, clenching fists, or gritting teeth when certain sounds
            occur
          </li>
          <li>
            Increased heart rate or visible agitation that seems disproportionate
          </li>
        </ul>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Emotional responses
        </h3>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>
            Intense anger or rage that seems to come from nowhere, often directed
            at the person making the sound
          </li>
          <li>Crying or emotional shutdown during family meals or quiet activities</li>
          <li>
            Anxiety before situations where they know trigger sounds will be
            present
          </li>
          <li>
            Guilt or shame afterward, especially if they've lashed out at a
            family member
          </li>
        </ul>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Avoidance behaviours
        </h3>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>
            Wanting to eat alone or at different times from the family
          </li>
          <li>Wearing headphones constantly, even when it seems unnecessary</li>
          <li>
            Avoiding certain people (often the ones whose sounds trigger them
            most)
          </li>
          <li>Retreating to their own space more and more frequently</li>
          <li>
            Reluctance to go to school, sleepovers, or family gatherings
          </li>
        </ul>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          The difference between "being difficult" and genuine distress
        </h3>
        <p>
          This is where many families get stuck. From the outside, a child with
          misophonia can look like they're being rude, oversensitive, or
          controlling. But look closer. A child who is "being difficult"
          typically has a goal: attention, control, getting out of something. A
          child in genuine misophonic distress is in survival mode. You'll often
          see it in their eyes: they're not trying to manipulate the situation.
          They're trying to escape it.
        </p>
        <p>
          If your child seems distressed by sounds that don't bother anyone else,
          if the reaction is consistent and specific, and if they seem confused
          or ashamed by their own responses, it's very likely something deeper
          than behaviour.
        </p>
      </div>
    </section>
  );
}

export function WhatNotToDo() {
  return (
    <section>
      <h2 className="text-2xl text-white mb-6" style={sectionHeading}>
        3. What not to do
      </h2>
      <div className="space-y-5 text-slate-200 font-light leading-relaxed">
        <p className="text-sm text-slate-300">
          This section isn't about blame. If you've done any of these things,
          you're in good company. Nearly every parent has. What matters is what
          you do from here.
        </p>

        <h3 className="text-lg text-white" style={subHeading}>
          Don't tell them to "just ignore it"
        </h3>
        <p>
          This is the most common and most damaging response. Telling a child
          with misophonia to ignore a trigger sound is like telling someone with
          a bee allergy to ignore the sting. When we tell them to ignore it, what
          they hear is: "Your pain isn't real."
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Don't make the sound on purpose to "toughen them up"
        </h3>
        <p>
          Forced exposure without proper therapeutic support doesn't desensitise.
          It traumatises. It breaks trust. It makes the condition worse, not
          better.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Don't punish the reaction
        </h3>
        <p>
          While it's reasonable to address unkind behaviour later, punishing the
          reaction in the moment tells the child that their distress is a problem
          to be suppressed, not a signal to be understood. It's similar to
          punishing a child for flinching when something flies at their face.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Don't minimise their experience
        </h3>
        <p>
          Phrases like "it's not that bad," "everyone has things that annoy
          them," or "you need to learn to deal with it" feel dismissive even when
          they come from a place of love. What they need is for someone to say:
          "I believe you. Let's figure this out together."
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Don't make it about you
        </h3>
        <p>
          This one is hard, especially when your child's trigger is a sound you
          make. It can feel deeply personal. But their reaction isn't about you
          as a person. It's about a sound and a nervous system that can't filter
          it. Try not to take it as rejection, even when it stings.
        </p>
      </div>
    </section>
  );
}

export function WhatHelps() {
  return (
    <section>
      <h2 className="text-2xl text-white mb-6" style={sectionHeading}>
        4. What helps
      </h2>
      <div className="space-y-5 text-slate-200 font-light leading-relaxed">
        <h3 className="text-lg text-white" style={subHeading}>
          Validate their experience
        </h3>
        <p>
          This is the foundation. Before strategies, before tools, before
          anything else: believe your child and tell them so.
        </p>
        <p className="text-indigo-300 italic">
          "I can see that sound is really hard for you. That's real, and it's
          okay."
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Create safe spaces
        </h3>
        <p>
          Every child with misophonia needs at least one space where they can
          retreat without judgement. The key word is <em>safe</em>. This space
          should never feel like punishment and always feel like refuge.
        </p>
        <p>
          Make the safe space something you build together. Ownership over their
          coping gives them a sense of control in a condition that often feels
          completely out of their control.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Noise-cancelling headphones
        </h3>
        <p>
          Good noise-cancelling headphones can be life-changing. A child who can
          eat with the family while wearing headphones is far better off than a
          child who stops eating with the family entirely. Don't make headphones
          a source of conflict. For a child with misophonia, good headphones are
          a genuine accessibility tool.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Breathing techniques they can learn
        </h3>
        <p>
          When a trigger hits, the body goes into fight-or-flight. Breathing
          techniques can help interrupt that cycle.
        </p>
        <p>
          <strong className="text-white">Box Breathing</strong> (good for
          younger children): Breathe in for 4 counts, hold for 4 counts, breathe
          out for 4 counts, hold for 4 counts. Trace a square in the air to make
          it tangible.
        </p>
        <p>
          <strong className="text-white">4-7-8 Breathing</strong> (good for
          older children and teens): Breathe in through the nose for 4 counts,
          hold for 7 counts, breathe out slowly through the mouth for 8 counts.
        </p>
        <p>
          Practice these together during calm moments, not during a trigger.
          Build the muscle memory when things are easy so it's accessible when
          things are hard.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Let them leave without shame
        </h3>
        <p>
          Perhaps the most powerful thing you can give a child with misophonia is
          unconditional permission to remove themselves from a triggering
          situation. No questions. No guilt.
        </p>
        <p>
          When leaving is allowed and shame-free, something interesting happens:
          children often stay longer. The knowledge that they <em>can</em> leave
          reduces the anxiety of being trapped, which in turn reduces the
          intensity of the trigger response.
        </p>
      </div>
    </section>
  );
}

export function HavingTheConversation() {
  return (
    <section>
      <h2 className="text-2xl text-white mb-6" style={sectionHeading}>
        5. Having the conversation
      </h2>
      <div className="space-y-5 text-slate-200 font-light leading-relaxed">
        <h3 className="text-lg text-white" style={subHeading}>
          Talking to your child
        </h3>
        <p>
          If your child hasn't been told what misophonia is, they may believe
          they're the only person in the world who feels this way. Naming it can
          be profoundly relieving.
        </p>

        <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-3">
          <p className="text-xs text-slate-400 font-light">
            For younger children (under 10):
          </p>
          <p className="text-sm text-slate-300 font-light leading-relaxed italic">
            "You know how some sounds really bother you in a way that's hard to
            explain? There's actually a name for that. It's called misophonia. It
            means your brain reacts really strongly to certain sounds. It's not
            your fault, and you're not the only person who has it. We're going to
            figure out ways to make it easier for you, together."
          </p>
        </div>

        <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-3">
          <p className="text-xs text-slate-400 font-light">
            For older children and teens:
          </p>
          <p className="text-sm text-slate-300 font-light leading-relaxed italic">
            "I've been reading about something called misophonia, and I think it
            might explain what you've been going through with certain sounds.
            It's a real neurological condition. It's not about willpower or being
            too sensitive. I want you to know that I take it seriously, and I
            want to work with you on making things better."
          </p>
        </div>

        <p>
          Then listen. Let them talk. Let them tell you which sounds, which
          situations, how it feels. Don't try to fix it all in one conversation.
          Just let them feel heard.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Talking to siblings
        </h3>
        <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
          <p className="text-sm text-slate-300 font-light leading-relaxed italic">
            "Your brother/sister has something called misophonia. It means
            certain sounds cause real pain and distress for them, even if those
            same sounds don't bother you or me. It's not something they can
            control, just like you can't control sneezing. We're going to make
            some small changes as a family to help them."
          </p>
        </div>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Talking to teachers
        </h3>
        <p>
          School is often where misophonia is hardest to manage, because children
          have the least control over their environment. A short conversation
          with your child's teacher can make a significant difference.
        </p>
        <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-3">
          <p className="text-xs text-slate-400 font-light">
            Sample conversation opener:
          </p>
          <p className="text-sm text-slate-300 font-light leading-relaxed italic">
            "[Child's name] has a condition called misophonia, which causes
            intense distress in response to specific sounds. This is a
            neurological condition, not a behavioural issue. Some things that
            would really help: permission to wear earplugs during quiet work, a
            seat near the door so they can step out briefly, and a quiet signal
            they can use to let you know they need a break."
          </p>
        </div>
      </div>
    </section>
  );
}

export function BuildingSupportPlan() {
  return (
    <section>
      <h2 className="text-2xl text-white mb-6" style={sectionHeading}>
        6. Building a support plan together
      </h2>
      <div className="space-y-5 text-slate-200 font-light leading-relaxed">
        <p>
          The most effective support plans are ones your child helps create. This
          gives them agency and ensures the plan reflects their experience.
        </p>

        <h3 className="text-lg text-white" style={subHeading}>
          Identify their specific triggers
        </h3>
        <p>
          Sit down with your child (when things are calm, not mid-crisis) and
          explore:
        </p>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>Which sounds are hardest?</li>
          <li>Which situations are hardest?</li>
          <li>Are there specific people whose sounds are worse?</li>
          <li>What makes it worse? (tiredness, stress, being unable to escape)</li>
          <li>
            What makes it more manageable? (background noise, music, being able
            to leave)
          </li>
        </ul>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Create family agreements
        </h3>
        <p>
          These aren't rules imposed on the family. They're agreements you create
          together. Some examples:
        </p>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>
            "We'll play background music during meals so sounds are less
            isolated."
          </li>
          <li>
            "Anyone can wear headphones at the table without being questioned."
          </li>
          <li>"If someone needs to leave, we don't comment on it."</li>
          <li>
            "We'll check in once a week about what's working and what isn't."
          </li>
        </ul>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Track what helps and what doesn't
        </h3>
        <p>
          Over time, patterns emerge. Maybe mornings are harder than evenings.
          Maybe certain foods at dinner create worse sounds. A simple journal can
          help you and your child identify what's working. This doesn't need to
          be formal. Just notice. Adjust. Try again.
        </p>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          When to seek professional support
        </h3>
        <p>Consider reaching out to a professional if:</p>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>
            Your child's misophonia is significantly affecting their ability to
            attend school, eat with others, or participate in daily life
          </li>
          <li>
            They're showing signs of anxiety, depression, or social withdrawal
          </li>
          <li>
            Family relationships are under serious strain despite your best
            efforts
          </li>
          <li>Your child is expressing hopelessness about their condition</li>
        </ul>
        <p>
          Professionals who can help include audiologists specialising in sound
          sensitivity, therapists trained in CBT or misophonia management, and
          occupational therapists who can help with sensory processing
          strategies.
        </p>
      </div>
    </section>
  );
}

export function ToolsAndResources() {
  return (
    <section>
      <h2 className="text-2xl text-white mb-6" style={sectionHeading}>
        7. Tools and resources
      </h2>
      <div className="space-y-5 text-slate-200 font-light leading-relaxed">
        <h3 className="text-lg text-white" style={subHeading}>
          Recommended reading
        </h3>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>
            <strong className="text-white">
              "Understanding and Overcoming Misophonia"
            </strong>{' '}
            by Thomas Dozier
          </li>
          <li>
            <strong className="text-white">"Sound Rage"</strong> by Judith T.
            Krauthamer
          </li>
          <li>
            <strong className="text-white">
              "When Misophonia Gets in the Way"
            </strong>{' '}
            by Dr. Ezra Cowan
          </li>
        </ul>

        <h3 className="text-lg text-white pt-2" style={subHeading}>
          Professional resources
        </h3>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>
            Misophonia Association: directory of providers and current research
          </li>
          <li>
            Your child's paediatrician: a good starting point for referrals to
            specialists
          </li>
        </ul>
      </div>
    </section>
  );
}

export function NoteOfHope() {
  return (
    <section>
      <h2 className="text-2xl text-white mb-6" style={sectionHeading}>
        8. A note of hope
      </h2>
      <div className="space-y-5 text-slate-200 font-light leading-relaxed">
        <p>If you've read this far, you're already doing something meaningful.</p>
        <p>
          Many children with misophonia go years without anyone understanding
          what they're going through. They sit at dinner tables feeling like
          something is wrong with them. They get told to stop being so sensitive.
          They start to believe the problem is who they are, not what their brain
          is doing.
        </p>
        <p>You're choosing a different path for your child.</p>
        <p>
          Misophonia doesn't go away overnight. There is no single fix. But with
          understanding, the right tools, and a family that takes it seriously,
          it becomes manageable. Children who feel believed and supported develop
          resilience. They learn to advocate for themselves. They stop carrying
          shame about something that was never their fault.
        </p>
        <p>
          Your child is not broken. Their brain works differently around certain
          sounds. That's a real thing, and it's a hard thing, but it is not a
          life sentence of suffering.
        </p>
        <p>
          There will be difficult meals. There will be moments of frustration on
          all sides. There will be days where nothing seems to help. That's okay.
          What matters is the direction you're moving: toward understanding,
          toward compassion, toward solutions that work for your whole family.
        </p>
        <p className="text-indigo-300">
          The fact that you picked up this guide means your child has something
          many don't: a parent who is trying to understand. That matters more
          than you know.
        </p>
      </div>
    </section>
  );
}
