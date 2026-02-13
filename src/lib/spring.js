/**
 * Spring Physics — CSS-only spring approximation
 * Uses cubic-bezier curves for press → overshoot → settle
 * No JS animation library needed
 */

// Spring press: quick snap to 0.97
export const SPRING_PRESS = {
  transform: 'scale(0.97)',
  transition: 'transform 89ms cubic-bezier(0.2, 0, 0.4, 1)',
};

// Spring release: overshoot to 1.02 then settle to 1.0
export const SPRING_RELEASE = {
  transform: 'scale(1)',
  transition: 'transform 233ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// Subtle spring for cards (less dramatic)
export const SPRING_PRESS_SUBTLE = {
  transform: 'scale(0.98)',
  transition: 'transform 89ms cubic-bezier(0.2, 0, 0.4, 1)',
};

export const SPRING_RELEASE_SUBTLE = {
  transform: 'scale(1)',
  transition: 'transform 233ms cubic-bezier(0.34, 1.4, 0.64, 1)',
};

// CSS class equivalents for use in className strings
export const springClasses = {
  button: 'transition-transform duration-[89ms] active:scale-[0.97]',
  card: 'transition-transform duration-[89ms] active:scale-[0.98]',
};
