import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogForm } from '../useLogForm';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/services', () => ({
  triggerLogService: {
    create: vi.fn().mockResolvedValue({ data: [{ id: 'test-id' }], error: null }),
  },
}));

vi.mock('@/lib/analytics', () => ({
  track: vi.fn(),
  EVENTS: { TRIGGER_LOGGED: 'TRIGGER_LOGGED' },
}));

describe('useLogForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initialises with empty triggerEntries', () => {
    const { result } = renderHook(() => useLogForm('user-1'));
    expect(result.current.triggerEntries).toEqual({});
  });

  it('initialises environment as null', () => {
    const { result } = renderHook(() => useLogForm('user-1'));
    expect(result.current.environment).toBeNull();
  });

  describe('toggleTrigger', () => {
    it('adds trigger with default intensity 5', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
      });

      expect(result.current.triggerEntries).toEqual({ Chewing: 5 });
    });

    it('removes trigger when toggled again', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
      });
      act(() => {
        result.current.toggleTrigger('Chewing');
      });

      expect(result.current.triggerEntries).toEqual({});
    });

    it('supports multiple triggers simultaneously', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
      });
      act(() => {
        result.current.toggleTrigger('Sniffing');
      });

      expect(result.current.triggerEntries).toEqual({ Chewing: 5, Sniffing: 5 });
    });
  });

  describe('setTriggerIntensity', () => {
    it('updates intensity for a specific trigger', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
      });
      act(() => {
        result.current.setTriggerIntensity('Chewing', 7);
      });

      expect(result.current.triggerEntries).toEqual({ Chewing: 7 });
    });

    it('does not affect other triggers', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
        result.current.toggleTrigger('Sniffing');
      });
      act(() => {
        result.current.setTriggerIntensity('Chewing', 8);
      });

      expect(result.current.triggerEntries.Chewing).toBe(8);
      expect(result.current.triggerEntries.Sniffing).toBe(5);
    });

    it('accepts boundary values 0 and 10', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
      });
      act(() => {
        result.current.setTriggerIntensity('Chewing', 0);
      });
      expect(result.current.triggerEntries.Chewing).toBe(0);

      act(() => {
        result.current.setTriggerIntensity('Chewing', 10);
      });
      expect(result.current.triggerEntries.Chewing).toBe(10);
    });
  });

  describe('environment', () => {
    it('sets environment value', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.setEnvironment('home');
      });

      expect(result.current.environment).toBe('home');
    });

    it('can change environment', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.setEnvironment('home');
      });
      act(() => {
        result.current.setEnvironment('work');
      });

      expect(result.current.environment).toBe('work');
    });
  });

  describe('handleSave', () => {
    it('does not save when no triggers selected', async () => {
      const { triggerLogService } = await import('@/services');
      const { result } = renderHook(() => useLogForm('user-1'));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(triggerLogService.create).not.toHaveBeenCalled();
    });

    it('shows crisis modal when any trigger intensity >= 9', async () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
        result.current.setTriggerIntensity('Chewing', 9);
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(result.current.showCrisisModal).toBe(true);
    });

    it('does not show crisis modal when all intensities < 9', async () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
        result.current.setTriggerIntensity('Chewing', 8);
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(result.current.showCrisisModal).toBe(false);
    });

    it('saves with both old and new format', async () => {
      const { triggerLogService } = await import('@/services');
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleTrigger('Chewing');
        result.current.setTriggerIntensity('Chewing', 7);
        result.current.toggleTrigger('Sniffing');
        result.current.setTriggerIntensity('Sniffing', 3);
        result.current.setEnvironment('home');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      const call = triggerLogService.create.mock.calls[0][0];
      // Old format
      expect(call.triggers).toEqual(['Chewing', 'Sniffing']);
      expect(call.intensity).toBe(5); // avg of 7 and 3
      // New format
      expect(call.trigger_intensities).toEqual({ Chewing: 7, Sniffing: 3 });
      expect(call.environment).toBe('home');
      // Deprecated
      expect(call.source).toBeNull();
    });
  });

  describe('toggleBodyResponse', () => {
    it('adds body response', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleBodyResponse('Jaw tension');
      });

      expect(result.current.bodyResponses).toEqual(['Jaw tension']);
    });

    it('removes body response when toggled again', () => {
      const { result } = renderHook(() => useLogForm('user-1'));

      act(() => {
        result.current.toggleBodyResponse('Jaw tension');
      });
      act(() => {
        result.current.toggleBodyResponse('Jaw tension');
      });

      expect(result.current.bodyResponses).toEqual([]);
    });
  });
});
