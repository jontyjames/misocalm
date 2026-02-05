/**
 * Rate Limiting Utility
 * Provides rate limiting for API routes to prevent abuse
 */

/**
 * In-memory rate limiter using sliding window
 * Note: For production with multiple servers, use Redis instead
 */
class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.cleanupInterval = null;
  }

  /**
   * Start periodic cleanup of expired entries
   */
  startCleanup(intervalMs = 60000) {
    if (this.cleanupInterval) return;
    this.cleanupInterval = setInterval(() => this.cleanup(), intervalMs);
  }

  /**
   * Stop periodic cleanup
   */
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      // Remove entries older than 10 minutes
      if (now - data.windowStart > 600000) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Check if request is allowed
   * @param {string} key - Unique identifier (e.g., user ID or IP)
   * @param {number} limit - Max requests allowed
   * @param {number} interval - Time window in milliseconds
   * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
   */
  check(key, limit, interval) {
    const now = Date.now();
    const data = this.requests.get(key);

    // New window or expired window
    if (!data || now - data.windowStart >= interval) {
      this.requests.set(key, {
        count: 1,
        windowStart: now,
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt: now + interval,
      };
    }

    // Within current window
    if (data.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.windowStart + interval,
      };
    }

    // Increment count
    data.count++;
    return {
      allowed: true,
      remaining: limit - data.count,
      resetAt: data.windowStart + interval,
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key) {
    this.requests.delete(key);
  }
}

// Singleton instance
const limiter = new RateLimiter();
limiter.startCleanup();

/**
 * Create a rate limit configuration
 * @param {Object} options
 * @param {number} options.limit - Max requests (default 20)
 * @param {number} options.interval - Time window in ms (default 60000 = 1 minute)
 * @returns {Object} Rate limit configuration
 */
export function rateLimit({ limit = 20, interval = 60000 } = {}) {
  return { limit, interval };
}

/**
 * Check rate limit for a request
 * @param {string} key - Unique identifier (user ID, IP, etc.)
 * @param {Object} config - Rate limit configuration from rateLimit()
 * @returns {{ success: boolean, remaining: number, resetAt: number }}
 */
export function checkRateLimit(key, config) {
  const { limit, interval } = config;
  const result = limiter.check(key, limit, interval);

  return {
    success: result.allowed,
    remaining: result.remaining,
    resetAt: result.resetAt,
  };
}

/**
 * Rate limit middleware for Next.js API routes
 * @param {Object} config - Rate limit configuration
 * @returns {Function} Middleware function
 */
export function rateLimitMiddleware(config) {
  return (req) => {
    // Get identifier - prefer user ID, fall back to IP
    const userId = req.headers.get('x-user-id');
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown';
    const key = userId || ip;

    return checkRateLimit(key, config);
  };
}

/**
 * Create rate limit response headers
 */
export function rateLimitHeaders(result) {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
  };
}

/**
 * Create a 429 response for rate limited requests
 */
export function rateLimitResponse(result) {
  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please wait before trying again.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        ...rateLimitHeaders(result),
      },
    }
  );
}

/**
 * Reset rate limit for a user (e.g., after successful payment)
 */
export function resetRateLimit(key) {
  limiter.reset(key);
}

export default limiter;
