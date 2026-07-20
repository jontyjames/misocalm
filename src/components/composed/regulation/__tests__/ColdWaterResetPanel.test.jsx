import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ColdWaterResetPanel from '../ColdWaterResetPanel';

vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
  useTouchGlow: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
  useHaptic: () => ({ vibrate: vi.fn() }),
}));

describe('ColdWaterResetPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('keeps begin disabled until all safety checks are confirmed', () => {
    render(<ColdWaterResetPanel />);

    const beginButton = screen.getByRole('button', { name: /Begin/i });
    expect(beginButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /My body has enough capacity today/i }));
    fireEvent.click(screen.getByRole('button', { name: /I can keep this cool/i }));
    fireEvent.click(screen.getByRole('button', { name: /I can warm myself afterwards/i }));

    expect(beginButton).not.toBeDisabled();
    expect(screen.getByText('Ready for a small cool-water reset.')).toBeInTheDocument();
  });

  it('switches reset method guidance', () => {
    render(<ColdWaterResetPanel />);

    fireEvent.click(screen.getByRole('button', { name: /Cool Cloth/i }));

    expect(screen.getAllByText('A gentle cloth on neck, cheeks, or hands.')).toHaveLength(2);
  });

  it('completes the cool-water reset on a Fibonacci cadence', () => {
    const onComplete = vi.fn();
    render(<ColdWaterResetPanel onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /My body has enough capacity today/i }));
    fireEvent.click(screen.getByRole('button', { name: /I can keep this cool/i }));
    fireEvent.click(screen.getByRole('button', { name: /I can warm myself afterwards/i }));
    fireEvent.click(screen.getByRole('button', { name: /Begin/i }));

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(987 * 35);
    });

    expect(screen.getByText('Warm yourself now and let the reset finish gently.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Complete reset/i }));

    expect(onComplete).toHaveBeenCalledOnce();
  });
});
