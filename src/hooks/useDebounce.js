import { useState, useEffect } from 'react';
import { DEBOUNCE_DELAY } from '../lib/constants';

/**
 * Debounce a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in ms
 */
export function useDebounce(value, delay = DEBOUNCE_DELAY) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
