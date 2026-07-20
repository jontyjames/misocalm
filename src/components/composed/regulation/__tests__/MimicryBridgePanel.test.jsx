import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MimicryBridgePanel from '../MimicryBridgePanel';

vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
  useTouchGlow: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
  useHaptic: () => ({ vibrate: vi.fn() }),
}));

describe('MimicryBridgePanel', () => {
  it('offers shame-free bridge actions', () => {
    render(<MimicryBridgePanel onOpen={vi.fn()} />);

    expect(screen.getByText('A control-seeking reflex, not a character flaw.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Left-right tapping/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /One slow exhale/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Name the room/i })).toBeInTheDocument();
  });

  it('opens the selected bridge practice', () => {
    const onOpen = vi.fn();
    render(<MimicryBridgePanel onOpen={onOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /Left-right tapping/i }));
    fireEvent.click(screen.getByRole('button', { name: /One slow exhale/i }));
    fireEvent.click(screen.getByRole('button', { name: /Toolkit/i }));

    expect(onOpen).toHaveBeenCalledWith('/tools/regulation/butterfly-tapping');
    expect(onOpen).toHaveBeenCalledWith('/tools/4?duration=quick');
    expect(onOpen).toHaveBeenCalledWith('/tools/regulation');
  });
});
