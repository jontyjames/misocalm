/**
 * Analytics Engine
 * Privacy-respecting event tracking with offline support.
 *
 * Features:
 * - Session management (30-min inactivity timeout)
 * - Anonymous ID (persistent per device, links pre-login journey)
 * - Batch queue (flush every 30s or at 10 events)
 * - sendBeacon on page unload (never lose the last batch)
 * - IndexedDB fallback for offline/PWA
 * - SSR-safe (all browser APIs guarded)
 */

// ─── Event taxonomy (noun_verb pattern) ─────────────────────

export const EVENTS = {
  // Navigation
  PAGE_VIEWED: 'page_viewed',

  // Onboarding funnel
  ONBOARDING_STEP_VIEWED: 'onboarding_step_viewed',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Experiences
  EXPERIENCE_STARTED: 'experience_started',
  EXPERIENCE_COMPLETED: 'experience_completed',

  // Tools (breathing, timer)
  TOOL_STARTED: 'tool_started',
  TOOL_COMPLETED: 'tool_completed',

  // Triggers & journaling
  TRIGGER_LOGGED: 'trigger_logged',
  TRIGGER_DELETED: 'trigger_deleted',
  CHECK_IN_LOGGED: 'check_in_logged',

  // Chat
  CHAT_SENT: 'chat_sent',
  CHAT_RECEIVED: 'chat_received',
  CHAT_ERROR: 'chat_error',

  // Auth
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',

  // Streaks
  STREAK_UPDATED: 'streak_updated',

  // Errors
  ERROR: 'error',
  API_ERROR: 'api_error',
};

// ─── Constants ──────────────────────────────────────────────

const IS_BROWSER = typeof window !== 'undefined';
const IS_DEV = process.env.NODE_ENV === 'development';

const FLUSH_INTERVAL_MS = 30_000;      // 30 seconds
const FLUSH_THRESHOLD = 10;            // events before auto-flush
const SESSION_TIMEOUT_MS = 30 * 60_000; // 30 minutes (GA standard)
const MAX_BATCH_SIZE = 100;

const STORAGE_KEY_ANON_ID = 'mc_anon_id';
const STORAGE_KEY_SESSION = 'mc_session';
const IDB_NAME = 'mc_analytics';
const IDB_STORE = 'pending_events';

// ─── Helpers ────────────────────────────────────────────────

