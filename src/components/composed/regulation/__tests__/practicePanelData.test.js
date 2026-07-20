import { describe, expect, it } from 'vitest';
import { SOUND_SUPPORT_MODES, SOUND_SUPPORT_TEXTURES } from '../practicePanelData';

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

describe('practice panel data sacred counts', () => {
  it('keeps sound support options and steps prime-counted', () => {
    expect(SOUND_SUPPORT_MODES).toHaveLength(3);
    expect(SOUND_SUPPORT_TEXTURES).toHaveLength(5);
    SOUND_SUPPORT_MODES.forEach((mode) => {
      expect(mode.steps).toHaveLength(5);
      expect(isPrime(mode.steps.length)).toBe(true);
    });
  });
});
