import { describe, expect, it } from 'vitest';
import {
  CHECK_IN_ORIGIN,
  CHECK_IN_SOURCE,
  buildCheckInRoute,
  buildCheckInSuccessRoute,
  getCheckInOriginFromRouteContext,
  getCheckInBackRoute,
  normalizeCheckInOrigin,
  normalizeCheckInSource,
} from '../checkInContext';

describe('checkInContext', () => {
  it('normalizes known practice sources', () => {
    expect(normalizeCheckInSource('regulation')).toBe(CHECK_IN_SOURCE.REGULATION);
    expect(normalizeCheckInSource(true)).toBe(CHECK_IN_SOURCE.BREATHWORK);
    expect(normalizeCheckInSource('unknown')).toBeNull();
  });

  it('normalizes known check-in origins', () => {
    expect(normalizeCheckInOrigin('regulation')).toBe(CHECK_IN_ORIGIN.REGULATION);
    expect(normalizeCheckInOrigin('unknown')).toBeNull();
  });

  it('derives regulation check-in origin from route context', () => {
    expect(getCheckInOriginFromRouteContext(new URLSearchParams('from=regulation'))).toBe(CHECK_IN_ORIGIN.REGULATION);
    expect(getCheckInOriginFromRouteContext(new URLSearchParams('from=dashboard'))).toBeNull();
    expect(getCheckInOriginFromRouteContext(null)).toBeNull();
  });

  it('keeps regulation check-ins returning to the toolkit', () => {
    expect(getCheckInBackRoute('regulation')).toBe('/tools/regulation');
    expect(getCheckInBackRoute('grounding', 'regulation')).toBe('/tools/regulation');
  });

  it('keeps non-regulation practice check-ins returning to sanctuary', () => {
    expect(getCheckInBackRoute('breathwork')).toBe('/dashboard');
    expect(getCheckInBackRoute('grounding')).toBe('/dashboard');
    expect(getCheckInBackRoute(null)).toBe('/journal');
  });

  it('builds sourced check-in routes', () => {
    expect(buildCheckInRoute('regulation')).toBe('/journal/check-in?from=regulation');
    expect(buildCheckInRoute('grounding', 'regulation')).toBe('/journal/check-in?from=grounding&origin=regulation');
    expect(buildCheckInRoute(null)).toBe('/journal/check-in');
  });

  it('builds sourced success routes', () => {
    expect(buildCheckInSuccessRoute({ source: 'regulation', entryId: 'entry-1' }))
      .toBe('/journal/saved?type=check_in&from=regulation&entry=entry-1');
    expect(buildCheckInSuccessRoute({ source: 'grounding', origin: 'regulation', entryId: 'entry-1' }))
      .toBe('/journal/saved?type=check_in&from=grounding&origin=regulation&entry=entry-1');
  });
});
