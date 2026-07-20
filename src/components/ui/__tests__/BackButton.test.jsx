import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BackButton from '../BackButton';

const mockPush = vi.hoisted(() => vi.fn());
const mockBack = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe('BackButton', () => {
  it('returns to public home by default instead of browser history', () => {
    render(<BackButton />);

    fireEvent.click(screen.getByRole('button', { name: /go back/i }));

    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('uses an explicit destination when provided', () => {
    render(<BackButton href="/dashboard" />);

    fireEvent.click(screen.getByRole('button', { name: /go back/i }));

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockBack).not.toHaveBeenCalled();
  });
});
