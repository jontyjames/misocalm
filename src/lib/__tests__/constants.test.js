import { describe, it, expect } from 'vitest';
import {
  DEBOUNCE_DELAY,
  PHI_SCALE,
  FIBONACCI_TIMING,
  SACRED,
  PRIME_DURATIONS,
  DEFAULT_TRIGGERS,
  ENVIRONMENT_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  BODY_RESPONSE_OPTIONS,
  DEEPER_PROMPTS_TRIGGER,
  DEEPER_PROMPTS_CHECKIN,
  DEEPER_PROMPTS_BREATHWORK,
} from '../constants';

// Helper to check if a number is in the Fibonacci sequence
function isFibonacci(n) {
  const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181];
  return fibs.includes(n);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

describe('Sacred Geometry Constants', () => {
  it('DEBOUNCE_DELAY is Fibonacci', () => {
    expect(isFibonacci(DEBOUNCE_DELAY)).toBe(true);
  });

  it('PHI_SCALE follows golden ratio progression', () => {
    expect(PHI_SCALE).toEqual([6, 10, 16, 26, 42, 68, 110]);
    // Each step should be approximately phi * previous
    for (let i = 1; i < PHI_SCALE.length; i++) {
      const ratio = PHI_SCALE[i] / PHI_SCALE[i - 1];
      expect(ratio).toBeGreaterThan(1.4);
      expect(ratio).toBeLessThan(1.8);
    }
  });

  it('all FIBONACCI_TIMING values are Fibonacci numbers', () => {
    Object.values(FIBONACCI_TIMING).forEach((val) => {
      expect(isFibonacci(val)).toBe(true);
    });
  });

  it('SACRED counts use prime or sacred numbers', () => {
    expect(isPrime(SACRED.stars)).toBe(true);
    expect(isPrime(SACRED.mantras)).toBe(true);
    expect(isPrime(SACRED.dailyMessages)).toBe(true);
  });

  it('PRIME_DURATIONS are all numbers', () => {
    PRIME_DURATIONS.forEach((d) => {
      expect(typeof d).toBe('number');
      expect(d).toBeGreaterThan(0);
    });
  });

  it('DEFAULT_TRIGGERS count is prime (11)', () => {
    expect(DEFAULT_TRIGGERS.length).toBe(11);
    expect(isPrime(DEFAULT_TRIGGERS.length)).toBe(true);
  });

  it('ENVIRONMENT_OPTIONS count is prime (5)', () => {
    expect(ENVIRONMENT_OPTIONS.length).toBe(5);
    expect(isPrime(ENVIRONMENT_OPTIONS.length)).toBe(true);
  });

  it('TIME_OF_DAY_OPTIONS count is prime (5)', () => {
    expect(TIME_OF_DAY_OPTIONS.length).toBe(5);
    expect(isPrime(TIME_OF_DAY_OPTIONS.length)).toBe(true);
  });

  it('BODY_RESPONSE_OPTIONS count is prime (11)', () => {
    expect(BODY_RESPONSE_OPTIONS.length).toBe(11);
    expect(isPrime(BODY_RESPONSE_OPTIONS.length)).toBe(true);
  });

  it('ENVIRONMENT_OPTIONS have value and label', () => {
    ENVIRONMENT_OPTIONS.forEach(opt => {
      expect(opt.value).toBeTruthy();
      expect(opt.label).toBeTruthy();
    });
  });

  it('DEEPER_PROMPTS_TRIGGER count is prime (23)', () => {
    expect(DEEPER_PROMPTS_TRIGGER.length).toBe(23);
    expect(isPrime(DEEPER_PROMPTS_TRIGGER.length)).toBe(true);
  });

  it('DEEPER_PROMPTS_CHECKIN count is prime (11)', () => {
    expect(DEEPER_PROMPTS_CHECKIN.length).toBe(11);
    expect(isPrime(DEEPER_PROMPTS_CHECKIN.length)).toBe(true);
  });

  it('DEEPER_PROMPTS_BREATHWORK count is prime (7)', () => {
    expect(DEEPER_PROMPTS_BREATHWORK.length).toBe(7);
    expect(isPrime(DEEPER_PROMPTS_BREATHWORK.length)).toBe(true);
  });
});
