import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PracticeVoiceControls from '../PracticeVoiceControls';

const transcript = [
  { id: 'one', title: 'One', text: 'Start with one easy breath.', durationSec: 13 },
  { id: 'two', title: 'Two', text: 'Let your shoulders soften.', durationSec: 13 },
];

vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
  useTouchGlow: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
  useHaptic: () => ({ vibrate: vi.fn() }),
}));

describe('PracticeVoiceControls', () => {
  afterEach(() => {
    delete window.speechSynthesis;
    delete window.SpeechSynthesisUtterance;
  });

  it('keeps transcript fallback visible when browser speech is unavailable', () => {
    render(<PracticeVoiceControls transcript={transcript} />);

    expect(screen.getByText('Temporary guide voice')).toBeInTheDocument();
    expect(screen.getByText(/Voice playback is not available/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play guide/i })).toBeDisabled();
  });

  it('speaks the combined transcript from a user action', async () => {
    const speak = vi.fn();
    const cancel = vi.fn();
    window.speechSynthesis = { speak, cancel };
    window.SpeechSynthesisUtterance = vi.fn(function SpeechSynthesisUtterance(text) {
      this.text = text;
    });

    render(<PracticeVoiceControls transcript={transcript} />);
    const playButton = screen.getByRole('button', { name: /Play guide/i });

    await waitFor(() => expect(playButton).not.toBeDisabled());
    fireEvent.click(playButton);

    expect(cancel).toHaveBeenCalled();
    expect(speak).toHaveBeenCalledOnce();
    expect(speak.mock.calls[0][0].text).toContain('Start with one easy breath.');
  });
});