function uuid() {
  if (IS_BROWSER && crypto?.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getDeviceType() {
  if (!IS_BROWSER) return 'unknown';
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android/i.test(ua) && !/tablet/i.test(ua)) return 'mobile';
  return 'desktop';
}

// ─── IndexedDB helpers (offline fallback) ───────────────────

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSave(events) {
  try {
    const db = await openIDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    for (const event of events) {
      store.add(event);
    }
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (e) {
    if (IS_DEV) console.warn('[Analytics] IndexedDB save failed:', e);
  }
}

async function idbDrain() {
  try {
    const db = await openIDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const events = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    if (events.length > 0) {
      store.clear();
    }
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return events;
  } catch (e) {
    if (IS_DEV) console.warn('[Analytics] IndexedDB drain failed:', e);
    return [];
  }
}

// ─── Analytics Engine ───────────────────────────────────────

class Analytics {
  constructor() {
    this.queue = [];
    this.userId = null;
    this.enabled = true;
    this._flushTimer = null;
    this._flushing = false;

    if (!IS_BROWSER) return;

    // Persistent anonymous ID (survives across sessions, links pre-login journey)
    this.anonymousId = localStorage.getItem(STORAGE_KEY_ANON_ID);
    if (!this.anonymousId) {
      this.anonymousId = uuid();
      localStorage.setItem(STORAGE_KEY_ANON_ID, this.anonymousId);
    }

    // Session management
    this._initSession();

    // Periodic flush
    this._flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);

    // Flush on page hide (sendBeacon so it doesn't block navigation)
    this._handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') this._beaconFlush();
    };
    this._handlePageHide = () => this._beaconFlush();

    document.addEventListener('visibilitychange', this._handleVisibilityChange);
    window.addEventListener('pagehide', this._handlePageHide);
  }

  // ── Session management ──────────────────────────────────

  _initSession() {
    const raw = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (raw) {
      try {
        const s = JSON.parse(raw);
        const elapsed = Date.now() - s.lastActive;
        if (elapsed < SESSION_TIMEOUT_MS) {
          this.sessionId = s.id;
          this.sessionStart = s.start;
          this._touchSession();
          return;
        }
      } catch { /* corrupt, start fresh */ }
    }
    this._newSession();
  }

  _newSession() {
    this.sessionId = uuid();
    this.sessionStart = Date.now();
    this._persistSession();
  }

  _touchSession() {
    this._persistSession();
  }

  _persistSession() {
    sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
      id: this.sessionId,
      start: this.sessionStart,
      lastActive: Date.now(),
    }));
  }

  _checkSessionTimeout() {
    const raw = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) { this._newSession(); return; }
    try {
      const s = JSON.parse(raw);
      if (Date.now() - s.lastActive >= SESSION_TIMEOUT_MS) {
        this._newSession();
      }
    } catch {
      this._newSession();
    }
  }

  _getSessionPayload() {
    return {
      id: this.sessionId,
      anonymous_id: this.anonymousId,
      user_id: this.userId,
      started_at: new Date(this.sessionStart).toISOString(),
      last_active_at: new Date().toISOString(),
      duration_ms: Date.now() - this.sessionStart,
      device_type: getDeviceType(),
      entry_page: IS_BROWSER ? window.location.pathname : null,
      referrer: IS_BROWSER ? document.referrer || null : null,
    };
  }

  // ── Identity ────────────────────────────────────────────

  identify(userId) {
    this.userId = userId;
    this._touchSession();
  }

  reset() {
    this.userId = null;
    this._touchSession();
  }

  // ── Tracking ────────────────────────────────────────────

  track(eventName, properties = {}) {
    if (!this.enabled || !IS_BROWSER) return;

    this._checkSessionTimeout();
    this._touchSession();

    const event = {
      id: uuid(),
      anonymous_id: this.anonymousId,
      user_id: this.userId,
      session_id: this.sessionId,
      event_name: eventName,
      properties,
      page_url: window.location.pathname,
      created_at: new Date().toISOString(),
    };

    if (IS_DEV) {
      console.log('[Analytics]', eventName, properties);
    }

    this.queue.push(event);

    if (this.queue.length >= FLUSH_THRESHOLD) {
      this.flush();
    }
  }

  // ── Convenience methods ─────────────────────────────────

  pageView(path, properties = {}) {
    this.track(EVENTS.PAGE_VIEWED, {
      path,
      referrer: IS_BROWSER ? document.referrer : '',
      title: IS_BROWSER ? document.title : '',
      ...properties,
    });
  }

  error(error, context = {}) {
    this.track(EVENTS.ERROR, {
      message: error?.message || String(error),
      ...context,
    });
  }

  // ── Flush (send to server) ──────────────────────────────

  async flush() {
    if (!IS_BROWSER || this._flushing) return;
    this._flushing = true;

    try {
      // Drain any previously failed events from IndexedDB
      const stored = await idbDrain();

      // Combine with current queue
      const events = [...stored, ...this.queue.splice(0, MAX_BATCH_SIZE)];
      if (events.length === 0) { this._flushing = false; return; }

      const session = this._getSessionPayload();
      const payload = { events, session };

      const headers = { 'Content-Type': 'application/json' };

      // Attach auth token if available
      try {
        const { supabase } = await import('@/services/supabase');
        const { data } = await supabase.auth.getSession();
        if (data?.session?.access_token) {
          headers['Authorization'] = `Bearer ${data.session.access_token}`;
        }
      } catch { /* no auth available, send anonymous */ }

      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Server rejected, save to IndexedDB for retry
        await idbSave(events);
        if (IS_DEV) console.warn('[Analytics] Flush failed:', res.status);
      } else if (IS_DEV) {
        const json = await res.json();
        console.log('[Analytics] Flushed', json.count, 'events');
      }
    } catch (e) {
      // Network error (offline) — save to IndexedDB
      const failed = this.queue.splice(0);
      if (failed.length > 0) await idbSave(failed);
      if (IS_DEV) console.warn('[Analytics] Flush error (offline?):', e.message);
    } finally {
      this._flushing = false;
    }
  }

  // ── sendBeacon flush (on page unload) ───────────────────

  _beaconFlush() {
    if (this.queue.length === 0) return;

    const events = this.queue.splice(0, MAX_BATCH_SIZE);
    const session = this._getSessionPayload();
    const payload = JSON.stringify({ events, session });

    const sent = navigator.sendBeacon?.('/api/analytics', new Blob([payload], { type: 'application/json' }));

    // If sendBeacon failed or unavailable, save to IndexedDB
    if (!sent) {
      idbSave(events);
    }
  }

  // ── Cleanup ─────────────────────────────────────────────

  destroy() {
    if (!IS_BROWSER) return;
    if (this._flushTimer) clearInterval(this._flushTimer);
    document.removeEventListener('visibilitychange', this._handleVisibilityChange);
    window.removeEventListener('pagehide', this._handlePageHide);
    this._beaconFlush();
  }
}

// ─── Singleton ──────────────────────────────────────────────

const analytics = new Analytics();

// Convenience exports (backwards compatible)
export const track = (eventName, properties) => analytics.track(eventName, properties);
export const pageView = (path, properties) => analytics.pageView(path, properties);
export const trackError = (error, context) => analytics.error(error, context);
export const setUserId = (userId) => analytics.identify(userId);
export const clearUserId = () => analytics.reset();
export const flush = () => analytics.flush();
export const identify = (userId) => analytics.identify(userId);

export default analytics;
