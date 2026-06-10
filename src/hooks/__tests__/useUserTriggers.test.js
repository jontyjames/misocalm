import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import { useUserTriggers } from '../useUserTriggers';
import { DEFAULT_TRIGGERS } from '@/lib/constants';
import { renderHookWithProviders } from '@/test/test-utils';

// Mock services
const mockGetUserTriggers = vi.fn();
const mockAddCustomTrigger = vi.fn();
const mockGetStats = vi.fn();

vi.mock('@/services', () => ({
  userTriggerService: {
    getUserTriggers: (...args) => mockGetUserTriggers(...args),
    addCustomTrigger: (...args) => mockAddCustomTrigger(...args),
  },
  triggerLogService: {
    getStats: (...args) => mockGetStats(...args),
  },
}));

// Mock localStorage
const mockStorage = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
  removeItem: vi.fn((key) => { delete mockStorage[key]; }),
});

describe('useUserTriggers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    mockGetStats.mockResolvedValue({ stats: null, error: null });
  });

  describe('loading state', () => {
    it('returns DEFAULT_TRIGGERS with isUsingDefaults:true when no userId', async () => {
      mockGetUserTriggers.mockResolvedValue({ data: null, error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers(null));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.triggers).toEqual(DEFAULT_TRIGGERS);
      expect(result.current.isUsingDefaults).toBe(true);
    });

    it('returns DEFAULT_TRIGGERS with isUsingDefaults:true when DB returns empty', async () => {
      mockGetUserTriggers.mockResolvedValue({ data: [], error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.triggers).toEqual(DEFAULT_TRIGGERS);
      expect(result.current.isUsingDefaults).toBe(true);
    });

    it('returns DB triggers with isUsingDefaults:false when available', async () => {
      mockGetUserTriggers.mockResolvedValue({
        data: [{ name: 'Chewing' }, { name: 'Sniffing' }],
        error: null,
      });
      mockGetStats.mockResolvedValue({ stats: { triggerCounts: {} }, error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.isUsingDefaults).toBe(false);
      });

      expect(result.current.triggers).toEqual(['Chewing', 'Sniffing']);
      expect(result.current.isUsingDefaults).toBe(false);
    });
  });

  describe('sorting by frequency', () => {
    it('sorts by frequency when stats available', async () => {
      mockGetUserTriggers.mockResolvedValue({
        data: [{ name: 'Chewing' }, { name: 'Sniffing' }, { name: 'Typing' }],
        error: null,
      });
      mockGetStats.mockResolvedValue({
        stats: { triggerCounts: { Sniffing: 10, Typing: 5, Chewing: 2 } },
        error: null,
      });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.triggers).toEqual(['Sniffing', 'Typing', 'Chewing']);
      });
    });

    it('skips stats fetch for new users (defaults)', async () => {
      mockGetUserTriggers.mockResolvedValue({ data: [], error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetStats).not.toHaveBeenCalled();
    });
  });

  describe('addCustomTrigger', () => {
    it('adds trigger optimistically', async () => {
      mockGetUserTriggers.mockResolvedValue({
        data: [{ name: 'Chewing' }],
        error: null,
      });
      mockGetStats.mockResolvedValue({ stats: { triggerCounts: {} }, error: null });
      mockAddCustomTrigger.mockResolvedValue({ data: { id: 'new-id' }, error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        const res = await result.current.addCustomTrigger('Whistling');
        expect(res.error).toBeNull();
      });

      expect(result.current.triggers).toContain('Whistling');
    });

    it('rolls back on DB failure', async () => {
      mockGetUserTriggers.mockResolvedValue({
        data: [{ name: 'Chewing' }],
        error: null,
      });
      mockGetStats.mockResolvedValue({ stats: { triggerCounts: {} }, error: null });
      mockAddCustomTrigger.mockResolvedValue({ error: 'DB error' });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        const res = await result.current.addCustomTrigger('Whistling');
        expect(res.error).toBe('Could not save. You can try again when ready.');
      });

      expect(result.current.triggers).not.toContain('Whistling');
    });

    it('rejects duplicates', async () => {
      mockGetUserTriggers.mockResolvedValue({
        data: [{ name: 'Chewing' }],
        error: null,
      });
      mockGetStats.mockResolvedValue({ stats: { triggerCounts: {} }, error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        const res = await result.current.addCustomTrigger('Chewing');
        expect(res.error).toBe('Already in your list');
      });
    });

    it('validates name length (too short)', async () => {
      mockGetUserTriggers.mockResolvedValue({ data: [], error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        const res = await result.current.addCustomTrigger('A');
        expect(res.error).toBe('Name is too short');
      });
    });

    it('validates name length (too long)', async () => {
      mockGetUserTriggers.mockResolvedValue({ data: [], error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        const res = await result.current.addCustomTrigger('A'.repeat(51));
        expect(res.error).toBe('Name is too long');
      });
    });

    it('validates empty name', async () => {
      mockGetUserTriggers.mockResolvedValue({ data: [], error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        const res = await result.current.addCustomTrigger('');
        expect(res.error).toBe('Name is required');
      });
    });
  });

  describe('refresh', () => {
    it('re-fetches from DB', async () => {
      mockGetUserTriggers
        .mockResolvedValueOnce({ data: [{ name: 'Chewing' }], error: null })
        .mockResolvedValueOnce({ data: [{ name: 'Chewing' }, { name: 'Sniffing' }], error: null });
      mockGetStats.mockResolvedValue({ stats: { triggerCounts: {} }, error: null });

      const { result } = renderHookWithProviders(() => useUserTriggers('user-1'));

      await waitFor(() => {
        expect(result.current.triggers).toEqual(['Chewing']);
      });

      expect(result.current.triggers).toEqual(['Chewing']);

      await act(async () => {
        await result.current.refresh();
      });

      await waitFor(() => {
        expect(result.current.triggers).toEqual(['Chewing', 'Sniffing']);
      });
    });
  });
});
