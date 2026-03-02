/**
 * Analytics Service
 * Client-side service for admin analytics queries.
 * Follows existing service pattern (toolService, triggerLogService).
 */

import { supabase } from './supabase';

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

async function adminFetch(params) {
  const headers = await getAuthHeaders();
  if (!headers) return { data: null, error: 'Not authenticated' };

  const query = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`/api/admin/analytics?${query}`, { headers });
    const data = await res.json();
    if (!res.ok) return { data: null, error: data.error || `HTTP ${res.status}` };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

export const analyticsService = {
  /**
   * Overview: event counts, unique users, active sessions
   * @param {number} hours - Lookback period (default 24)
   */
  async getOverview(hours = 24) {
    return adminFetch({ mode: 'overview', hours: String(hours) });
  },

  /**
   * Filtered event listing
   */
  async getEvents(filters = {}) {
    return adminFetch({ mode: 'events', ...filters });
  },

  /**
   * Full event timeline for one user/anonymous visitor
   */
  async getJourney(params) {
    return adminFetch({ mode: 'journey', ...params });
  },

  /**
   * Onboarding funnel with step completion rates
   */
  async getFunnel() {
    return adminFetch({ mode: 'funnel' });
  },

  /**
   * Recent sessions with metadata
   */
  async getSessions(limit = 50) {
    return adminFetch({ mode: 'sessions', limit: String(limit) });
  },

  /**
   * Live feed of most recent events
   */
  async getLive(limit = 30) {
    return adminFetch({ mode: 'live', limit: String(limit) });
  },
};

export default analyticsService;
