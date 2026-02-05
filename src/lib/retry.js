/**
 * Retry Utility
 * Provides exponential backoff retry logic for resilient API calls
 */

/**
 * Execute a function with exponential backoff retry
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retry attempts (default 3)
 * @param {number} options.baseDelay - Base delay in ms (default 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default 30000)
 * @param {Function} options.shouldRetry - Function to determine if error is retryable
 * @param {Function} options.onRetry - Callback called before each retry
 * @returns {Promise} - Result of the function
 */
export async function withRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = defaultShouldRetry,
    onRetry = () => {},
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff and jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 0.1 * exponentialDelay;
      const delay = Math.min(exponentialDelay + jitter, maxDelay);

      // Notify callback
      onRetry({ attempt: attempt + 1, delay, error });

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Default function to determine if an error is retryable
 */
function defaultShouldRetry(error) {
  // Don't retry on authentication errors
  if (error.status === 401 || error.status === 403) {
    return false;
  }

  // Don't retry on client errors (except rate limiting)
  if (error.status >= 400 && error.status < 500 && error.status !== 429) {
    return false;
  }

  // Retry on network errors, timeouts, and server errors
  return true;
}

/**
 * Sleep for a specified duration
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a retryable version of a function
 * @param {Function} fn - Function to wrap
 * @param {Object} options - Retry options
 * @returns {Function} - Wrapped function with retry logic
 */
export function createRetryable(fn, options = {}) {
  return (...args) => withRetry(() => fn(...args), options);
}

/**
 * Retry with timeout
 * Combines retry logic with a timeout for each attempt
 */
export async function withRetryAndTimeout(fn, options = {}) {
  const { timeout = 10000, ...retryOptions } = options;

  return withRetry(async () => {
    return Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      ),
    ]);
  }, retryOptions);
}
