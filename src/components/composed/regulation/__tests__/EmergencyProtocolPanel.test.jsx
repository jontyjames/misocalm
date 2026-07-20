import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EmergencyProtocolPanel from '../EmergencyProtocolPanel';

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useReducedMotion: () => false,
    useTouchGlow: () => ({
      glowStyle: null,
      handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
    }),
    useHaptic: () => ({ vibrate: vi.fn() }),
  };
});

describe('EmergencyProtocolPanel', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the first emergency protocol step', () => {
    render(<EmergencyProtocolPanel onOpen={vi.fn()} />);

    expect(screen.getByText('Leave if safe')).toBeInTheDocument();
    expect(screen.getByText('1/5')).toBeInTheDocument();
    expect(screen.getByText('I need a short break.')).toBeInTheDocument();
  });

  it('advances through protocol steps', () => {
    render(<EmergencyProtocolPanel onOpen={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    expect(screen.getByText('Use one phrase')).toBeInTheDocument();
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('only completes from the final protocol step', () => {
    const onComplete = vi.fn();
    render(<EmergencyProtocolPanel onOpen={vi.fn()} onComplete={onComplete} />);

    expect(screen.queryByRole('button', { name: /Complete protocol/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Go to Recover before explaining/i }));
    fireEvent.click(screen.getByRole('button', { name: /Complete protocol/i }));

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('opens recovery routes from quick actions', () => {
    const onOpen = vi.fn();
    render(<EmergencyProtocolPanel onOpen={onOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /Fast breath/i }));
    fireEvent.click(screen.getByRole('button', { name: /Grounding/i }));

    expect(onOpen).toHaveBeenCalledWith('/tools/4?duration=quick');
    expect(onOpen).toHaveBeenCalledWith('/tools/experiences/grounding');
  });

  it('edits and restores starter phrases', () => {
    render(<EmergencyProtocolPanel onOpen={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Emergency phrase 1'), {
      target: { value: 'I need quiet now.' },
    });

    expect(screen.getByText('I need quiet now.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Restore starter phrases/i }));

    expect(screen.getByText('I need a short break.')).toBeInTheDocument();
  });
});
