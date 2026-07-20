import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PracticeAssetPlayer from '../PracticeAssetPlayer';
import { AUDIO_ASSET_TYPES } from '@/lib/audioCatalog';

vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
  useTouchGlow: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
  useHaptic: () => ({ vibrate: vi.fn() }),
}));

describe('PracticeAssetPlayer', () => {
  it('plays a placeholder asset from a user action', async () => {
    const play = vi.spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    const pause = vi.spyOn(window.HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {});

    render(
      <PracticeAssetPlayer
        asset={{
          title: 'Soft brown noise',
          source: '/audio/soundscapes/brown-noise-soft/v1.wav',
          type: AUDIO_ASSET_TYPES.SOUND_BED,
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Play Soft brown noise/i }));

    expect(play).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.getByRole('button', { name: /Pause Soft brown noise/i })).toBeInTheDocument());
    play.mockRestore();
    pause.mockRestore();
  });
});
