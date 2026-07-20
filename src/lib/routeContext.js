import { ROUTES } from '@/lib/constants';

export const ROUTE_CONTEXT = {
  CALM: 'calm',
  DASHBOARD: 'dashboard',
  POST_LOG: 'post-log',
  REGULATION: 'regulation',
};

const CONTEXT_BACK_ROUTES = {
  [ROUTE_CONTEXT.CALM]: ROUTES.DASHBOARD,
  [ROUTE_CONTEXT.DASHBOARD]: ROUTES.DASHBOARD,
  [ROUTE_CONTEXT.POST_LOG]: ROUTES.JOURNAL,
  [ROUTE_CONTEXT.REGULATION]: ROUTES.REGULATION_TOOLKIT,
};

const CONTEXT_BACK_LABELS = {
  [ROUTE_CONTEXT.CALM]: 'Sanctuary',
  [ROUTE_CONTEXT.DASHBOARD]: 'Sanctuary',
  [ROUTE_CONTEXT.POST_LOG]: 'Journal',
  [ROUTE_CONTEXT.REGULATION]: 'Toolkit',
};

export function withRouteContext(route, context) {
  if (!context) return route;

  const [path, query = ''] = route.split('?');
  const params = new URLSearchParams(query);
  params.set('from', context);

  const nextQuery = params.toString();
  return nextQuery ? `${path}?${nextQuery}` : path;
}

export function getContextualBackRoute(searchParams, fallback = ROUTES.TOOLS) {
  return CONTEXT_BACK_ROUTES[searchParams?.get('from')] || fallback;
}

export function getContextualBackLabel(searchParams, fallback = 'Practices') {
  return CONTEXT_BACK_LABELS[searchParams?.get('from')] || fallback;
}
