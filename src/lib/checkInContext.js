import { ROUTES } from '@/lib/constants';

export const CHECK_IN_SOURCE = {
  BREATHWORK: 'breathwork',
  REGULATION: 'regulation',
  GROUNDING: 'grounding',
  FOCUS: 'focus',
  MANDALA: 'mandala',
  IMPERMANENCE: 'impermanence',
  PULSE: 'pulse',
  ALIVE: 'alive',
};

export const CHECK_IN_ORIGIN = {
  REGULATION: 'regulation',
};

const PRACTICE_SOURCES = new Set(Object.values(CHECK_IN_SOURCE));
const CHECK_IN_ORIGINS = new Set(Object.values(CHECK_IN_ORIGIN));

export function normalizeCheckInSource(source) {
  if (source === true) return CHECK_IN_SOURCE.BREATHWORK;
  if (typeof source !== 'string') return null;
  return PRACTICE_SOURCES.has(source) ? source : null;
}

export function normalizeCheckInOrigin(origin) {
  if (typeof origin !== 'string') return null;
  return CHECK_IN_ORIGINS.has(origin) ? origin : null;
}

export function getCheckInOriginFromRouteContext(searchParams) {
  return searchParams?.get('from') === CHECK_IN_ORIGIN.REGULATION ? CHECK_IN_ORIGIN.REGULATION : null;
}

export function getCheckInBackRoute(source, origin = null) {
  const checkInSource = normalizeCheckInSource(source);
  const checkInOrigin = normalizeCheckInOrigin(origin);

  if (checkInOrigin === CHECK_IN_ORIGIN.REGULATION || checkInSource === CHECK_IN_SOURCE.REGULATION) {
    return ROUTES.REGULATION_TOOLKIT;
  }

  return checkInSource ? ROUTES.DASHBOARD : ROUTES.JOURNAL;
}

export function buildCheckInRoute(source, origin = null) {
  const checkInSource = normalizeCheckInSource(source);
  const checkInOrigin = normalizeCheckInOrigin(origin);
  const params = new URLSearchParams();

  if (checkInSource) params.set('from', checkInSource);
  if (checkInOrigin && checkInOrigin !== checkInSource) params.set('origin', checkInOrigin);

  const query = params.toString();
  return query ? `${ROUTES.CHECK_IN}?${query}` : ROUTES.CHECK_IN;
}

export function buildCheckInSuccessRoute({ source, origin = null, entryId }) {
  const params = new URLSearchParams({ type: 'check_in' });
  const checkInSource = normalizeCheckInSource(source);
  const checkInOrigin = normalizeCheckInOrigin(origin);

  if (checkInSource) params.set('from', checkInSource);
  if (checkInOrigin && checkInOrigin !== checkInSource) params.set('origin', checkInOrigin);
  if (entryId) params.set('entry', entryId);

  return `${ROUTES.LOG_SUCCESS}?${params.toString()}`;
}
