import { describe, expect, it } from 'vitest';
import { FIRST_WELCOME_TIMING } from '../welcomeTiming';

const FIBONACCI_VALUES = [610, 987, 1597, 2584, 4181, 6765];

describe('welcomeTiming', () => {
  it('keeps the first welcome reveal quicker while staying Fibonacci-aligned', () => {
    expect(FIBONACCI_VALUES).toContain(FIRST_WELCOME_TIMING.introStartMs);
    expect(FIBONACCI_VALUES).toContain(FIRST_WELCOME_TIMING.revealMs);
    expect(FIRST_WELCOME_TIMING.introStartMs).toBe(610);
    expect(FIRST_WELCOME_TIMING.revealMs).toBe(4181);
    expect(FIRST_WELCOME_TIMING.revealMs).toBeLessThan(6765);
  });
});
