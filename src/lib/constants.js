/**
 * MisoCalm Application Constants
 */

// API & Timeouts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const API_TIMEOUT = 10000; // 10 seconds for Supabase calls
export const DEBOUNCE_DELAY = 300;

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

// Enums matching database
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
  { value: 'coping_technique', label: 'Used a coping technique' },
  { value: 'asked_stop', label: 'Asked them to stop' },
  { value: 'angry', label: 'Got angry/frustrated' },
  { value: 'headphones', label: 'Used headphones' },
  { value: 'ignored', label: 'Tried to ignore it' },
  { value: 'other', label: 'Other' },
];

export const SUPPORT_TYPES = [
  { value: 'breathing', label: 'Breathing Technique', icon: 'Wind' },
  { value: 'mantra', label: 'Calming Mantra', icon: 'Heart' },
  { value: 'soundscape', label: 'Soothing Soundscape', icon: 'Music' },
  { value: 'grounding', label: 'Grounding Exercise', icon: 'Anchor' },
  { value: 'ai_chat', label: 'Talk to AI', icon: 'MessageCircle' },
];

export const TOOL_CATEGORIES = [
  { value: 'breathwork', label: 'Breathwork', color: 'indigo' },
  { value: 'somatic', label: 'Somatic', color: 'cyan' },
  { value: 'cognitive', label: 'Cognitive', color: 'purple' },
  { value: 'education', label: 'Education', color: 'emerald' },
  { value: 'communication', label: 'Communication', color: 'amber' },
];

export const TOOL_LEVELS = [
  { value: 'basic', label: 'Essential', color: 'emerald' },
  { value: 'intermediate', label: 'Level Up', color: 'amber' },
  { value: 'advanced', label: 'Advanced', color: 'purple' },
];

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
  LOG_SUCCESS: '/journal/saved',
  LOG_SUPPORT: '/log/support',
  JOURNAL_DEEPER: '/journal/deeper',
  CHAT: '/chat',
  SOUNDSCAPES: '/soundscapes',
  BOUNDARIES: '/boundaries',
  PROFILE: '/profile',
  DEBUG: '/debug',
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
  breathTechniques: 3, // Tesla's 3
  sessionsPerTechnique: 3, // Tesla's 3
  baseUnit: 6,      // Tesla's 6
  seedOfLifeCircles: 7, // sacred
};

// Prime-based durations for organic rhythm (never sync mechanically)
export const PRIME_DURATIONS = [2.3, 3.7, 5.3, 7.1, 11.3, 13.7];

// Storage keys
export const STORAGE_KEYS = {
  PENDING_EMAIL: 'misocalm_pending_email',
  ONBOARDING_DATA: 'misocalm_onboarding',
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
