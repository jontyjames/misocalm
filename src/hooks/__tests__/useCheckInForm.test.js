import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHookWithProviders } from '@/test/test-utils';
import { useCheckInForm } from '../useCheckInForm';

const mockPush = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/services', () => ({
  triggerLogService: {
    createCheckIn: vi.fn().mockResolvedValue({ data: [{ id: 'check-in-1' }], error: null }),
  },
}));

vi.mock('@/lib/analytics', () => ({
  track: vi.fn(),
  EVENTS: { CHECK_IN_LOGGED: 'CHECK_IN_LOGGED' },
}));

describe('useCheckInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves regulation source context and routes to sourced success', async () => {
    const { triggerLogService } = await import('@/services');
    const { result } = renderHookWithProviders(() => useCheckInForm('user-1', 'regulation'));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(triggerLogService.createCheckIn).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'user-1',
      source_practice: 'regulation',
    }));
    expect(mockPush).toHaveBeenCalledWith('/journal/saved?type=check_in&from=regulation&entry=check-in-1');
  });

  it('preserves regulation origin for experience check-ins launched from the toolkit', async () => {
    const { triggerLogService } = await import('@/services');
    const { result } = renderHookWithProviders(() => useCheckInForm('user-1', 'grounding', 'regulation'));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(triggerLogService.createCheckIn).toHaveBeenCalledWith(expect.objectContaining({
      user_id: 'user-1',
      source_practice: 'grounding',
    }));
    expect(mockPush).toHaveBeenCalledWith('/journal/saved?type=check_in&from=grounding&origin=regulation&entry=check-in-1');
  });

  it('keeps standalone check-ins unsourced', async () => {
    const { triggerLogService } = await import('@/services');
    const { result } = renderHookWithProviders(() => useCheckInForm('user-1'));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(triggerLogService.createCheckIn).toHaveBeenCalledWith(expect.not.objectContaining({
      source_practice: expect.any(String),
    }));
    expect(mockPush).toHaveBeenCalledWith('/journal/saved?type=check_in&entry=check-in-1');
  });
});
