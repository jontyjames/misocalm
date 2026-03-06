/**
 * MisoCalm Application Constants
 */

// API & Timeouts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const API_TIMEOUT = 10000; // 10 seconds for Supabase calls
export const DEBOUNCE_DELAY = 233; // Fibonacci: fib-move

// Admin access
export const ADMIN_EMAILS = [
  'jonty@thrivingwithmisophonia.com',
  'jonty_ch@hotmail.com',
  'jontycoats@gmail.com',
];

// Top 10 most commonly reported triggers (based on misophonia research)
export const DEFAULT_TRIGGERS = [
  'Chewing',
  'Lip smacking',
  'Slurping',
  'Breathing sounds',
  'Sniffing',
  'Typing',
  'Pen clicking',
  'Throat clearing',
  'Coughing',
  'Crunching',
  'Whispering',
];

// Environment options (replaces SOURCE_OPTIONS — 5, prime)
export const ENVIRONMENT_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'work', label: 'Work' },
  { value: 'public', label: 'Public' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

// Time of day options (5, prime)
export const TIME_OF_DAY_OPTIONS = [
  { value: 'now', label: 'Just now' },
  { value: 'morning', label: 'Morning' },
  { value: 'midday', label: 'Midday' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

// Body response options (11, prime)
export const BODY_RESPONSE_OPTIONS = [
  'Jaw tension',
  'Chest tightness',
  'Heat or flushing',
  'Urge to escape',
  'Stomach knot',
  'Shallow breathing',
  'Heart racing',
  'Fists clenching',
  'Muscle tension',
  'Numbness',
  'Trembling',
];

// @deprecated — kept for backward compat with existing data, use ENVIRONMENT_OPTIONS instead
export const SOURCE_OPTIONS = [
  { value: 'partner', label: 'Partner/Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'step_parent', label: 'Step Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'stranger', label: 'Stranger' },
  { value: 'self', label: 'Self' },
  { value: 'pet', label: 'Pet' },
  { value: 'environment', label: 'Environment' },
  { value: 'media', label: 'Media/TV/Radio' },
  { value: 'other', label: 'Other' },
];

export const RESPONSE_OPTIONS = [
  { value: 'left_situation', label: 'Left the situation' },
  { value: 'coping_technique', label: 'Used a calming practice' },
  { value: 'asked_stop', label: 'Asked them to stop' },
  { value: 'angry', label: 'Got angry/frustrated' },
  { value: 'headphones', label: 'Used headphones' },
  { value: 'ignored', label: 'Tried to ignore it' },
  { value: 'other', label: 'Other' },
];

export const SUPPORT_TYPES = [
  { value: 'breathing', label: 'Breathing Practice', icon: 'Wind' },
  { value: 'mantra', label: 'Calming Mantra', icon: 'Heart' },
  { value: 'soundscape', label: 'Soothing Soundscape', icon: 'Music' },
  { value: 'grounding', label: 'Grounding Practice', icon: 'Anchor' },
  { value: 'ai_chat', label: 'Talk to AI', icon: 'MessageCircle' },
];

export const TOOL_CATEGORIES = [
  { value: 'breathwork', label: 'Breathwork', color: 'indigo' },
  { value: 'somatic', label: 'Somatic', color: 'cyan' },
  { value: 'cognitive', label: 'Cognitive', color: 'purple' },
  { value: 'education', label: 'Education', color: 'emerald' },
  { value: 'communication', label: 'Communication', color: 'amber' },
];

// External URLs
export const EXTERNAL_URLS = {
  SKOOL_COMMUNITY: 'https://www.skool.com/thriving-with-misophonia',
};

// Routes
export const ROUTES = {
  HOME: '/',
  ONBOARDING_PROFILE: '/onboarding/profile',
  ONBOARDING_VERIFY: '/onboarding/verify',
  ONBOARDING_ASSESSMENT: '/onboarding/assessment',
  ONBOARDING_PLAN: '/onboarding/plan',
  ONBOARDING_FIRST_PRACTICE: '/onboarding/first-practice',
  ONBOARDING_TRIGGERS: '/onboarding/triggers',
  DASHBOARD: '/dashboard',
  TOOLS: '/tools',
  LOG: '/journal/new',
  JOURNAL: '/journal',
  CHECK_IN: '/journal/check-in',
  LOG_SUCCESS: '/journal/saved',
  LOG_SUPPORT: '/log/support',
  JOURNAL_DEEPER: '/journal/deeper',
  CHAT: '/chat',
  SOUNDSCAPES: '/soundscapes',
  BOUNDARIES: '/boundaries',
  PROFILE: '/profile',
  PROFILE_TRIGGERS: '/profile/triggers',
  DEBUG: '/debug',
  PREMIUM: '/premium',
  RESOURCES: '/resources',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  CALM: '/calm',
  QUIZ: '/quiz',
  EXPERIENCE_IMPERMANENCE: '/tools/experiences/impermanence',
  EXPERIENCE_MANDALA: '/tools/experiences/mandala',
  EXPERIENCE_PULSE: '/tools/experiences/pulse',
  EXPERIENCE_GROUNDING: '/tools/experiences/grounding',
  EXPERIENCE_FOCUS: '/tools/experiences/focus',
  EXPERIENCE_ALIVE: '/tools/experiences/alive',
};

// Attribution options (how did you find us)
export const ATTRIBUTION_OPTIONS = [
  { value: 'skool', label: 'Skool Community' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'friend_family', label: 'Friend or Family' },
  { value: 'therapist', label: 'Therapist/Healthcare Provider' },
  { value: 'search', label: 'Search Engine' },
  { value: 'podcast', label: 'Podcast or Video' },
  { value: 'other', label: 'Other' },
];

// ─── Sacred Geometry & Harmonics ───────────────────────────────────

// Golden Ratio
export const PHI = 1.618033988749895;

// Phi-based spacing scale (base unit: 6px, Tesla's 3-6-9)
// Each step ≈ previous × phi
export const PHI_SCALE = [6, 10, 16, 26, 42, 68, 110];

// Fibonacci sequence (used for animation timing in ms)
export const FIBONACCI_TIMING = {
  micro: 34,     // hover, micro-interactions
  fast: 55,      // stagger delays
  snap: 89,      // quick feedback
  shift: 144,    // transitions
  move: 233,     // element transitions
  flow: 377,     // page elements
  ease: 610,     // reveals
  breathe: 987,  // emotional moments
  ceremony: 1597, // page ceremonies
  sacred: 2584,  // full sequences
  long: 4181,    // deep pauses
  vast: 6765,    // extended reading windows
};

// Solfeggio frequency-colour mapping
// Each colour carries an intentional vibrational association
export const SOLFEGGIO = {
  indigo: { hz: 528, name: 'Transformation & Love', purpose: 'DNA repair, nervous system harmony' },
  violet: { hz: 852, name: 'Returning to Spiritual Order', purpose: 'Intuition, inner knowing' },
  cyan:   { hz: 741, name: 'Awakening & Expression', purpose: 'Solutions, self-expression' },
  slate:  { hz: 396, name: 'Liberation from Fear', purpose: 'Grounding, safety' },
  white:  { hz: 963, name: 'Higher Connection', purpose: 'Unity, oneness' },
};

// Sacred counts
export const SACRED = {
  stars: 37,        // prime
  mantras: 23,      // prime
  dailyMessages: 7, // sacred, prime
  dailyAffirmations: 37, // prime
  breathTechniques: 3, // Tesla's 3
  sessionsPerTechnique: 3, // Tesla's 3
  baseUnit: 6,      // Tesla's 6
  seedOfLifeCircles: 7, // sacred
};

// Prime-based durations for organic rhythm (never sync mechanically)
export const PRIME_DURATIONS = [2.3, 3.7, 5.3, 7.1, 11.3, 13.7];

// Deeper processing prompt pools (contextual, sacred counts)
// After a trigger log (23 prompts, prime)
export const DEEPER_PROMPTS_TRIGGER = [
  // Body awareness
  'Where did you feel it in your body?',
  'What did your body want to do in that moment?',
  'Has the tension shifted since then? Where is it now?',
  'If the feeling had a shape or weight, what would it be?',
  'What does your body need right now?',
  // Self-compassion
  'What would you say to a friend who felt this way?',
  'What part of you was trying to protect you just then?',
  'Is there something you need to hear right now?',
  'What would it feel like to let this moment be enough?',
  'You showed up. What does that tell you about yourself?',
  // Patterns and noticing
  'Have you noticed this feeling before? When?',
  'Was there a moment just before the sound where something shifted?',
  'What were you hoping for in that space?',
  'If this sound had less power over you, what would be different?',
  'What time of day does this tend to find you?',
  // Environment and context
  'What was the space like around you?',
  'Was there anything about the situation that made it harder?',
  'Were you already carrying something before this happened?',
  'What would have made that moment a little easier?',
  'Is there a version of that space where you feel safe?',
  // Moving forward
  'What helped you get through it?',
  'Is there one small thing you could do for yourself right now?',
  'What would you like to remember about how you handled this?',
];

// After a standalone check-in (11 prompts, prime)
export const DEEPER_PROMPTS_CHECKIN = [
  'What is on your mind right now?',
  'Is there something you have been carrying today?',
  'What does this feeling want you to know?',
  'If you could change one thing about today, what would it be?',
  'What has been taking up space lately?',
  'What would feel good to let go of right now?',
  'Is there something you are looking forward to?',
  'What is one thing that went well today?',
  'What do you need more of right now?',
  'How does this moment compare to how you started the day?',
  'What would you like tomorrow to feel like?',
];

// After breathwork (7 prompts, prime)
export const DEEPER_PROMPTS_BREATHWORK = [
  'What shifted during the practice?',
  'Where does the calm sit in your body right now?',
  'What feels different compared to before you started?',
  'Is there anything you noticed while breathing that surprised you?',
  'What would it feel like to carry this stillness with you?',
  'What was the hardest part of staying present?',
  'What do you want to hold onto from this moment?',
];

// Storage keys
export const STORAGE_KEYS = {
  PENDING_EMAIL: 'misocalm_pending_email',
  ONBOARDING_DATA: 'misocalm_onboarding',
  BETA_BANNER_DISMISSED: 'misocalm_beta_dismissed',
  IMPERMANENCE_VISITS: 'misocalm_impermanence_visits',
  IMPERMANENCE_LAST_TEACHING: 'misocalm_impermanence_last_teaching',
  IMPERMANENCE_HUE: 'misocalm_impermanence_hue',
  MANDALA_VISITS: 'misocalm_mandala_visits',
  MANDALA_LAST_TEACHING: 'misocalm_mandala_last_teaching',
  MANDALA_SYMMETRY: 'misocalm_mandala_symmetry',
  MANDALA_HUE: 'misocalm_mandala_hue',
  PULSE_VISITS: 'misocalm_pulse_visits',
  PULSE_LAST_TEACHING: 'misocalm_pulse_last_teaching',
  PULSE_HUE: 'misocalm_pulse_hue',
  GROUNDING_VISITS: 'misocalm_grounding_visits',
  GROUNDING_LAST_TEACHING: 'misocalm_grounding_last_teaching',
  FOCUS_VISITS: 'misocalm_focus_visits',
  FOCUS_LAST_TEACHING: 'misocalm_focus_last_teaching',
  ALIVE_VISITS: 'misocalm_alive_visits',
  ALIVE_LAST_TEACHING: 'misocalm_alive_last_teaching',
};

// Impermanence experience teachings (5, prime)
export const IMPERMANENCE_TEACHINGS = [
  {
    lines: [
      'every sound you have ever heard',
      'has already gone',
      'but you are still here',
    ],
  },
  {
    lines: [
      'the sound was never the whole story',
      'it was the story your body told about it',
    ],
  },
  {
    lines: [
      'you watched it come',
      'you watched it go',
      'that is all it ever does',
    ],
  },
  {
    lines: [
      'you gave it colour',
      'you gave it space',
      'and it gave itself back to silence',
    ],
  },
  {
    lines: [
      'nothing that passes through',
      'can stay',
      'and you have never been the passing thing',
    ],
  },
];

// Mandala experience teachings (7, prime)
export const MANDALA_TEACHINGS = [
  {
    lines: [
      'you touched the void',
      'and something beautiful appeared',
      'that is not a small thing',
    ],
  },
  {
    lines: [
      'you did not plan this',
      'you did not try to get it right',
      'and it is already perfect',
    ],
  },
  {
    lines: [
      'every part of this came from you',
      'even the parts you did not expect',
      'especially those',
    ],
  },
  {
    lines: [
      'nothing here was forced',
      'the symmetry was always there',
      'waiting for your touch to find it',
    ],
  },
  {
    lines: [
      'you cannot make this ugly',
      'no matter where you reach',
      'beauty follows your hands',
    ],
  },
  {
    lines: [
      'wholeness is not something you build',
      'it is something you already are',
      'this pattern knew that before you arrived',
    ],
  },
  {
    lines: [
      'the centre holds',
      'no matter how far the pattern reaches',
      'you are the centre',
    ],
  },
];

// Pulse experience teachings (7, prime — each has 5 lines, prime)
export const PULSE_TEACHINGS = [
  {
    lines: [
      'your heart has been beating',
      'this whole time',
      'through every sound',
      'through every storm',
      'it never stopped',
    ],
  },
  {
    lines: [
      'you have survived',
      'every sound',
      'you have ever heard',
      'and your heart',
      'kept beating',
    ],
  },
  {
    lines: [
      'this rhythm',
      'was there before the sounds',
      'it will be there after',
      'it does not waver',
      'what the world throws at you',
    ],
  },
  {
    lines: [
      'feel this',
      'this is not fragile',
      'this has carried you',
      'through every day',
      'you thought you could not survive',
    ],
  },
  {
    lines: [
      'the sounds come',
      'and your heart beats',
      'the sounds go',
      'and your heart beats',
      'you are the constant',
    ],
  },
  {
    lines: [
      'you did not choose',
      'to feel this deeply',
      'and you chose',
      'to keep showing up',
      'feel that',
    ],
  },
  {
    lines: [
      'this pulse',
      'is proof',
      'that you are still here',
      'still whole',
      'still alive',
    ],
  },
];

// Grounding experience teachings (5, prime)
export const GROUNDING_TEACHINGS = [
  {
    lines: [
      'you just moved through five senses',
      'and your nervous system followed',
      'that is not a small thing',
    ],
  },
  {
    lines: [
      'your senses are always here',
      'waiting to bring you home',
      'you only need to notice',
    ],
  },
  {
    lines: [
      'the sounds were there the whole time',
      'and you were here the whole time',
      'both things can be true',
    ],
  },
  {
    lines: [
      'five senses',
      'fifteen moments of choosing',
      'and the thread that connects them all is you',
    ],
  },
  {
    lines: [
      'every time you return to your body',
      'you remind your nervous system',
      'that right now, you are safe',
    ],
  },
];

// After grounding (7 prompts, prime)
export const DEEPER_PROMPTS_GROUNDING = [
  'What did you notice about where you are right now?',
  'Was there a sense that felt easier to connect with?',
  'How does your body feel compared to when you started?',
  'Did anything surprise you about what your body noticed?',
  'Which moment felt most grounding?',
  'What is one thing you noticed that you want to remember?',
  'If you could carry one feeling from this into the rest of your day, which would it be?',
];

// Focus experience teachings (7, prime)
export const FOCUS_TEACHINGS = [
  {
    lines: [
      'your attention was always yours',
      'no sound has ever owned it',
      'it only borrowed what you gave',
    ],
  },
  {
    lines: [
      'the centre held',
      'while everything moved around it',
      'it always holds',
    ],
  },
  {
    lines: [
      'you watched the light come',
      'without reaching for it',
      'that is a kind of trust',
    ],
  },
  {
    lines: [
      'focus is not force',
      'it is a gentle return',
      'to where you already are',
    ],
  },
  {
    lines: [
      'the sounds that pull your attention',
      'are loud',
      'but you are deeper',
    ],
  },
  {
    lines: [
      'every time you came back to the centre',
      'your nervous system learned',
      'that you are the one who decides',
    ],
  },
  {
    lines: [
      'the tunnel was not something you entered',
      'it was something you created',
      'by staying still',
    ],
  },
];

// After focus (7 prompts, prime)
export const DEEPER_PROMPTS_FOCUS = [
  'What did you notice about your attention during that?',
  'Was there a moment where something felt easy or soft?',
  'How does the stillness feel compared to before you started?',
  'Did anything at the edges pull your attention? How did it feel to come back?',
  'What does it feel like to know your attention is yours?',
  'Was there a moment where you forgot everything else?',
  'What would you like to carry from this into the rest of your day?',
];

// Alive experience teachings (7, prime — each has 3 lines)
export const ALIVE_TEACHINGS = [
  {
    lines: [
      'this is what your sensitivity looks like',
      'when it has space',
      'it builds sanctuaries',
    ],
  },
  {
    lines: [
      'you did not need to fight anything',
      'you only needed to breathe',
      'and the walls rose to meet you',
    ],
  },
  {
    lines: [
      'every breath you took',
      'was your nervous system learning',
      'this is what you build when no one is watching',
    ],
  },
  {
    lines: [
      'the sounds still come',
      'but here they pass through',
      'they cannot stay where breath lives',
    ],
  },
  {
    lines: [
      'some part of you already knew',
      'how to find this place',
      'it was waiting for your breath to lead',
    ],
  },
  {
    lines: [
      'you breathe in and the world softens',
      'you breathe out and it holds',
      'this is your architecture',
    ],
  },
  {
    lines: [
      'you were never too sensitive',
      'you were always building',
      'towards this',
    ],
  },
];

// After alive (7 prompts, prime)
export const DEEPER_PROMPTS_ALIVE = [
  'What did you notice about your breathing during that?',
  'Is there a place in your body where the stillness lives right now?',
  'What did it feel like to build something with nothing but breath?',
  'Was there a moment where the space felt different?',
  'Where in your life could you use this breath?',
  'Did your breathing change as the practice deepened?',
  'What does your sensitivity mean to you right now?',
];

// Threshold transition text — soft bridge between experience and app (13 total, prime)
export const THRESHOLD_TEXT = {
  journal: [
    'carry this feeling with you',
    'there is no rush',
    'take a moment before you write',
    'let the stillness come with you',
    'the words will find you',
  ],
  dashboard: [
    'your sanctuary is waiting',
    'softly, back to centre',
    'nothing needs to happen next',
    'the practice stays with you',
    'you are already home',
  ],
  tools: [
    'gently, now',
    'carrying what you made',
    'back to solid ground',
  ],
};

// Misophonia Response Levels (0-10 clinical scale)
export const MISOPHONIA_LEVELS = [
  {
    level: 0,
    label: 'No discomfort',
    description: 'Aware of trigger sound but feels no discomfort.',
    color: 'emerald',
  },
  {
    level: 1,
    label: 'Minimal awareness',
    description: 'Aware of trigger person but feels no or minimal anticipatory anxiety.',
    color: 'emerald',
  },
  {
    level: 2,
    label: 'Mild discomfort',
    description: 'Minimal psychic discomfort, irritation or annoyance. No panic or fight/flight response.',
    color: 'emerald',
  },
  {
    level: 3,
    label: 'Increasing discomfort',
    description: 'Increasing levels of psychic discomfort but no physical response. May be hyper-vigilant to stimuli.',
    color: 'amber',
  },
  {
    level: 4,
    label: 'Non-confrontational coping',
    description: 'Minimal physical response - asking trigger person to stop, covering one ear, or calmly moving away.',
    color: 'amber',
  },
  {
    level: 5,
    label: 'Confrontational coping',
    description: 'More confrontational coping - overtly covering ears, mimicking trigger person, displaying overt irritation.',
    color: 'amber',
  },
  {
    level: 6,
    label: 'Substantial discomfort',
    description: 'Substantial psychic discomfort. Symptoms of panic and fight/flight response begin to engage.',
    color: 'orange',
  },
  {
    level: 7,
    label: 'Significant distress',
    description: 'Substantial psychic discomfort. Increasing use of confrontational coping. May re-imagine trigger over and over.',
    color: 'orange',
  },
  {
    level: 8,
    label: 'Severe distress',
    description: 'Substantial psychic discomfort. Some violence ideation may occur.',
    color: 'rose',
  },
  {
    level: 9,
    label: 'Panic/rage response',
    description: 'Panic or rage in full swing. Conscious decision not to use violence. May flee or use physical violence on objects.',
    color: 'rose',
  },
  {
    level: 10,
    label: 'Crisis level',
    description: 'Actual use of physical violence on person, animal, or self. Self-harming may occur.',
    color: 'rose',
  },
];

// Check-in scales (7 steps = prime)
export const CHECK_IN_SCALES = {
  energy: { min: 0, max: 6, leftLabel: 'Low energy', rightLabel: 'High energy' },
  pleasantness: { min: 0, max: 6, leftLabel: 'Unpleasant', rightLabel: 'Pleasant' },
};

// Interval Timer options (Sacred Geometry compliant)
export const TIMER_DURATIONS = [5, 10, 15, 20, 25, 30, 40]; // 7 options (prime)
export const TIMER_REMINDERS = [0, 2, 5]; // 3 options (Tesla's 3) — 0 = none
export const TIMER_ROUNDS = [1, 2, 3]; // 3 options (Tesla's 3)

// Soundscapes
export const SOUNDSCAPES = [
  { id: 'rain', name: 'Rain', icon: 'CloudRain', duration: '∞' },
  { id: 'ocean', name: 'Ocean Waves', icon: 'Waves', duration: '∞' },
  { id: 'forest', name: 'Forest', icon: 'TreePine', duration: '∞' },
  { id: 'white-noise', name: 'White Noise', icon: 'Radio', duration: '∞' },
  { id: 'night', name: 'Night Ambience', icon: 'Moon', duration: '∞' },
  { id: 'fireplace', name: 'Fireplace', icon: 'Flame', duration: '∞' },
  { id: 'stream', name: 'Gentle Stream', icon: 'Droplets', duration: '∞' },
];

// Daily affirmations — misophonia-specific (37, prime)
// Rotate daily via getDayOfYear. Validating, warm, never prescriptive.
export const DAILY_AFFIRMATIONS = [
  // Acceptance & validation
  'Your sensitivity is not a flaw.',
  'You are allowed to need quiet.',
  'Your reactions are valid, even when others don\'t understand.',
  'You are more than what you hear.',
  'What you feel is real. You don\'t need to justify it.',
  'Your nervous system is doing its best with what it has.',
  'You are not broken. You are wired differently.',
  // Strength & resilience
  'You have survived every difficult sound so far.',
  'Leaving a space is not weakness. It is wisdom.',
  'Asking for what you need takes courage.',
  'You are allowed to protect your peace.',
  'Setting boundaries is an act of self-respect.',
  'You don\'t owe anyone an explanation for your limits.',
  'The fact that you are here says something about your strength.',
  // Practice & growth
  'Calm is not something you find. It is something you practice.',
  'Your nervous system is learning something new today.',
  'Small steps still carry you forward.',
  'You don\'t have to be calm all the time to be doing well.',
  'Progress is not always visible. Trust the process.',
  'Each breath is a choice to stay present.',
  'You are building something that no one else can see yet.',
  // Self-compassion
  'You deserve the same patience you give to others.',
  'It is okay to have hard days.',
  'You are allowed to rest without earning it.',
  'Being gentle with yourself is not giving up.',
  'You don\'t have to fight every battle today.',
  'The part of you that hurts deserves kindness, not criticism.',
  // Understanding & connection
  'You are not alone in this, even when it feels that way.',
  'Someone else in the world is feeling exactly what you feel right now.',
  'The people who love you are still learning. That is okay.',
  'Not everyone will understand. That does not make it less real.',
  // Presence & stillness
  'This moment will pass. You will still be here.',
  'There is space between the sound and your response. You are learning to find it.',
  'Stillness is not the absence of sound. It is the presence of you.',
  'You carry more than most people see. And you carry it well.',
  'Right now, in this breath, you are safe.',
  'Your sensitivity is also your depth. The world needs that.',
];

// Unified daily rotation: 9 breathing sessions + 4 experiences = 13 (prime)
// Rotate daily via getDayOfYear(). Type field distinguishes tools vs experiences.
// Colours: quick=indigo, mid=violet, full=cyan
export const DAILY_PRACTICES_ROTATION = [
  { type: 'tool', id: '1', name: '4-7-8 Breathing',    label: 'A Soft Reset',     duration: 'quick',  time: '~1.5 min', accent: 'indigo' },
  { type: 'tool', id: '1', name: '4-7-8 Breathing',    label: 'Settling In',      duration: 'deep',   time: '~2.5 min', accent: 'violet' },
  { type: 'tool', id: '1', name: '4-7-8 Breathing',    label: 'Deep Stillness',   duration: 'full',   time: '~5 min',   accent: 'cyan' },
  { type: 'tool', id: '3', name: 'Box Breathing',      label: 'Finding Ground',   duration: 'quick',  time: '~1.5 min', accent: 'indigo' },
  { type: 'tool', id: '3', name: 'Box Breathing',      label: 'Steady State',     duration: 'deep',   time: '~3 min',   accent: 'violet' },
  { type: 'tool', id: '3', name: 'Box Breathing',      label: 'Full Anchor',      duration: 'full',   time: '~4 min',   accent: 'cyan' },
  { type: 'tool', id: '4', name: 'Physiological Sigh', label: 'Quick Release',    duration: 'quick',  time: '~30 sec',  accent: 'indigo' },
  { type: 'tool', id: '4', name: 'Physiological Sigh', label: 'Letting Go',       duration: 'medium', time: '~1 min',   accent: 'violet' },
  { type: 'tool', id: '4', name: 'Physiological Sigh', label: 'Complete Unwind',  duration: 'full',   time: '~1.5 min', accent: 'cyan' },
  { type: 'experience', id: 'grounding',    name: 'Grounding',    label: 'Five Senses',       route: ROUTES.EXPERIENCE_GROUNDING,    time: '~3 min', accent: 'cyan' },
  { type: 'experience', id: 'mandala',      name: 'Mandala',      label: 'Touch the Void',    route: ROUTES.EXPERIENCE_MANDALA,      time: '~3 min', accent: 'violet' },
  { type: 'experience', id: 'pulse',        name: 'Pulse',        label: 'Your Heartbeat',    route: ROUTES.EXPERIENCE_PULSE,        time: '~3 min', accent: 'indigo' },
  { type: 'experience', id: 'impermanence', name: 'Impermanence', label: 'What Remains',      route: ROUTES.EXPERIENCE_IMPERMANENCE, time: '~3 min', accent: 'violet' },
  { type: 'experience', id: 'focus',        name: 'Focus',        label: 'The Stillpoint',    route: ROUTES.EXPERIENCE_FOCUS,        time: '~3 min', accent: 'cyan' },
  { type: 'experience', id: 'alive',         name: 'Alive',        label: 'Breathe Life',      route: ROUTES.EXPERIENCE_ALIVE,        time: '~4 min', accent: 'slate' },
];
