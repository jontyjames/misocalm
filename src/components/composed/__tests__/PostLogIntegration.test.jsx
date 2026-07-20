import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostLogIntegration from '../PostLogIntegration';

const mockPush = vi.hoisted(() => vi.fn());
const searchParamsState = vi.hoisted(() => ({ value: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => searchParamsState.value,
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

vi.mock('../StarDissolve', () => ({
  default: () => null,
}));

describe('PostLogIntegration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPush.mockClear();
    searchParamsState.value = new URLSearchParams();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('treats regulation check-ins as completed practice flow', async () => {
    searchParamsState.value = new URLSearchParams('type=check_in&from=regulation&entry=entry-1');

    render(<PostLogIntegration />);

    for (let i = 0; i < 40; i += 1) {
      await act(async () => {
        vi.advanceTimersByTime(34);
      });
    }

    await act(async () => {
      vi.advanceTimersByTime(987);
    });

    expect(screen.getByRole('button', { name: /Return to sanctuary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go a little deeper/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to practices/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Go a little deeper/i }));
    expect(mockPush).toHaveBeenCalledWith('/journal/deeper?entry=entry-1&type=check_in&from=regulation');

    fireEvent.click(screen.getByRole('button', { name: /Return to practices/i }));
    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });

  it('keeps experience check-ins launched from regulation returning to the toolkit', async () => {
    searchParamsState.value = new URLSearchParams('type=check_in&from=grounding&origin=regulation&entry=entry-1');

    render(<PostLogIntegration />);

    for (let i = 0; i < 40; i += 1) {
      await act(async () => {
        vi.advanceTimersByTime(34);
      });
    }

    await act(async () => {
      vi.advanceTimersByTime(987);
    });

    fireEvent.click(screen.getByRole('button', { name: /Go a little deeper/i }));
    expect(mockPush).toHaveBeenCalledWith('/journal/deeper?entry=entry-1&type=check_in&from=grounding&origin=regulation');

    fireEvent.click(screen.getByRole('button', { name: /Return to practices/i }));
    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });
});
