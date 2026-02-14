import { describe, it, expect } from 'vitest';
import { isValidTriggerName } from '../validators';

describe('isValidTriggerName', () => {
  it('rejects null/undefined', () => {
    expect(isValidTriggerName(null)).toEqual({ valid: false, error: 'Name is required' });
    expect(isValidTriggerName(undefined)).toEqual({ valid: false, error: 'Name is required' });
  });

  it('rejects non-strings', () => {
    expect(isValidTriggerName(42)).toEqual({ valid: false, error: 'Name is required' });
    expect(isValidTriggerName(true)).toEqual({ valid: false, error: 'Name is required' });
  });

  it('rejects empty string', () => {
    expect(isValidTriggerName('')).toEqual({ valid: false, error: 'Name is required' });
  });

  it('rejects whitespace-only string', () => {
    expect(isValidTriggerName('   ')).toEqual({ valid: false, error: 'Name cannot be empty' });
  });

  it('rejects names shorter than 2 chars', () => {
    expect(isValidTriggerName('A')).toEqual({ valid: false, error: 'Name is too short' });
  });

  it('rejects names longer than 50 chars', () => {
    const long = 'A'.repeat(51);
    expect(isValidTriggerName(long)).toEqual({ valid: false, error: 'Name is too long' });
  });

  it('accepts valid trigger names', () => {
    expect(isValidTriggerName('Chewing')).toEqual({ valid: true, error: null });
    expect(isValidTriggerName('Lip smacking')).toEqual({ valid: true, error: null });
    expect(isValidTriggerName('AB')).toEqual({ valid: true, error: null }); // min length
  });

  it('accepts exactly 50 chars', () => {
    const exact = 'A'.repeat(50);
    expect(isValidTriggerName(exact)).toEqual({ valid: true, error: null });
  });

  it('trims before length check', () => {
    expect(isValidTriggerName('  AB  ')).toEqual({ valid: true, error: null });
    expect(isValidTriggerName('  A  ')).toEqual({ valid: false, error: 'Name is too short' });
  });
});
