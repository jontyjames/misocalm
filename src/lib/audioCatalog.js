export const AUDIO_ASSET_STATUS = {
  RECORDING_NEEDED: 'recording_needed',
  GENERATION_NEEDED: 'generation_needed',
  PLACEHOLDER_READY: 'placeholder_ready',
  READY: 'ready',
};

export const AUDIO_ASSET_TYPES = {
  VOICE_GUIDE: 'voice-guide',
  SOUND_BED: 'sound-bed',
  TIMING_CUE: 'timing-cue',
};

export const AUDIO_SAFETY_TAGS = [
  'no-autoplay',
  'soft-attack',
  'low-start-volume',
  'no-mouth-sounds',
  'loop-safe',
];

export const AUDIO_PLAYBACK_TYPES = {
  FILE: 'file',
  SPEECH_SYNTHESIS: 'speech-synthesis',
};

export const REGULATION_AUDIO_ASSETS = [
  {
    id: 'voice-physiological-sigh-v1',
    practiceId: 'physiological-sigh',
    type: AUDIO_ASSET_TYPES.VOICE_GUIDE,
    status: AUDIO_ASSET_STATUS.PLACEHOLDER_READY,
    title: 'Physiological Sigh guide',
    durationSec: 34,
    source: null,
    finalSource: '/audio/voice/regulation/physiological-sigh/v1.m4a',
    playback: AUDIO_PLAYBACK_TYPES.SPEECH_SYNTHESIS,
    transcriptKey: 'regulation/physiological-sigh/v1',
    safetyTags: ['no-autoplay', 'soft-attack', 'low-start-volume', 'no-mouth-sounds'],
  },
  {
    id: 'voice-body-scan-v1',
    practiceId: 'body-scan',
    type: AUDIO_ASSET_TYPES.VOICE_GUIDE,
    status: AUDIO_ASSET_STATUS.PLACEHOLDER_READY,
    title: 'Body Scan guide',
    durationSec: 233,
    source: null,
    finalSource: '/audio/voice/regulation/body-scan/v1.m4a',
    playback: AUDIO_PLAYBACK_TYPES.SPEECH_SYNTHESIS,
    transcriptKey: 'regulation/body-scan/v1',
    safetyTags: ['no-autoplay', 'soft-attack', 'low-start-volume', 'no-mouth-sounds'],
  },
  {
    id: 'voice-progressive-muscle-relaxation-v1',
    practiceId: 'progressive-muscle-relaxation',
    type: AUDIO_ASSET_TYPES.VOICE_GUIDE,
    status: AUDIO_ASSET_STATUS.PLACEHOLDER_READY,
    title: 'Progressive Muscle Relaxation guide',
    durationSec: 233,
    source: null,
    finalSource: '/audio/voice/regulation/progressive-muscle-relaxation/v1.m4a',
    playback: AUDIO_PLAYBACK_TYPES.SPEECH_SYNTHESIS,
    transcriptKey: 'regulation/progressive-muscle-relaxation/v1',
    safetyTags: ['no-autoplay', 'soft-attack', 'low-start-volume', 'no-mouth-sounds'],
  },
  {
    id: 'sound-bed-brown-noise-soft-v1',
    practiceId: 'sound-support',
    type: AUDIO_ASSET_TYPES.SOUND_BED,
    status: AUDIO_ASSET_STATUS.PLACEHOLDER_READY,
    title: 'Soft brown noise',
    durationSec: 34,
    source: '/audio/soundscapes/brown-noise-soft/v1.wav',
    finalSource: '/audio/soundscapes/brown-noise-soft/v1.m4a',
    playback: AUDIO_PLAYBACK_TYPES.FILE,
    transcriptKey: null,
    safetyTags: ['no-autoplay', 'soft-attack', 'low-start-volume', 'loop-safe'],
  },
  {
    id: 'sound-bed-rain-low-v1',
    practiceId: 'sound-support',
    type: AUDIO_ASSET_TYPES.SOUND_BED,
    status: AUDIO_ASSET_STATUS.PLACEHOLDER_READY,
    title: 'Low rain bed',
    durationSec: 34,
    source: '/audio/soundscapes/rain-low/v1.wav',
    finalSource: '/audio/soundscapes/rain-low/v1.m4a',
    playback: AUDIO_PLAYBACK_TYPES.FILE,
    transcriptKey: null,
    safetyTags: ['no-autoplay', 'soft-attack', 'low-start-volume', 'loop-safe'],
  },
  {
    id: 'sound-bed-ocean-soft-v1',
    practiceId: 'sound-support',
    type: AUDIO_ASSET_TYPES.SOUND_BED,
    status: AUDIO_ASSET_STATUS.PLACEHOLDER_READY,
    title: 'Soft ocean bed',
    durationSec: 34,
    source: '/audio/soundscapes/ocean-soft/v1.wav',
    finalSource: '/audio/soundscapes/ocean-soft/v1.m4a',
    playback: AUDIO_PLAYBACK_TYPES.FILE,
    transcriptKey: null,
    safetyTags: ['no-autoplay', 'soft-attack', 'low-start-volume', 'loop-safe'],
  },
  {
    id: 'timing-cue-gentle-chime-v1',
    practiceId: 'box-breathing',
    type: AUDIO_ASSET_TYPES.TIMING_CUE,
    status: AUDIO_ASSET_STATUS.PLACEHOLDER_READY,
    title: 'Gentle breath cue',
    durationSec: 13,
    source: '/audio/cues/gentle-breath-chime/v1.wav',
    finalSource: '/audio/cues/gentle-breath-chime/v1.m4a',
    playback: AUDIO_PLAYBACK_TYPES.FILE,
    transcriptKey: null,
    safetyTags: ['no-autoplay', 'soft-attack', 'low-start-volume'],
  },
];

