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
   * Create a check-in entry
   */
  async createCheckIn(data) {
    return db.insert('trigger_logs', {
      user_id: data.user_id,
      entry_type: 'check_in',
      energy: data.energy,
      pleasantness: data.pleasantness,
      body_sensation: data.body_sensation || null,
      source_practice: data.source_practice || null,
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
        .select('triggers, intensity, trigger_intensities, source, environment, created_at, body_responses, time_of_day, deeper_processing, entry_type')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
    );

    // Filter to trigger entries only for stats (check-ins tracked separately)
    const triggerData = data?.filter(d => d.entry_type !== 'check_in') || [];

    if (error || !data) {
      return { stats: null, error };
    }

    // Calculate statistics
    const stats = {
      totalLogs: triggerData.length,
      averageIntensity: 0,
      triggerCounts: {},
      sourceCounts: {},
      environmentCounts: {},
      byDay: {},
      bodyResponseCounts: {},
      timeOfDayCounts: {},
      triggerSourcePairs: {},
      deeperCount: 0,
      // Per-trigger intensity tracking
      triggerIntensityHistory: {},    // { triggerName: [{ date, intensity }] }
      averageIntensityByTrigger: {}, // { triggerName: number }
    };

    if (triggerData.length > 0) {
      let totalIntensity = 0;
      const triggerIntensitySums = {};
      const triggerIntensityCounts = {};

      triggerData.forEach((log) => {
        totalIntensity += log.intensity || 0;
        const logDate = log.created_at.split('T')[0];

        // Per-trigger intensity from JSONB (new format)
        if (log.trigger_intensities && typeof log.trigger_intensities === 'object') {
          Object.entries(log.trigger_intensities).forEach(([trigger, intensity]) => {
            stats.triggerCounts[trigger] = (stats.triggerCounts[trigger] || 0) + 1;

            // Track intensity history
            if (!stats.triggerIntensityHistory[trigger]) {
              stats.triggerIntensityHistory[trigger] = [];
            }
            stats.triggerIntensityHistory[trigger].push({ date: logDate, intensity });

            // Sum for averages
            triggerIntensitySums[trigger] = (triggerIntensitySums[trigger] || 0) + intensity;
            triggerIntensityCounts[trigger] = (triggerIntensityCounts[trigger] || 0) + 1;
          });
        } else if (Array.isArray(log.triggers)) {
          // Fallback: old format (triggers array + single intensity)
          log.triggers.forEach((trigger) => {
            stats.triggerCounts[trigger] = (stats.triggerCounts[trigger] || 0) + 1;

            if (log.intensity != null) {
              if (!stats.triggerIntensityHistory[trigger]) {
                stats.triggerIntensityHistory[trigger] = [];
              }
              stats.triggerIntensityHistory[trigger].push({ date: logDate, intensity: log.intensity });
              triggerIntensitySums[trigger] = (triggerIntensitySums[trigger] || 0) + log.intensity;
              triggerIntensityCounts[trigger] = (triggerIntensityCounts[trigger] || 0) + 1;
            }

            // Track trigger + source pairs (old data only)
            const sources = Array.isArray(log.source) ? log.source : (log.source ? [log.source] : []);
            sources.forEach((src) => {
              const pair = `${trigger}::${src}`;
              if (!stats.triggerSourcePairs[pair]) {
                stats.triggerSourcePairs[pair] = { count: 0, totalIntensity: 0 };
              }
              stats.triggerSourcePairs[pair].count += 1;
              stats.triggerSourcePairs[pair].totalIntensity += log.intensity || 0;
            });
          });
        }

        // Environment counts (new field)
        if (log.environment) {
          stats.environmentCounts[log.environment] = (stats.environmentCounts[log.environment] || 0) + 1;
        }

        // Source counts (old field, for backward compat)
        const sources = Array.isArray(log.source) ? log.source : (log.source ? [log.source] : []);
        sources.forEach((src) => {
          stats.sourceCounts[src] = (stats.sourceCounts[src] || 0) + 1;
        });

        stats.byDay[logDate] = (stats.byDay[logDate] || 0) + 1;

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

      stats.averageIntensity = Math.round((totalIntensity / triggerData.length) * 10) / 10;

      // Compute per-trigger averages
      Object.keys(triggerIntensitySums).forEach(trigger => {
        stats.averageIntensityByTrigger[trigger] = Math.round(
          (triggerIntensitySums[trigger] / triggerIntensityCounts[trigger]) * 10
        ) / 10;
      });
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
