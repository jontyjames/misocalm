/**
 * Personalized guide content for each quiz result category
 * Each guide: intro, what's happening, 3 techniques, learnMore links, next step
 */

export const GUIDE_CONTENT = {
  general: {
    title: 'Your Sound Sensitivity Guide',
    subtitle: 'Understanding your awareness',
    accent: 'cyan',
    intro: 'You notice sounds more than most people. That awareness is worth paying attention to, even if it doesn\'t feel overwhelming right now. Understanding your patterns early is one of the most helpful things you can do.',
    whatsHappening: {
      heading: 'What\'s happening in your brain',
      body: 'Everyone processes sound differently. Your brain pays more attention to certain auditory signals than the average person. This isn\'t a flaw. It\'s a sensitivity. Research suggests that around 4.6% of people experience misophonia (Dixon et al., 2024), though many more experience milder sound sensitivity. Studies have found that people with heightened sound awareness show increased mirror neuron activity, meaning your brain is literally simulating the actions that produce the sounds you hear. For some people, this awareness stays mild. For others, it can intensify during stressful periods when accumulated stress lowers your threshold. Either way, learning to work with your nervous system now gives you a real advantage.',
    },
    techniques: [
      {
        name: '4-7-8 Breathing',
        why: 'The simplest way to calm your nervous system in under 60 seconds.',
        how: 'Breathe in through your nose for 4 counts. Hold for 7 counts. Exhale slowly through your mouth for 8 counts. The long exhale activates your parasympathetic nervous system, the part that tells your body "you\'re safe." Do this 3 times whenever a sound starts to bother you.',
        when: 'When you notice a sound getting under your skin, before it builds.',
      },
      {
        name: 'Sound awareness journaling',
        why: 'Patterns become visible when you write them down.',
        how: 'At the end of each day, spend 2 minutes noting: what sounds bothered you, where you were, and how you were feeling at the time. Don\'t judge what you write. Just notice. After a week, you\'ll start to see patterns you couldn\'t see before. Stress, tiredness, and environment all play a role.',
        when: 'Evening, as part of a wind-down routine.',
      },
      {
        name: 'Environmental tuning',
        why: 'Small changes to your environment can make a big difference.',
        how: 'Identify the spaces where you feel most comfortable with sound, and the ones where you don\'t. In challenging environments, give yourself permission to use simple tools: a fan for background noise, a seat further from the kitchen, or a quiet corner in a busy room. This isn\'t avoidance. It\'s self-awareness in action.',
        when: 'Before entering spaces you know might be challenging.',
      },
    ],
    learnMore: [
      { slug: 'understanding-misophonia', title: 'What I Wish People Understood About Misophonia', readingTime: '4 min' },
      { slug: 'breathing-techniques', title: '5 Breathing Techniques That Actually Help', readingTime: '6 min' },
    ],
  },

  moderate: {
    title: 'Your Misophonia Guide',
    subtitle: 'Understanding your experience',
    accent: 'indigo',
    intro: 'What you\'re experiencing has a name: misophonia. It\'s how your brain is wired, not a personality flaw. The fact that you feel your reactions are sometimes "too much" is one of the most common things people with misophonia say. You\'re not alone in this.',
    whatsHappening: {
      heading: 'What\'s happening in your brain',
      body: 'In misophonia, your brain has learned to treat certain sounds as threats. When you hear a trigger sound, your amygdala (the brain\'s alarm system) fires before your conscious mind can intervene. That\'s why the reaction feels instant and involuntary. It\'s not about willpower. Research from 2024 estimates that 4.6% of people experience misophonia (Dixon et al.), and studies have found heightened mirror neuron activity in response to trigger sounds, meaning your brain is physically simulating the actions it hears. The response is real, physical, and neurological. Accumulated stress also plays a role: the more depleted your nervous system, the lower your threshold for triggers. And it can be worked with.',
    },
    techniques: [
      {
        name: '4-7-8 Breathing',
        why: 'Interrupts the fight-or-flight response before it peaks.',
        how: 'Breathe in through your nose for 4 counts. Hold for 7 counts. Exhale slowly through your mouth for 8 counts. The extended exhale directly activates your vagus nerve, shifting your nervous system from "threat mode" to "safe mode." Practice this 3 times in a row. Use it the moment you notice a difficult sound, not after the response has already built.',
        when: 'At the first sign of a difficult sound. The earlier you start, the more effective it is.',
      },
      {
        name: 'Sound pattern journaling',
        why: 'Understanding your patterns reduces the feeling of chaos.',
        how: 'After a difficult moment, write down: the sound, where you were, who was there, how your body responded, and what you did. Keep it brief. Over time, you\'ll notice patterns: certain people, places, times of day, or stress levels that make things worse. This knowledge is power. It turns "why does this keep happening to me?" into "I understand what\'s going on."',
        when: 'After a difficult sound event, once you\'ve had a little space.',
      },
      {
        name: 'The anchor technique',
        why: 'Gives your brain something to focus on instead of the sound.',
        how: 'When you notice a difficult sound, press your thumb and index finger together firmly. Focus all your attention on that physical sensation: the pressure, the warmth, the texture of your skin. Hold for 10 seconds. This gives your brain a competing sensory input, redirecting attention away from the difficult sound. It\'s subtle enough to use anywhere.',
        when: 'During meals, meetings, or any situation where you can\'t leave.',
      },
    ],
    learnMore: [
      { slug: 'fight-or-flight', title: "Why Your Fight-or-Flight Response Isn't Broken", readingTime: '5 min' },
      { slug: 'breathing-techniques', title: '5 Breathing Techniques That Actually Help', readingTime: '6 min' },
      { slug: 'misophonia-facts', title: "13 Things About Misophonia Most People Don't Know", readingTime: '5 min' },
    ],
  },

  significant: {
    title: 'Your Misophonia Guide',
    subtitle: 'What you feel is completely real',
    accent: 'violet',
    intro: 'Your responses tell a clear story: misophonia has been shaping your life in significant ways. The planning, the avoidance, the weight you carry after a difficult moment. All of it is real. And none of it means something is wrong with you. Your nervous system is responding to something it perceives as threatening. That response can be worked with.',
    whatsHappening: {
      heading: 'What\'s happening in your brain',
      body: 'Your brain\'s threat detection system has become hypersensitive to specific sounds. When you hear a trigger, your amygdala fires an alarm signal before your prefrontal cortex (the reasoning part) can evaluate it. That\'s why you can\'t "just ignore it." The emotional and physical response happens faster than conscious thought. This isn\'t weakness. It\'s neurology. Research from 2024 confirms that around 4.6% of people experience misophonia (Dixon et al.), with many more experiencing significant symptoms. Studies show heightened mirror neuron activity and measurably different brain connectivity patterns in the regions that process sound and emotion. Accumulated stress compounds this: each unprocessed trigger adds to your nervous system\'s load, lowering your threshold over time. Your experience is valid, documented, and shared by millions of people.',
    },
    techniques: [
      {
        name: 'Physiological sigh',
        why: 'The fastest known way to reset your nervous system. Takes 10 seconds.',
        how: 'Take a double inhale through your nose: one normal breath in, then immediately a second short sharp sniff on top of it (filling your lungs completely). Then exhale slowly through your mouth for as long as you can. One cycle is often enough. The double inhale pops open the tiny air sacs in your lungs (alveoli), maximizing CO2 release on the exhale. This is what your body naturally does when it sighs. You\'re just doing it deliberately.',
        when: 'The moment you feel the response. This works faster than any other breathing technique.',
      },
      {
        name: 'Sound mapping',
        why: 'Replaces helplessness with understanding.',
        how: 'Create a simple map of your sound sensitivities. For each one, note: the specific sound, your intensity (1-10), whether it\'s worse from certain people, and what your body does in response. Then note what makes it better or worse: stress, sleep, hunger, time of day. This isn\'t about solving misophonia. It\'s about understanding your landscape so you can navigate it with more confidence and less fear.',
        when: 'Set aside 15 minutes once. Update it when you notice something new.',
      },
      {
        name: 'Self-compassion reset',
        why: 'The guilt and shame are often harder than the sounds themselves.',
        how: 'After a difficult moment, place your hand on your chest and say quietly (or think): "This is hard. Other people feel this too. I\'m doing my best." This isn\'t positive thinking. It\'s acknowledgment. Research on self-compassion shows it reduces the secondary suffering: the guilt about your reaction, the shame about needing to leave, the frustration with yourself. Let yourself off the hook.',
        when: 'After a difficult moment, especially when you feel guilt or frustration with yourself.',
      },
    ],
    learnMore: [
      { slug: 'fight-or-flight', title: "Why Your Fight-or-Flight Response Isn't Broken", readingTime: '5 min' },
      { slug: 'misophonia-at-work', title: 'The Invisible Weight of Misophonia at Work', readingTime: '5 min' },
      { slug: 'what-to-say', title: '7 Things to Say (and Not Say) to Someone With Misophonia', readingTime: '4 min' },
    ],
  },

  severe: {
    title: 'Your Misophonia Guide',
    subtitle: 'You\'ve been carrying this a long time',
    accent: 'violet',
    glow: true,
    intro: 'You\'ve been living with intense misophonia, likely for most of your life. The systems you\'ve built to navigate your days, the relationships it\'s affected, the loneliness of feeling like no one understands. All of it is real. And the fact that you\'re here, looking for answers, says something about your strength.',
    whatsHappening: {
      heading: 'What\'s happening in your brain',
      body: 'Your brain\'s threat detection system has been running in overdrive, possibly for decades. Trigger sounds activate your amygdala with the same intensity as a genuine physical threat. Your body responds accordingly: adrenaline, cortisol, muscle tension, the overwhelming urge to fight or flee. This is not a choice and not a character flaw. Brain imaging studies show that people with severe misophonia have heightened connectivity between the auditory cortex, the anterior insular cortex (which processes emotions), and the amygdala. Your brain literally processes these sounds differently. Research from 2024 (Dixon et al.) suggests around 4.6% of people experience misophonia, and for people at the severe end, there have been only 3 randomized controlled trials ever completed for misophonia, with zero established first-line treatments. That means if you\'ve felt unsupported by the medical system, it\'s not because you haven\'t tried hard enough. It\'s because the system hasn\'t caught up yet. You have been managing this largely without support, and that takes immense resilience.',
    },
    techniques: [
      {
        name: 'Physiological sigh',
        why: 'The fastest evidence-based reset for acute difficult moments.',
        how: 'Double inhale through your nose: one breath in, then immediately a second short sniff on top. Then a long, slow exhale through your mouth. One cycle can shift your nervous system in under 10 seconds. Practice this when you\'re calm first, so it becomes automatic when you need it. This practice was identified by Stanford neuroscientist Andrew Huberman as the most efficient real-time stress intervention. It works because the double inhale maximizes lung inflation, which maximizes CO2 offloading on the exhale, which directly calms the sympathetic nervous system.',
        when: 'The instant you feel a sound response. Before it peaks. Practice daily so it becomes muscle memory.',
      },
      {
        name: 'Exit planning',
        why: 'Having a plan reduces the dread more than you\'d expect.',
        how: 'Before entering a potentially triggering situation, decide three things: your exit signal (what will tell you it\'s time to step away), your exit strategy (how you\'ll leave gracefully), and your recovery plan (what you\'ll do once you\'re in a safe space). This might sound like giving in, but it\'s the opposite. When your brain knows there\'s an escape route, the anticipatory anxiety drops significantly. You might not even need to use the plan. Just having it changes how your nervous system approaches the situation.',
        when: 'Before meals, gatherings, meetings, or any situation you\'ve been dreading.',
      },
      {
        name: 'Vagal toning',
        why: 'Builds long-term resilience in your nervous system.',
        how: 'Your vagus nerve is the main pathway between your brain and your body\'s calm-down system. Strengthening it makes you more resilient to triggers over time. Three daily practices: (1) Humming for 2 minutes, feeling the vibration in your chest and throat. (2) Splashing cold water on your face, which activates the dive reflex. (3) Slow, extended exhale breathing (breathe in for 4, out for 8) for 3 minutes. These aren\'t one-time fixes. They\'re training. Like building a muscle. Over weeks, your baseline nervous system state shifts, and triggers become slightly less intense.',
        when: 'Daily practice, ideally morning. Think of it as nervous system training, not crisis management.',
      },
    ],
    learnMore: [
      { slug: 'understanding-misophonia', title: 'What I Wish People Understood About Misophonia', readingTime: '4 min' },
      { slug: 'fight-or-flight', title: "Why Your Fight-or-Flight Response Isn't Broken", readingTime: '5 min' },
      { slug: 'parents-guide', title: "Understanding Your Child's Misophonia", readingTime: '15 min' },
    ],
  },
};

export const GUIDE_CATEGORIES = ['general', 'moderate', 'significant', 'severe'];
