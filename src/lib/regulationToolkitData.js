import { INNER_REGULATION_PRACTICES } from '@/lib/regulationInnerPractices';
import { OUTER_REGULATION_PRACTICES } from '@/lib/regulationOuterPractices';

export const REGULATION_MODES = {
  TRIGGERED_NOW: 'triggered_now',
  GROUND_PROCESS: 'ground_process',
  BUILD_CAPACITY: 'build_capacity',
};

export const REGULATION_FAMILIES = [
  { id: 'breath', label: 'Breath', description: 'Fast nervous-system resets' },
  { id: 'body', label: 'Body', description: 'Tension, tapping, and awareness' },
  { id: 'senses', label: 'Senses', description: 'Return to the present moment' },
  { id: 'movement', label: 'Movement', description: 'Discharge activation safely' },
  { id: 'sound', label: 'Sound', description: 'Support without dependency' },
];

export const REGULATION_FORMAT_LABELS = {
  'breath-player': 'Practice',
  'guided-experience': 'Experience',
  'guided-practice': 'Practice',
  timer: 'Timer',
  protocol: 'Protocol',
  'movement-practice': 'Practice',
  'safety-checklist': 'Checklist',
  'support-guide': 'Guide',
  'learning-guide': 'Learning',
};

export const REGULATION_PATHS = [
  {
    id: REGULATION_MODES.TRIGGERED_NOW,
    title: 'Fast Reset',
    description: 'For the moment when a sound has already hit.',
    practiceIds: ['physiological-sigh', 'grounding-54321', 'emergency-protocol'],
    solfeggio: 'indigo',
  },
  {
    id: REGULATION_MODES.GROUND_PROCESS,
    title: 'Ground and Process',
    description: 'For after the wave, when your body still needs care.',
    practiceIds: ['body-scan', 'progressive-muscle-relaxation', 'movement-reset'],
    solfeggio: 'cyan',
  },
  {
    id: REGULATION_MODES.BUILD_CAPACITY,
    title: 'Build Capacity',
    description: 'Small practices that create healthy grooves over time.',
    practiceIds: ['box-breathing', '478-breathing', 'sound-support'],
    solfeggio: 'violet',
  },
];

export const REGULATION_PRACTICES = [
  ...INNER_REGULATION_PRACTICES,
  ...OUTER_REGULATION_PRACTICES,
];

export const PRACTICE_BY_ID = Object.fromEntries(
  REGULATION_PRACTICES.map((practice) => [practice.id, practice]),
);

export function getRegulationPractice(id) {
  return PRACTICE_BY_ID[id] || null;
}

export function getPracticesForMode(mode) {
  const path = REGULATION_PATHS.find((item) => item.id === mode);
  if (!path) return [];
  return path.practiceIds.map(getRegulationPractice).filter(Boolean);
}

export function getPracticesByFamily(familyId) {
  return REGULATION_PRACTICES.filter((practice) => practice.family === familyId);
}

export function getRecommendedPractice(context = {}) {
  const { mode, intensity = 0, bodyResponses = [], goal = '' } = context;

  if (intensity >= 9) return getRegulationPractice('emergency-protocol');
  if (goal === 'sleep') return getRegulationPractice('478-breathing');
  if (goal === 'prepare') return getRegulationPractice('box-breathing');

  const responses = new Set(bodyResponses);
  if (responses.has('Fists clenching') || responses.has('Heat or flushing') || responses.has('Trembling')) {
    return getRegulationPractice('movement-reset');
  }
  if (responses.has('Jaw tension') || responses.has('Muscle tension') || responses.has('Stomach knot')) {
    return getRegulationPractice('progressive-muscle-relaxation');
  }
  if (responses.has('Numbness') || responses.has('Urge to escape')) {
    return getRegulationPractice('grounding-54321');
  }
  if (mode === REGULATION_MODES.TRIGGERED_NOW) return getRegulationPractice('physiological-sigh');
  if (mode === REGULATION_MODES.GROUND_PROCESS) return getRegulationPractice('body-scan');
  if (mode === REGULATION_MODES.BUILD_CAPACITY) return getRegulationPractice('box-breathing');

  return getRegulationPractice('physiological-sigh');
}

export function getToolkitPreview() {
  return REGULATION_PATHS.map((path) => ({
    ...path,
    practices: path.practiceIds.map(getRegulationPractice).filter(Boolean),
  }));
}
