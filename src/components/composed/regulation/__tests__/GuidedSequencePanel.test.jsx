import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GuidedSequencePanel from '../GuidedSequencePanel';
import { getRegulationPractice } from '@/lib/regulationToolkitData';

vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
  useTouchGlow: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
  useHaptic: () => ({ vibrate: vi.fn() }),
}));

describe('GuidedSequencePanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders body scan phases without requiring audio', () => {
    render(<GuidedSequencePanel practice={getRegulationPractice('body-scan')} />);

    expect(screen.getByText('Feet and Ground / phase 1 of 5')).toBeInTheDocument();
    expect(screen.getByText('233s')).toBeInTheDocument();
  });

  it('advances through timed guide phases on Fibonacci cadence', () => {
    render(<GuidedSequencePanel practice={getRegulationPractice('progressive-muscle-relaxation')} />);

    fireEvent.click(screen.getByRole('button', { name: /Begin/i }));

    act(() => {
      vi.advanceTimersByTime(987 * 36);
    });

    expect(screen.getByText('Arms and Shoulders / phase 2 of 5')).toBeInTheDocument();
  });

  it('waits for user confirmation before completing the guided practice', () => {
    const onComplete = vi.fn();
    render(<GuidedSequencePanel practice={getRegulationPractice('body-scan')} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /Begin/i }));

    act(() => {
      vi.advanceTimersByTime(987 * 237);
    });

    expect(screen.getByText('Guided sequence complete.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Complete practice/i }));

    expect(onComplete).toHaveBeenCalledOnce();
  });
});
