import {
  Activity,
  Droplets,
  Footprints,
  Hand,
  Headphones,
  Moon,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export const COLD_WATER_SAFETY_CHECKS = [
  'My body has enough capacity today.',
  'I can keep this cool, not shocking.',
  'I can warm myself afterwards.',
];

export const COLD_WATER_METHODS = [
  {
    id: 'hands',
    title: 'Hands',
    description: 'Cool water over hands or wrists.',
    icon: Hand,
  },
  {
    id: 'face',
    title: 'Face',
    description: 'A cool splash or cloth near the face.',
    icon: Droplets,
  },
  {
    id: 'cloth',
    title: 'Cool Cloth',
    description: 'A gentle cloth on neck, cheeks, or hands.',
    icon: ShieldCheck,
  },
];

export const COLD_WATER_DURATION_SEC = 34;

export const EMERGENCY_DEFAULT_PHRASES = [
  'I need a short break.',
  'I am overwhelmed and need a minute.',
  'I will come back when my body settles.',
];

export const EMERGENCY_PROTOCOL_STEPS = [
  {
    title: 'Leave if safe',
    cue: 'If you can step away without creating risk, do that first.',
  },
  {
    title: 'Use one phrase',
    cue: 'Choose a sentence that is true enough and requires no explanation.',
  },
  {
    title: 'Find one breath',
    cue: 'Use one long exhale or open the fast breath practice.',
  },
  {
    title: 'Stay oriented',
    cue: 'Name where you are and let your eyes find a stable point.',
  },
  {
    title: 'Recover before explaining',
    cue: 'The explanation can wait until your body has more room.',
  },
];

export const MOVEMENT_RESET_FLOWS = [
  {
    id: 'shake',
    title: 'Shake',
    description: 'For heat, trembling, or clenched energy.',
    durationSec: 34,
    icon: Activity,
    steps: [
      'Plant both feet and soften your knees.',
      'Let your hands shake without forcing it.',
      'Let arms or legs join only if that feels safe.',
      'Make the movement smaller and slower.',
      'Pause and notice one steadier breath.',
    ],
  },
  {
    id: 'walk',
    title: 'Walk',
    description: 'For escape energy that needs a safe path.',
    durationSec: 55,
    icon: Footprints,
    steps: [
      'Choose a clear path before you begin.',
      'Walk at the pace your body already has.',
      'Let your eyes stay soft and wide.',
      'Slow the pace by one small degree.',
      'Stop only when your body has landed.',
    ],
  },
  {
    id: 'stretch',
    title: 'Stretch',
    description: 'For jaw, shoulders, hands, or hip tension.',
    durationSec: 89,
    icon: RotateCcw,
    steps: [
      'Unclench your jaw and let your tongue rest.',
      'Lift and release your shoulders gently.',
      'Open and close your hands slowly.',
      'Stretch one safe body area without pushing.',
      'Let your final exhale be longer than usual.',
    ],
  },
];

export const SOUND_SUPPORT_MODES = [
  {
    id: 'public',
    title: 'Public Masking',
    description: 'For shared spaces where a sound is still present.',
    icon: Headphones,
    steps: [
      'Choose the lowest texture that gives your body support.',
      'Keep enough awareness to stay safe in the space.',
      'Pair the sound with one longer exhale.',
      'Notice whether your jaw or shoulders can soften.',
      'Release the layer when the moment has passed.',
    ],
  },
  {
    id: 'recovery',
    title: 'Recovery Cocoon',
    description: 'For after a trigger, when the nervous system needs cover.',
    icon: ShieldCheck,
    steps: [
      'Move somewhere quieter if you can.',
      'Choose a steady texture rather than something dramatic.',
      'Let your shoulders drop before changing volume.',
      'Check whether breath, tapping, or movement is also needed.',
      'Let the sound fade when your body has more room.',
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep Ramp',
    description: 'For evening support without creating a harsh dependency.',
    icon: Moon,
    steps: [
      'Set the sound before you feel desperate for it.',
      'Keep the volume lower than daytime masking.',
      'Let the breath become the main practice.',
      'Choose a texture that feels boring in a good way.',
      'Reduce stimulation if the sound starts feeling activating.',
    ],
  },
];

export const SOUND_SUPPORT_TEXTURES = ['Brown noise', 'Rain', 'Fan', 'Soft music', 'Quiet'];

export function getSoundVolumeTone(volume) {
  if (volume <= 3) return 'Gentle layer';
  if (volume <= 8) return 'Supportive layer';
  return 'High support. Check hearing safety.';
}

export function getSoundVolumePlanLabel(volume) {
  if (volume <= 3) return 'gentle layer';
  if (volume <= 8) return 'supportive layer';
  return 'high-support layer with a hearing safety check';
}
