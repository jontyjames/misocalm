/**
 * Trigger Log Service
 * Handles all trigger log data operations
 */

import { db } from './supabase';

export const triggerLogService = {
  /**
   * Get paginated trigger logs for a user
   */
  async getAll(userId, options = {}) {
    return db.selectPaginated('trigger_logs', {
      ...options,
      filters: { user_id: userId, ...options.filters },
      orderBy: options.orderBy || 'created_at',
      ascending: options.ascending ?? false,
    });
  },

  /**
   * Get a single trigger log by ID
   */
  async getById(logId, userId) {
    const { data, error } = await db.select('trigger_logs', '*', {
      id: logId,
      user_id: userId,
    });
    return { data: data?.[0] || null, error };
  },

  /**
   * Create a new trigger log
   */
  async create(data) {
    return db.insert('trigger_logs', {
      ...data,
      created_at: new Date().toISOString(),
    });
  },

  /**
   * Update a trigger log
   */
  async update(logId, data) {
    return db.update('trigger_logs', logId, data);
  },

  /**
   * Delete a trigger log
   */
  async delete(logId) {
    return db.delete('trigger_logs', logId);
  },

  /**
   * Get trigger statistics for a user
   * @param {string} userId
   * @param {number} days - Number of days to look back
   */
  async getStats(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await db.query((supabase) =>
      supabase
        .from('trigger_logs')
        .select('triggers, intensity, source, created_at, body_responses, time_of_day, deeper_processing')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
    );

    if (error || !data) {
      return { stats: null, error };
    }

    // Calculate statistics
    const stats = {
      totalLogs: data.length,
      averageIntensity: 0,
      triggerCounts: {},
      sourceCounts: {},
      byDay: {},
      bodyResponseCounts: {},
      timeOfDayCounts: {},
      triggerSourcePairs: {},
      deeperCount: 0,
    };

    if (data.length > 0) {
      let totalIntensity = 0;

      data.forEach((log) => {
        totalIntensity += log.intensity || 0;

        if (Array.isArray(log.triggers)) {
          log.triggers.forEach((trigger) => {
            stats.triggerCounts[trigger] = (stats.triggerCounts[trigger] || 0) + 1;

            // Track trigger + source pairs
            if (log.source) {
              const pair = `${trigger}::${log.source}`;
              if (!stats.triggerSourcePairs[pair]) {
                stats.triggerSourcePairs[pair] = { count: 0, totalIntensity: 0 };
              }
              stats.triggerSourcePairs[pair].count += 1;
              stats.triggerSourcePairs[pair].totalIntensity += log.intensity || 0;
            }
          });
        }

        if (log.source) {
          stats.sourceCounts[log.source] = (stats.sourceCounts[log.source] || 0) + 1;
        }

        const day = log.created_at.split('T')[0];
        stats.byDay[day] = (stats.byDay[day] || 0) + 1;

        if (Array.isArray(log.body_responses)) {
          log.body_responses.forEach((br) => {
            stats.bodyResponseCounts[br] = (stats.bodyResponseCounts[br] || 0) + 1;
          });
        }

        if (log.time_of_day) {
          stats.timeOfDayCounts[log.time_of_day] = (stats.timeOfDayCounts[log.time_of_day] || 0) + 1;
        }

        if (log.deeper_processing) {
          stats.deeperCount += 1;
        }
      });

      stats.averageIntensity = Math.round((totalIntensity / data.length) * 10) / 10;
    }

    return { stats, error: null };
  },

  /**
   * Get recent logs for a user (last N logs)
   */
  async getRecent(userId, limit = 5) {
    return db.selectPaginated('trigger_logs', {
      page: 1,
      limit,
      filters: { user_id: userId },
      orderBy: 'created_at',
      ascending: false,
    });
  },
};

export default triggerLogService;
