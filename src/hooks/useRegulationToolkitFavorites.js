import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getRegulationPractice } from '@/lib/regulationToolkitData';

const STORAGE_KEY = 'misocalm-regulation-toolkit';
const MAX_FAVORITES = 5;

export function useRegulationToolkitFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorage(STORAGE_KEY, []);

  const favorites = useMemo(() => (
    favoriteIds.map(getRegulationPractice).filter(Boolean)
  ), [favoriteIds]);

  const isFavorite = useCallback((practiceId) => (
    favoriteIds.includes(practiceId)
  ), [favoriteIds]);

  const toggleFavorite = useCallback((practiceId) => {
    setFavoriteIds((current) => {
      if (current.includes(practiceId)) {
        return current.filter((id) => id !== practiceId);
      }
      return [...current, practiceId].slice(-MAX_FAVORITES);
    });
  }, [setFavoriteIds]);

  return {
    favoriteIds,
    favorites,
    isFavorite,
    maxFavorites: MAX_FAVORITES,
    toggleFavorite,
  };
}
