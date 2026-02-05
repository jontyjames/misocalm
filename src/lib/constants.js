/**
 * MisoMind Application Constants
 */

// API & Timeouts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const API_TIMEOUT = 10000; // 10 seconds for Supabase calls
export const DEBOUNCE_DELAY = 300;

// Default triggers ordered by most commonly reported (based on misophonia research)
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
];

// Enums matching database
export const SOURCE_OPTIONS = [
  { value: 'partner', label: 'Partner/Spouse' },
  { value: 'parent_mum', label: 'Parent - Mum' },
  { value: 'parent_dad', label: 'Parent - Dad' },
  { value: 'step_mum', label: 'Step Mum' },
  { value: 'step_dad', label: 'Step Dad' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'stranger', label: 'Stranger' },
  { value: 'self', label: 'Self' },
  { value: 'pet', label: 'Pet' },
  { value: 'environment', label: 'Environment' },
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
  { value: 'ai_chat', label: 'Talk to AI', icon: 'MessageCircle' },
];

export const TOOL_CATEGORIES = [
  { value: 'breathwork', label: 'Breathwork', color: 'indigo' },
  { value: 'somatic', label: 'Somatic', color: 'cyan' },
  { value: 'cognitive', label: 'Cognitive', color: 'purple' },
  { value: 'education', label: 'Education', color: 'emerald' },
  { value: 'therapeutic', label: 'Therapeutic', color: 'pink' },
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
  DASHBOARD: '/dashboard',
  TOOLS: '/tools',
  LOG: '/log',
  LOG_SUCCESS: '/log/success',
  LOG_SUPPORT: '/log/support',
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
  { value: 'other', label: 'Other' },
];

// Storage keys
export const STORAGE_KEYS = {
  PENDING_EMAIL: 'misomind_pending_email',
  ONBOARDING_DATA: 'misomind_onboarding',
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
];