export function getAudioAssetsForPractice(practiceId) {
  return REGULATION_AUDIO_ASSETS.filter((asset) => asset.practiceId === practiceId);
}

export function getPrimaryVoiceAsset(practiceId) {
  return getAudioAssetsForPractice(practiceId).find((asset) => (
    asset.type === AUDIO_ASSET_TYPES.VOICE_GUIDE
  )) || null;
}

export function getPlayableAudioAssetsForPractice(practiceId) {
  return getAudioAssetsForPractice(practiceId).filter((asset) => (
    asset.playback === AUDIO_PLAYBACK_TYPES.FILE && asset.source
  ));
}

export function buildVoiceGuideTranscript(practice) {
  if (!practice) return [];

  if (practice.voiceGuide?.phases?.length > 0) {
    return practice.voiceGuide.phases.map((phase) => ({
      id: phase.id,
      title: phase.title,
      text: phase.cue,
      durationSec: phase.durationSec,
    }));
  }

  return practice.steps.map((step, index) => ({
    id: `step-${index + 1}`,
    title: `Step ${index + 1}`,
    text: step,
    durationSec: 13,
  }));
}

export function getPracticeAudioPlan(practice) {
  if (!practice) return null;

  const assets = getAudioAssetsForPractice(practice.id);
  const voiceAsset = getPrimaryVoiceAsset(practice.id);

  if (assets.length === 0 && !practice.voiceGuide) return null;

  return {
    practiceId: practice.id,
    voiceGuide: practice.voiceGuide || null,
    voiceAsset,
    assets,
    playableAssets: getPlayableAudioAssetsForPractice(practice.id),
    transcript: buildVoiceGuideTranscript(practice),
    hasReadyAudio: assets.some((asset) => asset.status === AUDIO_ASSET_STATUS.READY),
    hasPlaceholderAudio: assets.some((asset) => asset.status === AUDIO_ASSET_STATUS.PLACEHOLDER_READY),
  };
}
