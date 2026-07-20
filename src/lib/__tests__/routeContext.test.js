import { describe, expect, it } from 'vitest';
import { ROUTE_CONTEXT, getContextualBackLabel, getContextualBackRoute, withRouteContext } from '../routeContext';

describe('route context helpers', () => {
  it('adds a source context to routes without query params', () => {
    expect(withRouteContext('/tools/regulation/sound-support', ROUTE_CONTEXT.REGULATION))
      .toBe('/tools/regulation/sound-support?from=regulation');
  });

  it('preserves existing query params when adding route context', () => {
    expect(withRouteContext('/tools/4?duration=quick', ROUTE_CONTEXT.REGULATION))
      .toBe('/tools/4?duration=quick&from=regulation');
  });

  it('replaces stale source context instead of duplicating it', () => {
    expect(withRouteContext('/tools/4?duration=quick&from=home', ROUTE_CONTEXT.REGULATION))
      .toBe('/tools/4?duration=quick&from=regulation');
  });

  it('returns the regulation toolkit when opened from regulation context', () => {
    const params = new URLSearchParams('from=regulation');

    expect(getContextualBackRoute(params, '/tools')).toBe('/tools/regulation');
  });

  it('returns context-specific back routes for app entry points', () => {
    expect(getContextualBackRoute(new URLSearchParams('from=calm'), '/tools')).toBe('/dashboard');
    expect(getContextualBackRoute(new URLSearchParams('from=dashboard'), '/tools')).toBe('/dashboard');
    expect(getContextualBackRoute(new URLSearchParams('from=post-log'), '/tools')).toBe('/journal');
  });

  it('returns context-specific labels that match back routes', () => {
    expect(getContextualBackLabel(new URLSearchParams('from=calm'))).toBe('Sanctuary');
    expect(getContextualBackLabel(new URLSearchParams('from=dashboard'))).toBe('Sanctuary');
    expect(getContextualBackLabel(new URLSearchParams('from=post-log'))).toBe('Journal');
    expect(getContextualBackLabel(new URLSearchParams('from=regulation'))).toBe('Toolkit');
    expect(getContextualBackLabel(new URLSearchParams(), 'Tools')).toBe('Tools');
  });

  it('falls back when there is no recognised source context', () => {
    expect(getContextualBackRoute(new URLSearchParams('from=home'), '/tools')).toBe('/tools');
    expect(getContextualBackRoute(new URLSearchParams(), '/tools')).toBe('/tools');
  });
});
