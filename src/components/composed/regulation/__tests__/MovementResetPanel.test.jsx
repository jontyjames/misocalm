import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MovementResetPanel from '../MovementResetPanel';

vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
  useTouchGlow: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
  useHaptic: () => ({ vibrate: vi.fn() }),
}));

describe('MovementResetPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders the three movement reset options', () => {
    render(<MovementResetPanel />);

    expect(screen.getByRole('button', { name: /Shake/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Walk/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Stretch/i })).toBeInTheDocument();
  });

  it('switches to the selected flow', () => {
    render(<MovementResetPanel />);

    fireEvent.click(screen.getByRole('button', { name: /Walk/i }));

    expect(screen.getByText('Choose a clear path before you begin.')).toBeInTheDocument();
    expect(screen.getByText('55s')).toBeInTheDocument();
  });

  it('advances and completes the selected flow on Fibonacci cadence', () => {
    const onComplete = vi.fn();
    render(<MovementResetPanel onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /Begin/i }));

    act(() => {
      vi.advanceTimersByTime(987 * 7);
    });

    expect(screen.getByText('Let your hands shake without forcing it.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(987 * 34);
    });

    expect(screen.getByText('Movement complete. Let your body settle.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Complete movement/i }));

    expect(onComplete).toHaveBeenCalledOnce();
  });
});
