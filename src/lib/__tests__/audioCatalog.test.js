import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  AUDIO_ASSET_STATUS,
  AUDIO_PLAYBACK_TYPES,
  AUDIO_SAFETY_TAGS,
  REGULATION_AUDIO_ASSETS,
  buildVoiceGuideTranscript,
  getAudioAssetsForPractice,
  getPlayableAudioAssetsForPractice,
  getPracticeAudioPlan,
  getPrimaryVoiceAsset,
} from '../audioCatalog';
import { getRegulationPractice } from '../regulationToolkitData';

const FIBONACCI_SECONDS = [13, 34, 89, 233];

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

describe('audioCatalog', () => {
  it('keeps the first audio asset set prime and honest', () => {
    expect(REGULATION_AUDIO_ASSETS).toHaveLength(7);
    expect(isPrime(REGULATION_AUDIO_ASSETS.length)).toBe(true);

    REGULATION_AUDIO_ASSETS.forEach((asset) => {
      expect(asset.status).toBe(AUDIO_ASSET_STATUS.PLACEHOLDER_READY);
      expect(FIBONACCI_SECONDS).toContain(asset.durationSec);
      expect(asset.finalSource).toMatch(/^\/audio\//);
      asset.safetyTags.forEach((tag) => {
        expect(AUDIO_SAFETY_TAGS).toContain(tag);
      });
    });
  });

  it('returns planned assets for regulation practices', () => {
    expect(getAudioAssetsForPractice('sound-support')).toHaveLength(3);
    expect(getAudioAssetsForPractice('body-scan')).toHaveLength(1);
    expect(getAudioAssetsForPractice('missing')).toEqual([]);
  });

  it('resolves the primary voice asset for guided practices', () => {
    expect(getPrimaryVoiceAsset('body-scan')?.id).toBe('voice-body-scan-v1');
    expect(getPrimaryVoiceAsset('sound-support')).toBeNull();
  });

  it('maps generated file placeholders to committed public audio files', () => {
    const playableAssets = getPlayableAudioAssetsForPractice('sound-support');

    expect(playableAssets).toHaveLength(3);
    playableAssets.forEach((asset) => {
      expect(asset.playback).toBe(AUDIO_PLAYBACK_TYPES.FILE);
      expect(asset.source).toMatch(/\.wav$/);
      expect(existsSync(join(process.cwd(), 'public', asset.source.replace('/audio/', 'audio/')))).toBe(true);
    });
    expect(getPlayableAudioAssetsForPractice('body-scan')).toEqual([]);
  });

  it('combines practice voice guide timing with asset slots', () => {
    const practice = getRegulationPractice('body-scan');
    const plan = getPracticeAudioPlan(practice);

    expect(plan.voiceGuide.phases).toHaveLength(5);
    expect(plan.voiceAsset.title).toBe('Body Scan guide');
    expect(plan.voiceAsset.playback).toBe(AUDIO_PLAYBACK_TYPES.SPEECH_SYNTHESIS);
    expect(plan.hasReadyAudio).toBe(false);
    expect(plan.hasPlaceholderAudio).toBe(true);
    expect(plan.transcript).toHaveLength(5);
  });

  it('builds a simple transcript for voice practices without phase metadata', () => {
    const transcript = buildVoiceGuideTranscript(getRegulationPractice('physiological-sigh'));

    expect(transcript).toHaveLength(3);
    expect(transcript[0].text).toBe('Breathe in through your nose.');
    expect(transcript[0].durationSec).toBe(13);
  });

  it('returns null when a practice has no planned audio', () => {
    expect(getPracticeAudioPlan(getRegulationPractice('emergency-protocol'))).toBeNull();
    expect(getPracticeAudioPlan(null)).toBeNull();
  });
});
