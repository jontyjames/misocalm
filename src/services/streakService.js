/**
 * Streak Service
 * Handles user activity streaks
 */

import { db } from './supabase';

export const streakService = {
  /**
   * Get streak data for a user
   */
  async get(userId) {
    const { data, error } = await db.select('streaks', '*', { user_id: userId });
    return { data: data?.[0] || null, error };
  },

  /**
   * Initialize streak for a new user
   */
  async initialize(userId) {
    const today = new Date().toISOString().split('T')[0];

    return db.insert('streaks', {
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
    });
  },

  /**
   * Record activity for today
   * Updates streak based on last activity date
   */
  async recordActivity(userId) {
    const { data: streak, error: fetchError } = await this.get(userId);

    if (fetchError) {
      return { data: null, error: fetchError };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // No existing streak - create one
    if (!streak) {
      return this.initialize(userId);
    }

    // Already recorded today
    if (streak.last_activity_date === todayStr) {
      return { data: streak, error: null };
    }

    // Calculate days since last activity
    const lastActivity = new Date(streak.last_activity_date);
    const daysDiff = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newCurrentStreak;
    let newLongestStreak = streak.longest_streak;

    if (daysDiff === 1) {
      // Consecutive day - increment streak
      newCurrentStreak = streak.current_streak + 1;
    } else if (daysDiff > 1) {
      // Streak broken - reset to 1
      newCurrentStreak = 1;
    } else {
      // Same day (shouldn't happen due to check above)
      newCurrentStreak = streak.current_streak;
    }

    // Update longest streak if needed
    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    return db.update('streaks', streak.id, {
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      last_activity_date: todayStr,
    });
  },

  /**
   * Check if user has logged activity today
   */
  async hasActivityToday(userId) {
    const { data: streak, error } = await this.get(userId);

    if (error || !streak) {
      return { hasActivity: false, error };
    }

    const today = new Date().toISOString().split('T')[0];
    return { hasActivity: streak.last_activity_date === today, error: null };
  },

  /**
   * Get streak summary
   */
  async getSummary(userId) {
    const { data: streak, error } = await this.get(userId);

    if (error) {
      return { summary: null, error };
    }

    if (!streak) {
      return {
        summary: {
          currentStreak: 0,
          longestStreak: 0,
          hasActivityToday: false,
          lastActivityDate: null,
        },
        error: null,
      };
    }

    const today = new Date().toISOString().split('T')[0];

    return {
      summary: {
        currentStreak: streak.current_streak,
        longestStreak: streak.longest_streak,
        hasActivityToday: streak.last_activity_date === today,
        lastActivityDate: streak.last_activity_date,
      },
      error: null,
    };
  },

  /**
   * Reset streak (for testing or admin purposes)
   */
  async reset(userId) {
    const { data: streak, error: fetchError } = await this.get(userId);

    if (fetchError || !streak) {
      return { error: fetchError || 'No streak found' };
    }

    return db.update('streaks', streak.id, {
      current_streak: 0,
      last_activity_date: null,
    });
  },
};

export default streakService;
