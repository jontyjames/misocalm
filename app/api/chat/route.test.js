import { describe, expect, it, vi } from 'vitest';
import { buildMisoSystemMessage, getMisoModeInstruction } from './route';

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn(function AnthropicMock() {
    this.messages = { create: vi.fn() };
  }),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: vi.fn() },
  })),
}));

describe('MisoAI mode prompt contract', () => {
  it('selects triggered-now support mode', () => {
    expect(getMisoModeInstruction('triggered_now')).toContain('Triggered now');
    expect(getMisoModeInstruction('triggered_now')).toContain('one body-based practice');
  });

  it('selects preparation support mode', () => {
    expect(getMisoModeInstruction('prepare')).toContain('Preparing for a sound');
    expect(getMisoModeInstruction('prepare')).toContain('exit plan');
  });

  it('selects processing support mode', () => {
    expect(getMisoModeInstruction('process')).toContain('Processing afterward');
    expect(getMisoModeInstruction('process')).toContain('journaling');
  });

  it('falls back to triggered-now mode for invalid values', () => {
    expect(getMisoModeInstruction('unknown')).toBe(getMisoModeInstruction('triggered_now'));
  });

  it('builds the system message with mode and profile context', () => {
    const systemMessage = buildMisoSystemMessage({
      misoMode: 'prepare',
      userContext: 'Severity level: 7/10\n',
    });

    expect(systemMessage).toContain('You are a compassionate AI support companion');
    expect(systemMessage).toContain('Mode: Preparing for a sound');
    expect(systemMessage).toContain("User's profile:");
    expect(systemMessage).toContain('Severity level: 7/10');
  });

  it('keeps clinical safety boundaries inside the system message', () => {
    const systemMessage = buildMisoSystemMessage({ misoMode: 'triggered_now' });

    [
      'Never suggest "just ignoring"',
      "they're overreacting",
      'Do not diagnose',
      'promise cures',
      'exposure plans',
      'professional support',
    ].forEach((phrase) => {
      expect(systemMessage).toContain(phrase);
    });
  });

  it('keeps MisoAI anchored to app-native regulation actions', () => {
    const systemMessage = buildMisoSystemMessage({ misoMode: 'process' });

    [
      'Find My Calm',
      'Regulation Toolkit',
      'Emergency Protocol',
      'Butterfly Tapping',
      'Body Scan',
    ].forEach((action) => {
      expect(systemMessage).toContain(action);
    });
  });

  it('omits the profile heading when no user context is supplied', () => {
    const systemMessage = buildMisoSystemMessage({ misoMode: 'triggered_now' });

    expect(systemMessage).not.toContain("User's profile:");
    expect(systemMessage).toContain('Mode: Triggered now');
  });
});
