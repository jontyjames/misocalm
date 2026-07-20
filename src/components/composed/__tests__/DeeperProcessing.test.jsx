import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DeeperProcessing from '../DeeperProcessing';

const mockPush = vi.hoisted(() => vi.fn());
const searchParamsState = vi.hoisted(() => ({ value: new URLSearchParams() }));
const source = readFileSync(
  join(process.cwd(), 'src/components/composed/DeeperProcessing.jsx'),
  'utf8'
);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => searchParamsState.value,
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1' } }),
}));

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useReducedMotion: () => false,
  };
});

vi.mock('@/lib/dateUtils', () => ({
  getDayOfYear: () => 0,
}));

describe('DeeperProcessing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPush.mockClear();
    searchParamsState.value = new URLSearchParams();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('returns regulation deeper flow to the regulation toolkit', async () => {
    searchParamsState.value = new URLSearchParams('entry=entry-1&type=check_in&from=regulation');

    render(<DeeperProcessing />);

    expect(screen.getByText('Let the tool settle. Notice what your body learned.')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /That's enough for now/i }));
    });

    for (let i = 0; i < 50; i += 1) {
      await act(async () => {
        vi.advanceTimersByTime(34);
      });
    }

    await act(async () => {
      vi.advanceTimersByTime(1597);
    });

    fireEvent.click(screen.getByRole('button', { name: /Return to practices/i }));

    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });

  it('preserves regulation source when the top back action returns to saved check-in', () => {
    searchParamsState.value = new URLSearchParams('entry=entry-1&type=check_in&from=regulation');

    render(<DeeperProcessing />);

    fireEvent.click(screen.getByRole('button', { name: /Go back/i }));

    expect(mockPush).toHaveBeenCalledWith('/journal/saved?type=check_in&from=regulation&entry=entry-1');
  });

  it('keeps experience deeper flows launched from regulation returning to the toolkit', async () => {
    searchParamsState.value = new URLSearchParams('entry=entry-1&type=check_in&from=grounding&origin=regulation');

    render(<DeeperProcessing />);

    expect(screen.getByText('Let the grounding settle. Notice what your senses found.')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /That's enough for now/i }));
    });

    for (let i = 0; i < 50; i += 1) {
      await act(async () => {
        vi.advanceTimersByTime(34);
      });
    }

    await act(async () => {
      vi.advanceTimersByTime(1597);
    });

    fireEvent.click(screen.getByRole('button', { name: /Return to practices/i }));

    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });

  it('preserves regulation origin when the top back action returns to saved check-in', () => {
    searchParamsState.value = new URLSearchParams('entry=entry-1&type=check_in&from=grounding&origin=regulation');

    render(<DeeperProcessing />);

    fireEvent.click(screen.getByRole('button', { name: /Go back/i }));

    expect(mockPush).toHaveBeenCalledWith('/journal/saved?type=check_in&from=grounding&origin=regulation&entry=entry-1');
  });

  it('uses calm saving copy for deeper reflection actions', () => {
    render(<DeeperProcessing />);

    expect(screen.getByRole('button', { name: /That's enough for now/i }).parentElement)
      .toHaveAttribute('aria-live', 'polite');
    expect(source).toContain('Saving gently...');
    expect(source).not.toContain("'Saving...'");
  });
});
