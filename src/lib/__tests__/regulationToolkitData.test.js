import { describe, expect, it } from 'vitest';
import {
  REGULATION_FAMILIES,
  REGULATION_FORMAT_LABELS,
  REGULATION_MODES,
  REGULATION_PATHS,
  REGULATION_PRACTICES,
  getPracticesForMode,
  getRecommendedPractice,
  getRegulationPractice,
  getToolkitPreview,
} from '../regulationToolkitData';

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

describe('regulation toolkit data', () => {
  it('uses a prime number of practice families', () => {
    expect(REGULATION_FAMILIES).toHaveLength(5);
    expect(isPrime(REGULATION_FAMILIES.length)).toBe(true);
  });

  it('uses a prime number of first-pass practices', () => {
    expect(REGULATION_PRACTICES).toHaveLength(13);
    expect(isPrime(REGULATION_PRACTICES.length)).toBe(true);
  });

  it('uses prime counts for each start-here path', () => {
    REGULATION_PATHS.forEach((path) => {
      expect(path.practiceIds).toHaveLength(3);
      expect(isPrime(path.practiceIds.length)).toBe(true);
    });
  });

  it('keeps practice ids unique and routable', () => {
    const ids = new Set(REGULATION_PRACTICES.map((practice) => practice.id));
    expect(ids.size).toBe(REGULATION_PRACTICES.length);
    REGULATION_PRACTICES.forEach((practice) => {
      expect(practice.route).toBeTruthy();
      expect(practice.title).toBeTruthy();
      expect(REGULATION_FORMAT_LABELS[practice.format]).toBeTruthy();
      expect(practice.steps.length).toBeGreaterThan(0);
      expect(practice.safetyNotes.length).toBeGreaterThan(0);
    });
  });

  it('returns practices for each regulation mode', () => {
    expect(getPracticesForMode(REGULATION_MODES.TRIGGERED_NOW).map((practice) => practice.id))
      .toEqual(['physiological-sigh', 'grounding-54321', 'emergency-protocol']);
    expect(getPracticesForMode(REGULATION_MODES.GROUND_PROCESS)).toHaveLength(3);
    expect(getPracticesForMode(REGULATION_MODES.BUILD_CAPACITY)).toHaveLength(3);
  });

  it('returns a high-intensity emergency recommendation first', () => {
    expect(getRecommendedPractice({ intensity: 9 })?.id).toBe('emergency-protocol');
  });

  it('keeps physiological sigh as the default triggered-now recommendation', () => {
    expect(getRecommendedPractice({ mode: REGULATION_MODES.TRIGGERED_NOW })?.id)
      .toBe('physiological-sigh');
  });

  it('uses body responses before triggered-now fallback recommendations', () => {
    expect(getRecommendedPractice({
      mode: REGULATION_MODES.TRIGGERED_NOW,
      bodyResponses: ['Fists clenching'],
    })?.id).toBe('movement-reset');
  });

  it('recommends movement when the body needs discharge', () => {
    expect(getRecommendedPractice({ bodyResponses: ['Fists clenching'] })?.id).toBe('movement-reset');
    expect(getRecommendedPractice({ bodyResponses: ['Heat or flushing'] })?.id).toBe('movement-reset');
  });

  it('recommends a tension practice when tension is logged', () => {
    expect(getRecommendedPractice({ bodyResponses: ['Jaw tension'] })?.id)
      .toBe('progressive-muscle-relaxation');
  });

  it('recommends orienting when shutdown or escape energy is logged', () => {
    expect(getRecommendedPractice({ bodyResponses: ['Numbness'] })?.id).toBe('grounding-54321');
    expect(getRecommendedPractice({ bodyResponses: ['Urge to escape'] })?.id).toBe('grounding-54321');
  });

  it('uses goal-specific breath recommendations', () => {
    expect(getRecommendedPractice({ goal: 'sleep' })?.id).toBe('478-breathing');
    expect(getRecommendedPractice({ goal: 'prepare' })?.id).toBe('box-breathing');
  });

  it('keeps audio-ready guided practices timed for future recordings', () => {
    ['body-scan', 'progressive-muscle-relaxation'].forEach((id) => {
      const practice = getRegulationPractice(id);
      const guide = practice.voiceGuide;
      const total = guide.phases.reduce((sum, phase) => sum + phase.durationSec, 0);

      expect(guide.status).toBe('recording_needed');
      expect(guide.phases).toHaveLength(5);
      expect(total).toBe(233);
      guide.phases.forEach((phase) => {
        expect([34, 55]).toContain(phase.durationSec);
        expect(phase.cue).toBeTruthy();
      });
    });
  });

  it('builds toolkit previews with resolved practices', () => {
    const preview = getToolkitPreview();
    expect(preview).toHaveLength(3);
    expect(preview.map((path) => path.practices.length)).toEqual([3, 3, 3]);
    expect(getRegulationPractice('missing')).toBeNull();
  });
});
