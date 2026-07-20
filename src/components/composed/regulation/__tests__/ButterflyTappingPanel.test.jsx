import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ButterflyTappingPanel from '../ButterflyTappingPanel';

vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
  useTouchGlow: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
  useHaptic: () => ({ vibrate: vi.fn() }),
}));

describe('ButterflyTappingPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('starts paused with a clear bilateral tapping cue', () => {
    render(<ButterflyTappingPanel />);

    expect(screen.getByText('Tap left, then right. Slow enough that your body can follow.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Rhythm paused');
    expect(screen.getByRole('button', { name: /Start rhythm/i })).toBeInTheDocument();
  });

  it('alternates left and right on the Fibonacci breathe cadence', () => {
    render(<ButterflyTappingPanel />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Start rhythm/i }));
    });

    expect(screen.getByRole('status')).toHaveTextContent('left tap');

    act(() => {
      vi.advanceTimersByTime(987);
    });

    expect(screen.getByRole('status')).toHaveTextContent('right tap');

    act(() => {
      vi.advanceTimersByTime(987);
    });

    expect(screen.getByRole('status')).toHaveTextContent('left tap');
  });

  it('pauses the rhythm without completing the practice', () => {
    const onComplete = vi.fn();
    render(<ButterflyTappingPanel onComplete={onComplete} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Start rhythm/i }));
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Pause rhythm/i }));
    });

    expect(screen.getByRole('status')).toHaveTextContent('Rhythm paused');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('completes only when the user chooses to complete tapping', () => {
    const onComplete = vi.fn();
    render(<ButterflyTappingPanel onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /Complete tapping/i }));

    expect(onComplete).toHaveBeenCalledOnce();
  });
});
