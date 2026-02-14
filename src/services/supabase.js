/**
 * Supabase Client with Timeout Wrappers
 * All Supabase calls should go through this service
 */

import { createClient } from '@supabase/supabase-js';
import { API_TIMEOUT } from '@/lib/constants';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

/**
 * Wraps a promise with a timeout
 */
function withTimeout(promise, ms = API_TIMEOUT) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]);
}

/**
 * Retry a function with exponential backoff
 */
async function withRetry(fn, { maxRetries = 3, baseDelay = 1000 } = {}) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // Don't retry on auth errors or client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Database operations with timeout and error handling
 */
export const db = {
  /**
   * Select query with timeout
   */
  async select(table, query = '*', filters = {}) {
    try {
      let q = supabase.from(table).select(query);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          q = q.eq(key, value);
        }
      });

      const { data, error } = await withTimeout(q);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`DB select error (${table}):`, error);
      return { data: null, error: error.message || 'Database query failed' };
    }
  },

  /**
   * Insert with timeout
   */
  async insert(table, data) {
    try {
      const { data: result, error } = await withTimeout(
        supabase.from(table).insert(data).select()
      );

      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      console.error(`DB insert error (${table}):`, error);
      return { data: null, error: error.message || 'Insert failed' };
    }
  },

  /**
   * Update with timeout
   */
  async update(table, id, data) {
    try {
      const { data: result, error } = await withTimeout(
        supabase.from(table).update(data).eq('id', id).select()
      );

      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      console.error(`DB update error (${table}):`, error);
      return { data: null, error: error.message || 'Update failed' };
    }
  },

  /**
   * Delete with timeout
   */
  async delete(table, id) {
    try {
      const { error } = await withTimeout(
        supabase.from(table).delete().eq('id', id)
      );

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`DB delete error (${table}):`, error);
      return { error: error.message || 'Delete failed' };
    }
  },

  /**
   * Raw query for complex operations
   */
  async query(callback) {
    try {
      const result = await withTimeout(callback(supabase));
      if (result.error) throw result.error;
      return { data: result.data, error: null };
    } catch (error) {
      console.error('DB query error:', error);
      return { data: null, error: error.message || 'Query failed' };
    }
  },

  /**
   * Paginated select with count
   * @param {string} table - Table name
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-indexed)
   * @param {number} options.limit - Items per page (default 20)
   * @param {string} options.orderBy - Column to order by
   * @param {boolean} options.ascending - Sort direction (default false = descending)
   * @param {Object} options.filters - Key-value filters
   * @param {string} options.query - Select query (default '*')
   * @returns {{ data, count, pagination: { page, limit, total, totalPages, hasMore } }}
   */
  async selectPaginated(table, options = {}) {
    const {
      page = 1,
      limit = 20,
      orderBy = 'created_at',
      ascending = false,
      filters = {},
      query = '*',
    } = options;

    try {
      // Calculate offset
      const offset = (page - 1) * limit;

      // Build query with count
      let q = supabase
        .from(table)
        .select(query, { count: 'exact' })
        .order(orderBy, { ascending })
        .range(offset, offset + limit - 1);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          q = q.eq(key, value);
        }
      });

      const { data, count, error } = await withTimeout(q);

      if (error) throw error;

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data,
        count,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasMore: page < totalPages,
        },
        error: null,
      };
    } catch (error) {
      console.error(`DB selectPaginated error (${table}):`, error);
      return {
        data: null,
        count: 0,
        pagination: { page, limit, total: 0, totalPages: 0, hasMore: false },
        error: error.message || 'Paginated query failed',
      };
    }
  },

  /**
   * Select with retry for resilience
   */
  async selectWithRetry(table, query = '*', filters = {}, retryOptions = {}) {
    return withRetry(async () => {
      const result = await this.select(table, query, filters);
      if (result.error) throw new Error(result.error);
      return result;
    }, retryOptions);
  },

  /**
   * Insert with retry for resilience
   */
  async insertWithRetry(table, data, retryOptions = {}) {
    return withRetry(async () => {
      const result = await this.insert(table, data);
      if (result.error) throw new Error(result.error);
      return result;
    }, retryOptions);
  },
};

/**
 * Auth operations with timeout
 */
export const auth = {
  /**
   * Send OTP code to email (no magic link redirect)
   */
  async sendOtp(email) {
    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          },
        })
      );

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Auth OTP error:', error);
      return { error: error.message || 'Failed to send code' };
    }
  },

  /**
   * Verify OTP code entered by user
   */
  async verifyOtp(email, token) {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.verifyOtp({
          email,
          token,
          type: 'email',
        })
      );

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Auth verify OTP error:', error);
      return { data: null, error: error.message || 'Invalid code' };
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await withTimeout(supabase.auth.getSession());
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error) {
      console.error('Auth session error:', error);
      return { session: null, error: error.message || 'Failed to get session' };
    }
  },

  /**
   * Get current user
   */
  async getUser() {
    try {
      const { data, error } = await withTimeout(supabase.auth.getUser());
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Auth user error:', error);
      return { user: null, error: error.message || 'Failed to get user' };
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await withTimeout(supabase.auth.signOut());
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Auth signout error:', error);
      return { error: error.message || 'Failed to sign out' };
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

/**
 * Test database connectivity
 */
export async function testConnection() {
  try {
    const start = Date.now();

    // Test auth
    const { session, error: sessionError } = await auth.getSession();

    // Test database - try to select from a table (will fail gracefully if table doesn't exist)
    const { error: dbError } = await db.query((client) =>
      client.from('users').select('id').limit(1)
    );

    const duration = Date.now() - start;

    return {
      connected: true,
      duration,
      hasSession: !!session,
      sessionError: sessionError || null,
      dbError: dbError || null,
      supabaseUrl: supabaseUrl ? 'configured' : 'missing',
      supabaseKey: supabaseAnonKey ? 'configured' : 'missing',
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      supabaseUrl: supabaseUrl ? 'configured' : 'missing',
      supabaseKey: supabaseAnonKey ? 'configured' : 'missing',
    };
  }
}
