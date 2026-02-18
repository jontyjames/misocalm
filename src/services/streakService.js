/**
 * Activity Service
 * Tracks active days — no streaks, no pressure
 * "Active days in last 30" pattern per UX philosophy
 */

import { db } from './supabase';
import { toLocalDateStr } from '@/lib/dateUtils';

export const streakService = {
  /**
   * Get activity data for a user
   */
  async get(userId) {
    const { data, error } = await db.select('streaks', '*', { user_id: userId });
    return { data: data?.[0] || null, error };
  },

  /**
   * Initialize activity tracking for a new user
   */
  async initialize(userId) {
    const today = toLocalDateStr();

    return db.insert('streaks', {
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
    });
  },

  /**
   * Record activity for today
   * Simply marks today as active — no streak pressure
   */
  async recordActivity(userId) {
    const { data: activity, error: fetchError } = await this.get(userId);

    if (fetchError) {
      return { data: null, error: fetchError };
    }

    const todayStr = toLocalDateStr();

    if (!activity) {
      return this.initialize(userId);
    }

    // Already recorded today
    if (activity.last_activity_date === todayStr) {
      return { data: activity, error: null };
    }

    // Calculate days since last activity using local dates
    // Parse both as local midnight to avoid UTC offset issues
    const [ty, tm, td] = todayStr.split('-').map(Number);
    const [ly, lm, ld] = activity.last_activity_date.split('-').map(Number);
    const todayLocal = new Date(ty, tm - 1, td);
    const lastLocal = new Date(ly, lm - 1, ld);
    const daysDiff = Math.round((todayLocal - lastLocal) / (1000 * 60 * 60 * 24));

    // Track consecutive days quietly (for divine number milestones)
    const activeDays = daysDiff === 1
      ? activity.current_streak + 1
      : 1;

    const longestRun = Math.max(activeDays, activity.longest_streak);

    return db.update('streaks', activity.id, {
      current_streak: activeDays,
      longest_streak: longestRun,
      last_activity_date: todayStr,
    });
  },

  /**
   * Check if user has logged activity today
   */
  async hasActivityToday(userId) {
    const { data: activity, error } = await this.get(userId);

    if (error || !activity) {
      return { hasActivity: false, error };
    }

    const today = toLocalDateStr();
    return { hasActivity: activity.last_activity_date === today, error: null };
  },

  /**
   * Get activity summary
   * Frames progress through active days, not competition
   */
  async getSummary(userId) {
    const { data: activity, error } = await this.get(userId);

    if (error) {
      return { summary: null, error };
    }

    if (!activity) {
      return {
        summary: {
          activeDays: 0,
          longestRun: 0,
          hasActivityToday: false,
          lastActivityDate: null,
        },
        error: null,
      };
    }

    const today = toLocalDateStr();

    return {
      summary: {
        activeDays: activity.current_streak,
        longestRun: activity.longest_streak,
        hasActivityToday: activity.last_activity_date === today,
        lastActivityDate: activity.last_activity_date,
      },
      error: null,
    };
  },

  /**
   * Reset activity (for testing or admin purposes)
   */
  async reset(userId) {
    const { data: activity, error: fetchError } = await this.get(userId);

    if (fetchError || !activity) {
      return { error: fetchError || 'No activity data found' };
    }

    return db.update('streaks', activity.id, {
      current_streak: 0,
      last_activity_date: null,
    });
  },
};

export default streakService;
