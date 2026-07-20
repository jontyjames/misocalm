import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderHookWithProviders } from '@/test/test-utils';
import { useRegulationToolkitFavorites } from '../useRegulationToolkitFavorites';

describe('useRegulationToolkitFavorites', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts empty', () => {
    const { result } = renderHookWithProviders(() => useRegulationToolkitFavorites());

    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.favorites).toEqual([]);
  });

  it('adds and removes a practice', () => {
    const { result } = renderHookWithProviders(() => useRegulationToolkitFavorites());

    act(() => result.current.toggleFavorite('butterfly-tapping'));
    expect(result.current.favoriteIds).toEqual(['butterfly-tapping']);
    expect(result.current.favorites[0].title).toBe('Butterfly Tapping');

    act(() => result.current.toggleFavorite('butterfly-tapping'));
    expect(result.current.favoriteIds).toEqual([]);
  });

  it('keeps the five most recent practices', () => {
    const { result } = renderHookWithProviders(() => useRegulationToolkitFavorites());

    act(() => {
      [
        'physiological-sigh',
        'grounding-54321',
        'butterfly-tapping',
        'body-scan',
        'movement-reset',
        'sound-support',
      ].forEach(result.current.toggleFavorite);
    });

    expect(result.current.favoriteIds).toEqual([
      'grounding-54321',
      'butterfly-tapping',
      'body-scan',
      'movement-reset',
      'sound-support',
    ]);
  });
});
