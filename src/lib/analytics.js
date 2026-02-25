/**
 * Analytics Library
 * Tracks user events for monitoring and insights
 */

// Event types
export const EVENTS = {
  // Trigger events
  TRIGGER_LOGGED: 'trigger_logged',
  TRIGGER_DELETED: 'trigger_deleted',
  CHECK_IN_LOGGED: 'check_in_logged',

  // Chat events
  CHAT_SENT: 'chat_sent',
  CHAT_RECEIVED: 'chat_received',
  CHAT_ERROR: 'chat_error',

  // Tool events
  TOOL_STARTED: 'tool_started',
  TOOL_COMPLETED: 'tool_completed',

  // Auth events
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',

  // Navigation events
  PAGE_VIEW: 'page_view',

  // Error events
  ERROR: 'error',
  API_ERROR: 'api_error',

  // Feature events
  BREATHING_STARTED: 'breathing_started',
  BREATHING_COMPLETED: 'breathing_completed',
  SOUNDSCAPE_PLAYED: 'soundscape_played',

  // Streak events
  STREAK_UPDATED: 'streak_updated',
};

/**
 * Analytics class for tracking events
 * Can be extended to send to external services (Mixpanel, Amplitude, etc.)
 */
class Analytics {
  constructor() {
    this.enabled = true;
    this.debug = process.env.NODE_ENV === 'development';
    this.queue = [];
    this.userId = null;
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set the current user ID
   */
  setUserId(userId) {
    this.userId = userId;
  }

  /**
   * Clear user ID (on logout)
   */
  clearUserId() {
    this.userId = null;
  }

  /**
   * Enable or disable analytics
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Track an event
   * @param {string} eventName - Name of the event
   * @param {Object} properties - Event properties
   */
  track(eventName, properties = {}) {
    if (!this.enabled) return;

    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
      },
    };

    // Log in development only
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics]', eventName, properties);
    }

    // Add to queue for batching
    this.queue.push(event);

    // Analytics service pending selection (Mixpanel, Amplitude, or PostHog).
    // Events are queued locally until a provider is configured.
  }

  /**
   * Track a page view
   */
  pageView(pageName, properties = {}) {
    this.track(EVENTS.PAGE_VIEW, {
      page: pageName,
      url: typeof window !== 'undefined' ? window.location.pathname : '',
      ...properties,
    });
  }

  /**
   * Track an error
   */
  error(error, context = {}) {
    this.track(EVENTS.ERROR, {
      message: error?.message || String(error),
      stack: error?.stack,
      ...context,
    });
  }

  /**
   * Track trigger logged
   */
  triggerLogged(properties = {}) {
    this.track(EVENTS.TRIGGER_LOGGED, properties);
  }

  /**
   * Track chat message sent
   */
  chatSent(properties = {}) {
    this.track(EVENTS.CHAT_SENT, properties);
  }

  /**
   * Track tool completion
   */
  toolCompleted(toolId, toolName, properties = {}) {
    this.track(EVENTS.TOOL_COMPLETED, {
      toolId,
      toolName,
      ...properties,
    });
  }

  /**
   * Flush the event queue
   * Call this periodically or on page unload
   */
  flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    // Batched send pending analytics provider selection.
    // Events are captured and discarded until a service is configured.
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics] Flushing', events.length, 'events');
    }
  }

  /**
   * Get all queued events (for debugging)
   */
  getQueue() {
    return [...this.queue];
  }
}

// Singleton instance
const analytics = new Analytics();

// Convenience functions
export const track = (eventName, properties) => analytics.track(eventName, properties);
export const pageView = (pageName, properties) => analytics.pageView(pageName, properties);
export const trackError = (error, context) => analytics.error(error, context);
export const setUserId = (userId) => analytics.setUserId(userId);
export const clearUserId = () => analytics.clearUserId();
export const flush = () => analytics.flush();

export default analytics;
