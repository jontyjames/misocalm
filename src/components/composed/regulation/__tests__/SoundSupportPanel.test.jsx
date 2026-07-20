import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SoundSupportPanel from '../SoundSupportPanel';

vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
  useTouchGlow: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
  useHaptic: () => ({ vibrate: vi.fn() }),
}));

describe('SoundSupportPanel', () => {
  it('renders the three sound support modes', () => {
    render(<SoundSupportPanel />);

    expect(screen.getByRole('button', { name: /Public Masking/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Recovery Cocoon/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sleep Ramp/i })).toBeInTheDocument();
  });

  it('updates the selected mode guidance', () => {
    render(<SoundSupportPanel />);

    fireEvent.click(screen.getByRole('button', { name: /Sleep Ramp/i }));

    expect(screen.getAllByText('Set the sound before you feel desperate for it.')).toHaveLength(2);
  });

  it('updates texture and volume safety guidance', () => {
    render(<SoundSupportPanel />);

    fireEvent.click(screen.getByRole('button', { name: /Quiet/i }));
    fireEvent.change(screen.getByRole('slider', { name: /Support volume/i }), {
      target: { value: '11' },
    });

    expect(screen.getByText('11/13')).toBeInTheDocument();
    expect(screen.getByText('High support. Check hearing safety.')).toBeInTheDocument();
    expect(screen.getByText('Current plan: Quiet as a high-support layer with a hearing safety check.')).toBeInTheDocument();
  });
});
