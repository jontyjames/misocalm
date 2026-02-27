/**
 * Tools Library Data
 * Static data for the tools/practices page.
 * Counts: 7 tools (prime), 5 filter tabs (prime), 4 experiences (fib-adjacent).
 */

import { ROUTES } from '@/lib/constants';

// All available tools/practices (7, prime)
export const TOOLS = [
  {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'Before sleep, or when your mind won\'t stop racing',
    longDescription: 'The 4-7-8 breathing practice is a gentle way to signal safety to your nervous system. The extended exhale activates your body\'s natural calming response, easing you toward stillness.',
    category: 'breathwork',
    duration_minutes: 5,
    type: 'practice',
    breathType: '478',
  },
  {
    id: '3',
    title: 'Box Breathing',
    description: 'Daily practice, or before a moment you know will be hard',
    longDescription: 'The equal rhythm of box breathing creates a steady anchor for your attention. Four counts in, four held, four out, four still. A simple pattern that brings your whole system back to centre.',
    category: 'breathwork',
    duration_minutes: 4,
    type: 'practice',
    breathType: 'box',
  },
  {
    id: '4',
    title: 'Physiological Sigh',
    description: 'In the moment, when you only have 30 seconds',
    longDescription: 'A double inhale followed by a long exhale. Your body already does this naturally when it needs to reset. This practice lets you use that same mechanism on purpose, whenever you need it.',
    category: 'breathwork',
    duration_minutes: 2,
    type: 'practice',
    breathType: 'sigh',
  },
  {
    id: '2',
    title: 'Body Scan',
    description: 'A guided return to your body',
    longDescription: 'A guided journey through your body, noticing where tension lives and gently inviting it to soften. Layer by layer, breath by breath.',
    category: 'somatic',
    duration_minutes: 10,
    type: 'coming_soon',
    premium: true,
  },
  {
    id: '5',
    title: 'Interval Timer',
    description: 'Meditation timer with gentle bells at each interval',
    longDescription: 'Set your intention, close your eyes, and let the intervals hold the structure for you. No need to watch the clock or wonder how long is left.',
    category: 'somatic',
    duration_minutes: 20,
    type: 'timer',
  },
  {
    id: '6',
    title: 'Progressive Relaxation',
    description: 'Tense, release, discover stillness',
    longDescription: 'Systematically tense and release each muscle group, teaching your nervous system the difference between holding on and letting go.',
    category: 'somatic',
    duration_minutes: 15,
    type: 'coming_soon',
    premium: true,
  },
  {
    id: '7',
    title: 'Cognitive Reframing',
    description: 'See your sound sensitivities from a new angle',
    longDescription: 'Guided exercises to gently examine the stories your mind tells about sound, and discover new ways to relate to what you hear.',
    category: 'cognitive',
    duration_minutes: 20,
    type: 'coming_soon',
    premium: true,
  },
];

// Hero experience rotation order (cycles daily)
export const EXPERIENCE_HERO_ORDER = ['grounding', 'mandala', 'pulse', 'impermanence', 'focus', 'sanctuary'];

// Solfeggio colour per experience — drives Card's solfeggio prop
export const EXPERIENCE_SOLFEGGIO = {
  grounding: 'cyan',       // 741Hz — awakening, clarity, return to senses
  mandala: 'violet',       // 852Hz — intuition, depth, creation
  pulse: 'indigo',         // 528Hz — transformation, love, heartbeat
  impermanence: 'violet',  // 852Hz — spiritual order, letting go
  focus: 'cyan',           // 741Hz — awakening, clarity, attentional precision
  sanctuary: 'slate',      // 396Hz — liberation from fear, safety, grounding
};

// Guided experiences
export const EXPERIENCES = [
  {
    id: 'impermanence',
    title: 'Impermanence',
    description: 'A quiet experiment about sound, and what remains.',
    duration: '~3 min',
    route: ROUTES.EXPERIENCE_IMPERMANENCE,
  },
  {
    id: 'mandala',
    title: 'Mandala',
    description: 'Touch the void, and see what you already are.',
    duration: '~3 min',
    route: ROUTES.EXPERIENCE_MANDALA,
  },
  {
    id: 'pulse',
    title: 'Pulse',
    description: 'Your heart has been beating this whole time.',
    duration: '~3 min',
    route: ROUTES.EXPERIENCE_PULSE,
  },
  {
    id: 'grounding',
    title: 'Grounding',
    description: 'Five senses. Fifteen anchors. You are here.',
    duration: '~3 min',
    route: ROUTES.EXPERIENCE_GROUNDING,
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Hold the centre. The tunnel opens from within.',
    duration: '~3 min',
    route: ROUTES.EXPERIENCE_FOCUS,
  },
  {
    id: 'sanctuary',
    title: 'Sanctuary',
    description: 'Breathe, and watch what your sensitivity builds.',
    duration: '~4 min',
    route: ROUTES.EXPERIENCE_SANCTUARY,
  },
];
